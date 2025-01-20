import { useState } from "react";
import { compareDataAcrossUrls } from "@/lib/utils";
import { getDeploymentCfg } from "@/lib/cfg";
import { fetchData } from "./fetchData";
import { IS_MODE_MULTI } from "./env";
import { Entity, normalizeEntities } from "./entities";
import { Check, normalizeHealth } from "./health";
import { Infos, normalizeInfo } from "./info";
import { Job, normalizeJobs } from "./jobs";
import { MetricsInfo, normalizeMetrics } from "./metrics";
import { normalizeValues } from "./values";
import { Deployment } from "./deployments";

type InfoType = { name: string; info: Infos }[];
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
      if (IS_MODE_MULTI && config.checkDifferences)
        promises.push(checkDifferences());
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
        const newHealthChecks = await fetchData("/api/health", normalizeHealth);
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
      const newHealthChecks = await fetchData("/api/health", normalizeHealth);
      setHealthChecksEntities(newHealthChecks);
    } catch (error) {
      console.error("Error loading health checks:", error);
    }
  };

  const loadInfo = async () => {
    try {
      if (matchingDeployment && Object.keys(matchingDeployment).length > 0) {
        const newInfo = await fetchData("api/info", normalizeInfo);
        if (newInfo.length > 0) {
          setInfo([
            {
              name: (matchingDeployment as Deployment).name,
              info: newInfo as Infos,
            },
          ]);
        } else {
          setInfo([
            {
              name: (matchingDeployment as Deployment).name,
              info: [] as Infos,
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
        const newMetrics = await fetchData("api/metrics", normalizeMetrics);
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
      const newEntities = await fetchData(
        "api/entities",
        normalizeEntities,
        true
      );
      const healthChecks = await fetchData("/api/health", normalizeHealth);

      if (Array.isArray(newEntities)) {
        newEntities.forEach((entity: any) => {
          const hc = healthChecks.find(
            (check: any) =>
              check.name === `entities/${entity.type}/${entity.id}`
          );
          entity.status = hc && hc.state ? hc.state : "UNKNOWN";
        });

        setEntities(newEntities);
      } else {
        console.error("Entities not an array:", newEntities);
      }
    } catch (error) {
      console.error("Error loading entities:", error);
    }
  };

  const loadJobs = async () => {
    try {
      const newJobs = await fetchData("/api/jobs", normalizeJobs, true);
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
      const newValues = await fetchData("/api/values", normalizeValues, true);
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
