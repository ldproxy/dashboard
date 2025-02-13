import { useState } from "react";
import { compareDataAcrossUrls } from "@/lib/utils";
import { getDeploymentCfg } from "@/lib/cfg";
import { fetchData } from "./fetchData";
import { IS_MODE_MULTI } from "./env";
import { Entity, normalizeEntities } from "./entities";
import { Check, normalizeHealth } from "./health";
import { Infos, normalizeInfo } from "./info";
import { Job, JobsWithUrl, normalizeJobs } from "./jobs";
import { MetricsInfo, normalizeMetrics } from "./metrics";
import { normalizeValues } from "./values";
import { Deployment } from "./deployments";
import { JobSets } from "./jobs";
import {
  MultiResponse,
  SingleResponse,
  WRAPPED_HEADER,
  WRAPPED_MULTI,
  WRAPPED_SINGLE,
} from "@/app/api/util";

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
  loadHealthChecksHomepage?: boolean;
  loadInfoHomepage?: boolean;
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

export function useDataLoader(
  matchingDeployment?: Deployment,
  deployments?: Deployment[]
) {
  const fetchingTimeout = 1000;
  const [fetchError, setFetchError] = useState<{
    [key: string]: string | null;
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [jobs, setJobs] = useState<JobsWithUrl[]>([]);
  const [healthChecks, setHealthChecks] = useState<HealthChecksType>({});
  const [healthCecksHomepage, setHealthChecksHomepage] =
    useState<HealthChecksType>({});
  const [infoHomepage, setInfoHomepage] = useState<InfoType>([]);
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
      if (config.loadHealthChecks) await loadHealthChecks();
      if (config.loadHealthChecksHomepage) await loadHealthChecksHomepage();
      if (config.loadHealthChecksEntities) await loadHealthChecksEntities();
      if (config.loadInfo) await loadInfo();
      if (config.loadInfoHomepage) await loadInfoHomePage();
      if (config.loadMetrics) await loadMetrics();
      if (config.loadEntities) await loadEntities();
      if (config.loadJobs) await loadJobs();
      if (config.loadValues) await loadValues();
      if (IS_MODE_MULTI && config.checkDifferences) await checkDifferences();
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const unwrap = async (data: any, headers: Headers): Promise<any> => {
    if (!headers.has(WRAPPED_HEADER)) {
      return data;
    }

    const wrapped: SingleResponse<any> | MultiResponse<any> = data;

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

    if (Array.isArray(wrapped)) {
      wrapped.forEach((item) => {
        if (item.errorStatus) {
          processErrorStatus(item.errorStatus);
          hasError = true;
        }
      });
    } else if (wrapped.errorStatus) {
      processErrorStatus(wrapped.errorStatus);
      hasError = true;
    }

    if (hasError) {
      setErrorStatus((prevErrorStatus) => ({
        ...prevErrorStatus,
        ...newErrorStatus,
      }));
    }
    return Array.isArray(wrapped) ? wrapped : wrapped.response;
  };

  const loadHealthChecksHomepage = async () => {
    try {
      if (deployments && deployments.length > 0) {
        let healthChecksObj: HealthChecksType = {};
        const promises = deployments.map(async (deployment: any) => {
          try {
            const newHealthChecks = await fetchData(
              "/api/health",
              normalizeHealth,
              false,
              deployment.apiUrl,
              unwrap,
              fetchingTimeout
            );
            healthChecksObj[deployment.name] = newHealthChecks;
          } catch (error: any) {
            if (error.message.includes("took longer than")) {
              setFetchError((prev: any) => ({
                ...prev,
                loadHealthChecksHomepage: `Timeout: Fetching health took longer than ${fetchingTimeout} ms`,
              }));
            } else {
              setFetchError((prev: any) => ({
                ...prev,
                loadHealthChecksHomepage:
                  "Error loading health: " + error.message,
              }));
            }
            console.error(
              "Error fetching health checks for",
              deployment.name,
              ":",
              error
            );
            healthChecksObj[deployment.name] = [
              { state: "OFFLINE", url: deployment.url },
            ];
          }
        });
        await Promise.all(promises);
        await new Promise<void>((resolve) => {
          setHealthChecksHomepage(healthChecksObj);
          resolve();
        });
      }
    } catch (error: any) {
      console.error("Error loading health checks:", error);
    }
  };

  const loadHealthChecks = async () => {
    try {
      if (matchingDeployment && Object.keys(matchingDeployment).length > 0) {
        let healthChecksObj: HealthChecksType = {};
        const newHealthChecks = await fetchData(
          "/api/health",
          normalizeHealth,
          false,
          undefined,
          unwrap,
          fetchingTimeout
        );
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
      const newHealthChecks = await fetchData(
        "/api/health",
        normalizeHealth,
        false,
        undefined,
        unwrap,
        fetchingTimeout
      );
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

  const loadInfoHomePage = async () => {
    try {
      if (deployments && deployments.length > 0) {
        const promises = deployments.map(async (deployment: any) => {
          const newInfo = await fetchData(
            "/api/info",
            normalizeInfo,
            false,
            deployment.apiUrl,
            unwrap,
            fetchingTimeout
          );

          if (newInfo && newInfo.length > 0) {
            return { name: deployment.name, info: newInfo as Infos };
          } else {
            return { name: deployment.name, info: [] as Infos };
          }
        });
        const results = await Promise.all(promises);
        setInfoHomepage(results);
      }
    } catch (error: any) {
      if (
        error.message === `Fetching info took longer than ${fetchingTimeout} ms`
      ) {
        setFetchError((prev: any) => ({
          ...prev,
          loadInfoHomepage: `Timeout: Fetching info took longer than ${fetchingTimeout} ms`,
        }));
      } else {
        setFetchError((prev: any) => ({
          ...prev,
          loadInfoHomepage: "Error loading info: " + error.message,
        }));
      }
    }
  };

  const loadInfo = async () => {
    try {
      if (matchingDeployment && Object.keys(matchingDeployment).length > 0) {
        const newInfo = await fetchData(
          "/api/info",
          normalizeInfo,
          false,
          undefined,
          unwrap,
          fetchingTimeout
        );
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
        const newMetrics = await fetchData(
          "/api/metrics",
          normalizeMetrics,
          false,
          undefined,
          unwrap,
          fetchingTimeout
        );

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
      const newEntities = await fetchData(
        "/api/entities",
        normalizeEntities,
        true,
        undefined,
        unwrap,
        fetchingTimeout
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
      const newJobs = await fetchData(
        "/api/jobs",
        normalizeJobs,
        false,
        undefined,
        unwrap,
        fetchingTimeout
      );
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
      const newValues = await fetchData(
        "/api/values",
        normalizeValues,
        true,
        undefined,
        unwrap,
        fetchingTimeout
      );
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
    healthCecksHomepage,
    healthChecksEntities,
    metrics,
    info,
    infoHomepage,
    values,
    cfg,
    hasError,
    nodesDifferent,
    loadData,
    errorStatus,
    fetchError,
  };
}
