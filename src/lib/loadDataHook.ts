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
  const fetchingTimeout = 1000;
  const [fetchError, setFetchError] = useState<{
    [key: string]: string | null;
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [healthChecks, setHealthChecks] = useState<HealthChecksType>({});
  const [healthChecksEntities, setHealthChecksEntities] = useState<Check[]>([]);
  const [metrics, setMetrics] = useState<MetricsType[]>([
    { name: "", metrics: [{ uptime: 0, memory: 0, apiUrl: "" }] },
  ]);
  const [info, setInfo] = useState<InfoType>([]);
  const [values, setValues] = useState([] as any[]);
  const [cfg, setCfg] = useState({});
  const [hasError, setHasError] = useState(false);
  const [nodesDifferent, setNodesDifferent] = useState({
    entities: false,
    values: false,
  });
  const [errorStatus, setErrorStatus] = useState<{ [key: string]: number }>({});

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
      if (IS_MODE_MULTI && config.checkDifferences) {
        promises.push(checkDifferences());
      }
      await Promise.all(promises);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const peek = async (data: any) => {
    let hasError = false;
    const newErrorStatus: { [key: string]: number } = { ...errorStatus };

    const processErrorStatus = (errorStatus: string) => {
      const [code, ...pathParts] = errorStatus.split("/");
      const path = pathParts.join("/");
      const statusCode = parseInt(code, 10);

      if (statusCode === 200) {
        if (newErrorStatus[path]) {
          delete newErrorStatus[path];
        }
      } else if (path) {
        newErrorStatus[path] = statusCode;
      }
    };

    if (data.errorStatus) {
      processErrorStatus(data.errorStatus);
      hasError = true;
      delete data.errorStatus;
    }

    if (Array.isArray(data)) {
      data.forEach((item) => {
        if (item.errorStatus) {
          processErrorStatus(item.errorStatus);
          hasError = true;
          delete item.errorStatus;
        }
      });
    }

    if (hasError) {
      setErrorStatus((prevErrorStatus) => ({
        ...prevErrorStatus,
        ...newErrorStatus,
      }));
    }
    return data;
  };

  const loadHealthChecks = async () => {
    try {
      if (matchingDeployment && Object.keys(matchingDeployment).length > 0) {
        const timeout = new Promise((_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error(
                  `Fetching health took longer than ${fetchingTimeout} ms`
                )
              ),
            fetchingTimeout
          )
        );

        let healthChecksObj: HealthChecksType = {};
        const newHealthChecks = await Promise.race([
          fetchData("/api/health", normalizeHealth, false, undefined, peek),
          timeout,
        ]);
        healthChecksObj[(matchingDeployment as Deployment).name] =
          newHealthChecks;
        setHealthChecks(healthChecksObj);
      }
    } catch (error: any) {
      if (error.message.includes("took longer than")) {
        setFetchError((prev: any) => ({
          ...prev,
          loadHealthChecks: `Timeout: Fetching health took longer than ${fetchingTimeout} ms`,
        }));
      } else {
        setFetchError((prev: any) => ({
          ...prev,
          loadHealthChecks: "Error loading health: " + error.message,
        }));
      }
    }
  };

  const loadHealthChecksEntities = async () => {
    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error(
                `Fetching health took longer than ${fetchingTimeout} ms`
              )
            ),
          fetchingTimeout
        )
      );

      const newHealthChecks = await Promise.race([
        fetchData("/api/health", normalizeHealth, false, undefined, peek),
        timeout,
      ]);
      setHealthChecksEntities(newHealthChecks);
    } catch (error: any) {
      if (error.message.includes("took longer than")) {
        setFetchError((prev: any) => ({
          ...prev,
          loadHealthChecksEntities: `Timeout: Fetching health took longer than ${fetchingTimeout} ms`,
        }));
      } else {
        setFetchError((prev: any) => ({
          ...prev,
          loadHealthChecksEntities:
            "Error loading health checks: " + error.message,
        }));
      }
    }
  };

  const loadInfo = async () => {
    try {
      if (matchingDeployment && Object.keys(matchingDeployment).length > 0) {
        const timeout = new Promise((_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error(
                  `Fetching info took longer than ${fetchingTimeout} ms`
                )
              ),
            fetchingTimeout
          )
        );

        const newInfo = await Promise.race([
          fetchData("api/info", normalizeInfo, false, undefined, peek),
          timeout,
        ]);
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
    } catch (error: any) {
      if (
        error.message === `Fetching info took longer than ${fetchingTimeout} ms`
      ) {
        setFetchError((prev: any) => ({
          ...prev,
          loadInfo: `Timeout: Fetching info took longer than ${fetchingTimeout} ms`,
        }));
      } else {
        setFetchError((prev: any) => ({
          ...prev,
          loadInfo: "Error loading info: " + error.message,
        }));
      }
    }
  };

  const loadMetrics = async () => {
    try {
      if (matchingDeployment && Object.keys(matchingDeployment).length > 0) {
        const timeout = new Promise((_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error(
                  `Fetching metrics took longer than ${fetchingTimeout} ms`
                )
              ),
            fetchingTimeout
          )
        );

        const newMetrics = await Promise.race([
          fetchData("api/metrics", normalizeMetrics, false, undefined, peek),
          timeout,
        ]);

        setMetrics([
          {
            name: (matchingDeployment as Deployment).name,
            metrics: newMetrics as MetricsInfo[],
          },
        ]);
      }
    } catch (error: any) {
      if (
        error.message ===
        `Fetching metrics took longer than ${fetchingTimeout} ms`
      ) {
        setFetchError((prev: any) => ({
          ...prev,
          loadMetrics: `Timeout: Fetching metrics took longer than ${fetchingTimeout} ms`,
        }));
      } else {
        setFetchError((prev: any) => ({
          ...prev,
          loadMetrics: "Error loading metrics: " + error.message,
        }));
      }
    }
  };

  const loadEntities = async () => {
    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error(
                `Fetching entities took longer than ${fetchingTimeout} ms`
              )
            ),
          fetchingTimeout
        )
      );

      const newEntities = await Promise.race([
        fetchData("api/entities", normalizeEntities, true, undefined, peek),
        timeout,
      ]);
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
    } catch (error: any) {
      if (
        error.message ===
        `Fetching entities took longer than ${fetchingTimeout} ms`
      ) {
        setFetchError((prev: any) => ({
          ...prev,
          loadEntities: `Timeout: Fetching entities took longer than ${fetchingTimeout} ms`,
        }));
      } else {
        setFetchError((prev: any) => ({
          ...prev,
          loadEntities: "Error loading entities: " + error.message,
        }));
      }
    }
  };

  const loadJobs = async () => {
    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error(`Fetching jobs took longer than ${fetchingTimeout} ms`)
            ),
          fetchingTimeout
        )
      );

      const newJobs = await Promise.race([
        fetchData("/api/jobs", normalizeJobs, true, undefined, peek),
        timeout,
      ]);
      setJobs(newJobs);
    } catch (error: any) {
      if (
        error.message === `Fetching jobs took longer than ${fetchingTimeout} ms`
      ) {
        setFetchError((prev: any) => ({
          ...prev,
          loadJobs: `Timeout: Fetching jobs took longer than ${fetchingTimeout} ms`,
        }));
      } else {
        setFetchError((prev: any) => ({
          ...prev,
          loadJobs: "Error loading jobs: " + error.message,
        }));
      }
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
      const timeout = new Promise((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error(
                `Fetching values took longer than ${fetchingTimeout} ms`
              )
            ),
          fetchingTimeout
        )
      );

      const newValues = await Promise.race([
        fetchData("/api/values", normalizeValues, true, undefined, peek),
        timeout,
      ]);
      setValues(newValues);
    } catch (error: any) {
      if (
        error.message ===
        `Fetching values took longer than ${fetchingTimeout} ms`
      ) {
        setFetchError((prev: any) => ({
          ...prev,
          loadValues: `Timeout: Fetching values took longer than ${fetchingTimeout} ms`,
        }));
      } else {
        setFetchError((prev: any) => ({
          ...prev,
          loadValues: "Error loading values: " + error.message,
        }));
      }
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
    errorStatus,
    fetchError,
  };
}
