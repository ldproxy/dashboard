"use client";
import { columns } from "@/components/dashboard/DataTableComponents/DataTableColumns";
import Summary from "@/components/dashboard/Summary";
import InfoBox from "@/components/dashboard/InfoBox";
import JobInfo from "@/components/dashboard/Jobinfo";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/shadcn-ui/tabs";
import { sortCards } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { getIcon } from "@/lib/icons";
import { DataTable } from "@/components/dashboard/DataTableComponents/DataTable";
import { DevDeployment } from "@/dev-data/constants";
import Prism from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/themes/prism.css";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { getEntityCounts, getStateSummary } from "@/lib/entities";
import {
  getDeployments,
  getMatchingDeployment,
  getDeploymentId,
  Deployment,
} from "@/lib/deployments";
import { useDataLoader } from "@/lib/loadDataHook";
import { Check, summarizeStoreCheck, UiCheck } from "@/lib/health";
import { useReloadInterval } from "../layout";
import { IS_MODE_MULTI, IS_MODE_SINGLE } from "@/lib/env";
import { Job } from "@/lib/jobs";
import LogViewer from "@/components/dashboard/LogViewer";
import LogLevelSelect from "@/components/dashboard/LogLevelSelect";
import ToggleFiltersLog from "@/components/dashboard/ToggleFiltersLog";

export type HealthChecksType = { [key: string]: Check[] };
export type NodesDifferent = {
  entities: boolean;
  values: boolean;
};

export default function DeploymentPage() {
  const autoRefreshInterval = useReloadInterval();
  const [isDropdownOpenLog, setIsDropdownOpenLog] = useState(false);
  const [logLevel, setLogLevel] = useState("INFO");
  const [tab, setTab] = useState("overview");
  const [tableData, setTableData] = useState([] as any[]);
  const router = useRouter();
  let pathname = usePathname();
  const [deployments, setDeployments] = useState([
    { name: "", url: "", apiUrl: [""], id: "" },
  ] as Deployment[]);
  const [deploymentId, setDeploymentId] = useState("");
  const [healthStatuses, setHealthStatuses] = useState<
    { name: string; healthStatus: string }[] | null
  >(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [matchingDeployment, setMatchingDelpoyment] = useState<Deployment>({
    id: "",
    name: "",
    apiUrl: [""],
  });
  const {
    entities,
    jobs,
    healthChecks,
    metrics,
    info,
    values,
    cfg,
    hasError,
    nodesDifferent,
    loadData,
    errorStatus,
    fetchError,
  } = useDataLoader(matchingDeployment);

  const [flagsLog, setFlagsLog] = useState({
    showThirdPartyLoggers: false,
    apiRequests: false,
    apiRequestUsers: false,
    apiRequestHeaders: false,
    apiRequestBodies: false,
    s3: false,
    sqlQueries: false,
    sqlResults: false,
    configDumps: false,
    stackTraces: false,
    wiring: false,
    jobs: false,
  });

  const handleChangeLogLevel = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLogLevel = event.target.value;
    setLogLevel(newLogLevel);

    // ToDo: leave setting of filters here and move fetching of filters to LogViewer (just like with logLevel)
    /*
    const filters = Object.keys(flagsLog)
      .filter((key) => flagsLog[key as keyof typeof flagsLog])
      .map((key) => `${key}=${flagsLog[key as keyof typeof flagsLog]}`)
      .join("&");

    const response = await fetch(
      `/api/log?logLevel=${newLogLevel}&${filters}`,
      {
        method: "POST",
      }
    );
*/
  };

  const handleFlagChangeLog = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = event.target;
    setFlagsLog((prevFlagsLog) => {
      const updatedFlagsLog = {
        ...prevFlagsLog,
        [name]: checked,
      };

      const filters = Object.keys(updatedFlagsLog)
        .filter((key) => updatedFlagsLog[key as keyof typeof updatedFlagsLog])
        .map(
          (key) =>
            `${key}=${updatedFlagsLog[key as keyof typeof updatedFlagsLog]}`
        )
        .join("&");

      fetch(`/api/log?logLevel=${logLevel}&${filters}`, {
        method: "POST",
      })
        .then((response) => {
          if (response.ok) {
            console.log("Filters set successfully", response);
          } else {
            alert("Failed to set filters");
          }
        })
        .catch((error) => {
          console.error("Error setting filters:", error);
          alert("Failed to set filters");
        });

      return updatedFlagsLog;
    });
  };

  useEffect(() => {
    if (isInitialLoad && deployments.length > 0) {
      loadData().then(() => setIsInitialLoad(false));
    }
    // not all dependendies to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deployments]);

  useEffect(() => {
    if (!isInitialLoad && autoRefreshInterval > 0) {
      const interval = setInterval(loadData, autoRefreshInterval * 1000);
      return () => clearInterval(interval);
    }
    // not all dependendies to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialLoad, autoRefreshInterval]);

  useEffect(() => {
    if (IS_MODE_MULTI) {
      getDeployments().then((data: any) => {
        setDeployments(data);
        getMatchingDeployment(data, setDeploymentId, setMatchingDelpoyment);
      });
      getDeploymentId(setDeploymentId);
    }
  }, []);

  useEffect(() => {
    const updateHealthStatus = async () => {
      const healthStatuses = await getHealthStatuses(healthChecks);
      setHealthStatuses(healthStatuses);
    };
    updateHealthStatus();
    // not all dependendies to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [healthChecks]);

  useEffect(() => {
    const storeCheck: UiCheck[] = Object.values(healthChecks)
      .flat()
      .filter(
        (check: Check) => check && check.name && check.name.startsWith("app/")
      )
      .map((check) => {
        return {
          ...check,
          url: check.url?.match(/\/\/([^\/]+)/)?.[1] || "",
          description: check.description?.replaceAll("\n", "<br/>"),
          checked: dayjs(check.timestamp).format("HH:mm:ss"),
        };
      })
      .filter((c) => c !== null) as UiCheck[];

    const summarizedStoreCheck = summarizeStoreCheck(storeCheck);

    setTableData(summarizedStoreCheck);
  }, [healthChecks]);

  useEffect(() => {
    if (pathname) {
      setTab(window.location.hash.slice(1) || "overview");
    }
  }, [pathname]);

  const onTabChange = (tab: string) => {
    setTab(tab);
    if (deploymentId !== "") {
      router.push(`${pathname}?did=${deploymentId}#${tab}`);
    } else {
      router.push(`${pathname}#${tab}`);
    }
  };

  const getWarningMessage = () => {
    const keys = (
      Object.keys(nodesDifferent) as Array<keyof NodesDifferent>
    ).filter((key) => nodesDifferent[key]);
    if (keys.length > 0) {
      return `Warning: Differences detected in ${keys.join(
        " and "
      )} across different replicas. This issue is likely temporary.`;
    }
    return null;
  };

  const getHealthStatuses = async (healthChecks: HealthChecksType) => {
    if (matchingDeployment && Object.keys(matchingDeployment).length > 0) {
      const checks = healthChecks[(matchingDeployment as Deployment).name];

      let healthStatus = "";

      if (checks && checks.length > 0) {
        if (
          (checks.some(
            (check) =>
              check.state === "OFFLINE" || check.state === "UNAVAILABLE"
          ) &&
            checks.some((check) => check.state === "AVAILABLE")) ||
          Object.keys(errorStatus).length > 0
        ) {
          healthStatus = "LIMITED";
        } else if (checks.every((check) => check.state === "AVAILABLE")) {
          healthStatus = "HEALTHY";
        } else if (checks.every((check) => check.state === "OFFLINE")) {
          healthStatus = "OFFLINE";
        }
      } else {
        healthStatus = "OFFLINE";
      }

      return [{ name: (matchingDeployment as Deployment).name, healthStatus }];
    } else return null;
  };
  const totalSources = tableData.length;
  const totalValues = values.length;
  const totalEntities = entities.length;
  const entityCounts = getEntityCounts(entities);
  const footer = getStateSummary(entityCounts);
  let sortedJobs: { url: string; sets: Job[] }[] = [];
  if (jobs && jobs.length > 0) {
    sortedJobs = sortCards(jobs);
  }

  if (DevDeployment) {
    console.log("Values:", totalValues);
    console.log("totalSources:", totalSources);
    console.log("Jobs", jobs);
    console.log("autoRefreshInterval", autoRefreshInterval);
    console.log("errorStatusDeployment", errorStatus);
  }

  // Beispiel für das Hinzufügen neuer Logs
  /*
  useEffect(() => {
    const interval = setInterval(() => {
      setLogs((prevLogs) => [...prevLogs, "New log entry..."]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
*/

  return (
    <div className="flex-1 p-8 pt-0">
      {isDropdownOpenLog && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 10,
          }}
          onClick={() => setIsDropdownOpenLog(false)}
        />
      )}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Deployment</h2>
        {matchingDeployment &&
          Object.keys(matchingDeployment).length > 0 &&
          metrics &&
          metrics.some(
            (metric) =>
              Array.isArray(metric.metrics) &&
              metric.metrics.some((m) => m.uptime === -1 && m.memory === -1)
          ) && (
            <div className="ml-auto">
              <ClipLoader color={"#123abc"} loading={true} size={20} />
            </div>
          )}
      </div>
      <Tabs
        value={tab}
        onValueChange={onTabChange}
        className="h-full space-y-6"
        style={{ marginTop: "16px" }}
      >
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="store">
              <span>Base Health</span>
            </TabsTrigger>
            <TabsTrigger value="jobs">
              <span>Jobs</span>
            </TabsTrigger>
            <TabsTrigger value="log">
              <span>Log</span>
            </TabsTrigger>
          </TabsList>
          {tab === "log" && (
            <>
              <ToggleFiltersLog
                isDropdownOpenLog={isDropdownOpenLog}
                setIsDropdownOpenLog={setIsDropdownOpenLog}
                flagsLog={flagsLog}
                handleFlagChangeLog={handleFlagChangeLog}
              />
              <LogLevelSelect
                logLevel={logLevel}
                handleChangeLogLevel={handleChangeLogLevel}
              />
            </>
          )}
        </div>
        {getWarningMessage() && (
          <div className="flex items-center space-x-2 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            <ExclamationTriangleIcon className="h-5 w-5" />
            <span>{getWarningMessage()}</span>
          </div>
        )}
        {Object.keys(errorStatus).length > 0 && (
          <div className="flex items-center space-x-2 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            <span>
              {Object.entries(errorStatus).map(([key, value]) => (
                <div className="flex items-center" key={key}>
                  <ExclamationTriangleIcon className="h-5 w-5 mr-5" />
                  Error {value} fetching data from endpoint {key}!
                </div>
              ))}
            </span>
          </div>
        )}
        {Object.values(fetchError).map(
          (error, index) =>
            error && (
              <div
                key={index}
                className="flex items-center space-x-2 p-4 bg-red-100 border border-red-400 text-red-700 rounded"
              >
                <ExclamationTriangleIcon className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )
        )}

        <TabsContent value="overview">
          <div
            className="grid gap-4 md:grid-cols-1 lg:grid-cols-1"
            style={{ marginBottom: "10px" }}
          >
            {matchingDeployment &&
              Object.keys(matchingDeployment).length > 0 &&
              metrics.length > 0 &&
              info.length > 0 &&
              entities.length > 0 &&
              healthStatuses &&
              healthStatuses.length > 0 &&
              (() => {
                const deploymentInfo =
                  info &&
                  info.find((i) => {
                    return i.name === (matchingDeployment as Deployment).name;
                  });

                const deploymentMetrics =
                  metrics &&
                  metrics.find((m) => {
                    return m.name === (matchingDeployment as Deployment).name;
                  });
                const deploymentHealthStatus =
                  healthStatuses &&
                  healthStatuses.find(
                    (h) => h.name === (matchingDeployment as Deployment).name
                  )?.healthStatus;

                if (DevDeployment) {
                  console.log(
                    "deploymentInfoEntity",
                    deploymentInfo,
                    "deploymentMetricsEntity",
                    deploymentMetrics,
                    "deploymentHealthStatusEntity",
                    deploymentHealthStatus
                  );
                }

                const infoComponent = (
                  <InfoBox
                    key={(matchingDeployment as Deployment).id}
                    name={
                      matchingDeployment &&
                      (matchingDeployment as Deployment).name
                        ? ` ${(matchingDeployment as Deployment).name}`
                        : ""
                    }
                    versions={
                      deploymentInfo && Array.isArray(deploymentInfo.info)
                        ? deploymentInfo.info
                            .filter((item) => typeof item.version === "string")
                            .map((item) => ({
                              version: item.version,
                              apiUrl: item.apiUrl,
                            }))
                        : []
                    }
                    uptimes={
                      deploymentMetrics &&
                      Array.isArray(deploymentMetrics.metrics)
                        ? deploymentMetrics.metrics
                            .filter(
                              (metric) => typeof metric.uptime === "number"
                            )
                            .map((metric) => ({
                              uptime: metric.uptime,
                              apiUrl: metric.apiUrl,
                            }))
                        : []
                    }
                    memories={
                      deploymentMetrics &&
                      Array.isArray(deploymentMetrics.metrics)
                        ? deploymentMetrics.metrics
                            .filter(
                              (metric) => typeof metric.memory === "number"
                            )
                            .map((metric) => ({
                              memory: metric.memory,
                              apiUrl: metric.apiUrl,
                            }))
                        : []
                    }
                    healthStatus={
                      deploymentHealthStatus &&
                      typeof deploymentHealthStatus === "string"
                        ? deploymentHealthStatus
                        : ""
                    }
                    url={
                      deploymentInfo &&
                      Array.isArray(deploymentInfo.info) &&
                      deploymentInfo.info.length > 0 &&
                      typeof deploymentInfo.info[0].url === "string"
                        ? deploymentInfo.info[0].url
                        : ""
                    }
                    IconFooter1={getIcon("Clock")}
                    IconFooter2={getIcon("Upload")}
                    IconFooter3={getIcon("Desktop")}
                    className="hover:bg-gray-100 transition-colors duration-200"
                  />
                );

                return deploymentHealthStatus === "OFFLINE" ? (
                  <div key={(matchingDeployment as Deployment).id}>
                    {infoComponent}
                  </div>
                ) : (
                  infoComponent
                );
              })()}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Summary
              key="Entities"
              main="Entities"
              route={`/entities${
                deploymentId !== "" ? `?did=${deploymentId}` : ""
              }`}
              footer={footer}
              total={totalEntities}
              Icon={getIcon("Id")}
            />
            {/*<Summary
              key="Sources"
              main="Sources"
              footer={storeState ? "true" : "false"}
              Icon={getIcon("ListBullet")}
              total={totalSources}
              onClick={() => setTab("store")}
            />*/}
            <Summary
              key="Values"
              main="Values"
              route={`/values${
                deploymentId !== "" ? `?did=${deploymentId}` : ""
              }`}
              footer="&nbsp;"
              total={totalValues}
              Icon={getIcon("Code")}
            />
          </div>
        </TabsContent>
        <TabsContent value="store">
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Health checks for global components that are used by all entities.
            </p>
            <DataTable columns={columns} data={tableData} />
          </div>
        </TabsContent>
        <TabsContent value="jobs">
          {sortedJobs.length > 0 ? (
            sortedJobs.map(
              (job: { url: string; sets: Job[] }) =>
                job.sets &&
                job.sets.length > 0 &&
                job.sets.map((jobSet: Job) => (
                  <React.Fragment key={jobSet.id}>
                    <div
                      className="grid gap-4 md:grid-cols-1 lg:grid-cols-1"
                      style={{ marginBottom: "10px" }}
                    >
                      <JobInfo
                        key={jobSet.id}
                        entity={jobSet.entity}
                        label={jobSet.label}
                        tilesets={jobSet.details.tileSets}
                        percent={jobSet.percent}
                        startedAt={jobSet.startedAt}
                        updatedAt={jobSet.updatedAt}
                        info={`${jobSet.current}/${jobSet.total}`}
                        id={jobSet.id}
                        url={job.url?.match(/\/\/([^\/]+)/)?.[1] || ""}
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"></div>
                  </React.Fragment>
                ))
            )
          ) : (
            <span>Currently No Jobs</span>
          )}
        </TabsContent>
        <TabsContent value="cfg">
          <div
            style={{
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              padding: "16px",
              border: "1px solid lightgray",
            }}
          >
            {hasError ? (
              "No results."
            ) : Object.keys(cfg).length === 0 ? (
              <div className="flex items-center">
                <ClipLoader color={"#123abc"} loading={true} size={20} />
                <span style={{ marginLeft: "5px" }}>Loading...</span>
              </div>
            ) : (
              Object.entries(cfg).map(([key, value]) => {
                const strValue = JSON.stringify(value, null, 2);

                const highlightedValue = Prism.highlight(
                  strValue,
                  Prism.languages.json,
                  "json"
                );

                return (
                  <div key={key} style={{ display: "flex" }}>
                    <span>{key}:</span>
                    <pre
                      dangerouslySetInnerHTML={{ __html: highlightedValue }}
                      style={{ margin: "0 0 0 10px" }}
                    />
                  </div>
                );
              })
            )}
          </div>
        </TabsContent>
        <TabsContent value="log">
          <div style={{ height: "calc(100vh - 275px)" }}>
            <LogViewer logLevel={logLevel} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
