import { useState, useEffect, useCallback } from "react";
import { getEntities } from "@/lib/entities";
import { getHealthChecks, summarizeStoreCheck } from "@/lib/health";
import { getInfo } from "@/lib/info";
import { getMetrics } from "@/lib/metrics";
import { getJobs } from "@/lib/jobs";
import { getValues } from "@/lib/values";
import { compareDataAcrossUrls } from "@/lib/utils";
import { Entity } from "@/dev-data/entities";
import { InputInfo } from "@/dev-data/info";
import { MetricsInfo } from "@/dev-data/metrics";
import { Check } from "@/dev-data/health";
import { Deployment } from "@/dev-data/deployments";
import { Job } from "@/dev-data/jobs";
import { getDeploymentCfg } from "@/lib/cfg";

type InfoType = { name: string; info: InputInfo }[];
type MetricsType = { name: string; metrics: MetricsInfo[] };
export type HealthChecksType = { [key: string]: Check[] };
export type NodesDifferent = {
  entities: boolean;
  values: boolean;
};
type DataLoaderConfig = {
  loadEntities?: boolean;
  loadHealthChecks?: boolean;
  loadHealthChecksEntities?: boolean;
  loadInfo?: boolean;
  loadMetrics?: boolean;
  loadJobs?: boolean;
  loadValues?: boolean;
  checkDifferences?: boolean;
};

const defaultConfig: DataLoaderConfig = {
  loadEntities: true,
  loadHealthChecks: true,
  loadInfo: true,
  loadMetrics: true,
  loadJobs: true,
  loadValues: true,
  checkDifferences: true,
};

export function useDataLoader(matchingDeployment?: Deployment) {
  const [isLoading, setIsLoading] = useState(true);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [healthChecks, setHealthChecks] = useState<HealthChecksType>({});
  const [healthChecksEntities, setHealthChecksEntities] = useState<Check[]>([]);
  const [metrics, setMetrics] = useState<MetricsType[]>([
    { name: "", metrics: [{ uptime: -1, memory: -1, apiUrl: "" }] },
  ]);
  const [info, setInfo] = useState<InfoType>([]);
  const [values, setValues] = useState([] as any[]);
  const [cfg, setCfg] = useState({});
  const [hasError, setHasError] = useState(false);
  const [nodesDifferent, setNodesDifferent] = useState({
    entities: false,
    values: false,
  });

  const loadData = async (config: DataLoaderConfig = defaultConfig) => {
    setIsLoading(true);
    try {
      const promises = [];
      if (config.loadHealthChecks) promises.push(loadHealthChecks());
      if (config.loadHealthChecksEntities)
        promises.push(loadHealthChecksEntities());
      if (config.loadInfo) promises.push(loadInfo());
      if (config.loadMetrics) promises.push(loadMetrics());
      if (config.loadEntities) promises.push(loadEntities());
      if (config.loadJobs) promises.push(loadJobs());
      if (config.loadValues) promises.push(loadValues());
      if (config.checkDifferences) promises.push(checkDifferences());
      await Promise.all(promises);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadHealthChecks = async () => {
    try {
      if (matchingDeployment && Object.keys(matchingDeployment).length > 0) {
        let healthChecksObj: HealthChecksType = {};
        const newHealthChecks = await getHealthChecks();
        healthChecksObj[(matchingDeployment as Deployment).name] =
          newHealthChecks;
        setHealthChecks(healthChecksObj);
      }
    } catch (error) {
      console.error("Error loading health checks:", error);
    }
  };

  const loadHealthChecksEntities = async () => {
    try {
      const newHealthChecks = await getHealthChecks();
      setHealthChecksEntities(newHealthChecks);
    } catch (error) {
      console.error("Error loading health checks:", error);
    }
  };

  const loadInfo = async () => {
    try {
      if (matchingDeployment && Object.keys(matchingDeployment).length > 0) {
        const newInfo = await getInfo();
        if (newInfo.length > 0) {
          setInfo([
            {
              name: (matchingDeployment as Deployment).name,
              info: newInfo as InputInfo,
            },
          ]);
        } else {
          setInfo([
            {
              name: (matchingDeployment as Deployment).name,
              info: [] as InputInfo,
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Error loading info:", error);
    }
  };

  const loadMetrics = async () => {
    try {
      if (matchingDeployment && Object.keys(matchingDeployment).length > 0) {
        const newMetrics = await getMetrics();
        setMetrics([
          {
            name: (matchingDeployment as Deployment).name,
            metrics: newMetrics as MetricsInfo[],
          },
        ]);
      }
    } catch (error) {
      console.error("Error loading metrics:", error);
    }
  };

  const loadEntities = async () => {
    try {
      const newEntities = await getEntities();
      const healthChecks = await getHealthChecks();

      newEntities.forEach((entity: any) => {
        const hc = healthChecks.find(
          (check: any) => check.name === `entities/${entity.type}/${entity.id}`
        );
        entity.status = hc && hc.state ? hc.state : "UNKNOWN";
      });

      setEntities(newEntities);
    } catch (error) {
      console.error("Error loading entities:", error);
    }
  };

  const loadJobs = async () => {
    try {
      const newJobs = await getJobs();
      setJobs(newJobs);
    } catch (error) {
      console.error("Error loading jobs:", error);
    }
  };

  const loadCfg = async () => {
    try {
      const newCfg = await getDeploymentCfg();
      if (newCfg.message === "Method not allowed") {
        setHasError(true);
      } else {
        setCfg(newCfg);
      }
    } catch (error) {
      setHasError(true);

      console.error("Error loading cfg:", error);
    }
  };

  const loadValues = async () => {
    try {
      const newValues = await getValues();
      setValues(newValues);
    } catch (error) {
      console.error("Error loading health values:", error);
    }
  };

  const checkDifferences = async () => {
    const differences = await compareDataAcrossUrls();
    const newNodesDifferent = { ...nodesDifferent };

    if (differences.entitiesDifferent) {
      newNodesDifferent.entities = true;
    }
    if (differences.valuesDifferent) {
      newNodesDifferent.values = true;
    }

    setNodesDifferent(newNodesDifferent);
  };

  return {
    isLoading,
    entities,
    jobs,
    healthChecks,
    healthChecksEntities,
    metrics,
    info,
    values,
    cfg,
    hasError,
    nodesDifferent,
    loadData,
  };
}
