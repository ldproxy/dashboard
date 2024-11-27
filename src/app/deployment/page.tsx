"use client";
import { columns } from "@/components/dashboard/DataTableComponents/DataTableColumns";
import Summary from "@/components/dashboard/summary";
import Info from "@/components/dashboard/info";
import JobInfo from "@/components/dashboard/job-info";
import { Button } from "@/components/shadcn-ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import dayjs from "dayjs";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/shadcn-ui/tabs";
import { Badge } from "@/components/shadcn-ui/badge";
import {
  GetEntities,
  getHealthChecks,
  getInfo,
  getMetrics,
  getValues,
  getDeploymentCfg,
  getDeployments,
  getJobs,
  sortCards,
  summarizeStoreCheck,
} from "@/lib/utils";
import { useState, useEffect } from "react";
import { Check } from "@/data/health";
import { getIcon } from "@/lib/icons";
import { Entity } from "@/data/entities";
import { InputInfo } from "@/data/info";
import { Metrics } from "@/data/metrics";
import { Jobs, Job } from "@/data/jobs";
import { DataTable } from "@/components/dashboard/DataTableComponents/DataTable";
import { DevDeployment, autoRefreshInterval } from "@/data/constants";
import Prism from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/themes/prism.css";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { getEntityCounts, getStateSummary } from "@/lib/entities";
import { Deployment } from "@/data/deployments";
import { match } from "assert";

type InfoType = { name: string; info: InputInfo }[];
type MetricsType = { name: string; metrics: Metrics };
type HealthChecksType = { [key: string]: Check[] };

export default function DeploymentPage() {
  const [tab, setTab] = useState("overview");
  const [entities, setEntities] = useState<Entity[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [healthChecks, setHealthChecks] = useState<HealthChecksType>({});
  const [metrics, setMetrics] = useState<MetricsType[]>([
    { name: "", metrics: { uptime: -1, memory: -1 } },
  ]);
  const [info, setInfo] = useState<InfoType>([]);
  const [values, setValues] = useState([] as any[]);
  const [tableData, setTableData] = useState([] as any[]);
  const [storeState, setStoreState] = useState(true);
  const [cfg, setCfg] = useState<{}>({});
  const [hasError, setHasError] = useState(false);
  const router = useRouter();
  let pathname = usePathname();
  const [deployments, setDeployments] = useState([
    { name: "", url: "", apiUrl: "", id: "" },
  ] as Deployment[]);
  const [deploymentName, setDeploymentName] = useState("");
  const [deploymentId, setDeploymentId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [healthStatuses, setHealthStatuses] = useState<
    { name: string; healthStatus: string }[] | null
  >(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [matchingDeployment, setMatchingDelpoyment] = useState({});

  const multipleDeployments = process.env.NEXT_PUBLIC_MULTIPLE_DEPLOYMENTS;

  useEffect(() => {
    getDeployments().then((data: any) => {
      setDeployments(data);
      getMatchingDeployment(data);
    });
  }, [multipleDeployments]);

  const getMatchingDeployment = async (data) => {
    const currentUrl = new URL(window.location.href);
    const queryParams = new URLSearchParams(currentUrl.search);
    const did = queryParams.get("did");
    const baseUrl = currentUrl.origin;
    const apiUrl = `${baseUrl}/api`;
    let deployment = {};
    if (did) {
      setDeploymentId(did);
      deployment = data.find((d) => d.id === did);
    } else {
      deployment = data.find((deployment: Deployment) =>
        deployment.apiUrl.includes(apiUrl)
      );
    }
    if (deployment && Object.keys(deployment).length > 0) {
      setMatchingDelpoyment(deployment);
      setDeploymentName(deployment.name);
    }
  };

  const loadInfo = async () => {
    try {
      if (matchingDeployment && Object.keys(matchingDeployment).length > 0) {
        const newInfo = await getInfo();
        if (newInfo.length > 0) {
          setInfo([
            { name: matchingDeployment.name, info: newInfo as InputInfo },
          ]);
        } else {
          setInfo([{ name: matchingDeployment.name, info: [] as InputInfo }]);
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
        setMetrics([{ name: matchingDeployment.name, metrics: newMetrics }]);
      }
    } catch (error) {
      console.error("Error loading metrics:", error);
    }
  };

  const loadHealthChecks = async () => {
    try {
      if (matchingDeployment && Object.keys(matchingDeployment).length > 0) {
        let healthChecksObj: HealthChecksType = {};
        const newHealthChecks = await getHealthChecks();
        healthChecksObj[matchingDeployment.name] = newHealthChecks;
        setHealthChecks(healthChecksObj);
        const healthStatuses = await getHealthStatuses(healthChecksObj);
        setHealthStatuses(healthStatuses);
      }
    } catch (error) {
      console.error("Error loading health checks:", error);
    }
  };

  const getHealthStatuses = async (healthChecks: HealthChecksType) => {
    if (matchingDeployment && Object.keys(matchingDeployment).length > 0) {
      const checks = healthChecks[matchingDeployment.name];

      let healthStatus = "";

      if (checks && checks.length > 0) {
        if (checks.some((check) => check.state === "UNAVAILABLE")) {
          healthStatus = "UNHEALTHY";
        } else if (checks.every((check) => check.state === "AVAILABLE")) {
          healthStatus = "HEALTHY";
        } else if (checks.some((check) => check.state === "OFFLINE")) {
          healthStatus = "OFFLINE";
        }
      } else {
        healthStatus = "OFFLINE";
      }

      return [{ name: matchingDeployment.name, healthStatus }];
    } else return null;
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          loadHealthChecks(),
          loadInfo(),
          loadMetrics(),
          loadEntities(),
          loadJobs(),
          loadValues(),
          //loadCfg(),
        ]);
      } catch (error) {
        console.error(
          "Ein Fehler ist beim Laden der Daten aufgetreten:",
          error
        );
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    };
    if (isInitialLoad && deployments.length > 0) {
      loadData();
    }
  }, [deployments]);

  useEffect(() => {
    if (!isInitialLoad) {
      const loadData = async () => {
        await Promise.all([
          loadHealthChecks(),
          loadInfo(),
          loadMetrics(),
          loadEntities(),
          loadJobs(),
          loadValues(),
          // loadCfg(),
        ]);
      };
      const interval = setInterval(loadData, 2000);
      return () => clearInterval(interval);
    }
  }, [deployments, pathname]);

  useEffect(() => {
    const storeCheck = Object.values(healthChecks)
      .flat()
      .filter(
        (check: Check) =>
          check &&
          check.name &&
          check.name.startsWith("app/") &&
          check.name !== "app/store/values2"
      )
      .map(
        (check) =>
          check &&
          check.name && {
            label: check.name.substring(4),
            status: check.state,
            checked: dayjs(check.timestamp).format("HH:mm:ss"),
          }
      );
    const summarizedStoreCheck = summarizeStoreCheck(storeCheck);

    setTableData(summarizedStoreCheck);
    /*if (DevDeployment) {
      console.log("storeCheck data:", storeCheck);
    }
    if (storeCheck && storeCheck.sources && storeCheck.healthy) {
      setStoreState(storeCheck.healthy);
      setTableData(
        storeCheck.sources.map((source) => ({
          label: source.label,
          status: source.status,
          checked: storeCheck.timestamp,
        }))
      );
    }
    if (DevDeployment) {
      console.log("Table data:", tableData);
    }*/
  }, [healthChecks]);

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

  const loadJobs = async () => {
    try {
      const newJobs = await getJobs();
      setJobs(newJobs);
    } catch (error) {
      console.error("Error loading jobs:", error);
    }
  };

  const loadEntities = async () => {
    try {
      const newEntities = await GetEntities();
      const healthChecks = await getHealthChecks();

      newEntities.forEach((entity) => {
        const hc = healthChecks.find(
          (check) => check.name === `entities/${entity.type}/${entity.id}`
        );
        entity.status = hc && hc.state ? hc.state : "UNKNOWN";
      });

      setEntities(newEntities);
    } catch (error) {
      console.error("Error loading entities:", error);
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

  const totalSources = tableData.length;
  const totalValues = values.length;
  if (DevDeployment) {
    console.log("Values:", totalValues);
    console.log("totalSources:", totalSources);
    console.log("Jobs", jobs);
  }
  // Following variables are only used for the footer of the entities summary
  const totalEntities = entities.length;

  const entityCounts = getEntityCounts(entities);
  const footer = getStateSummary(entityCounts);

  let sortedJobs = [];
  if (jobs.length > 0) {
    sortedJobs = sortCards(jobs);
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Deployment</h2>
        {matchingDeployment &&
          Object.keys(matchingDeployment).length > 0 &&
          metrics &&
          metrics.some(
            (metric) =>
              metric.metrics.uptime === -1 && metric.metrics.memory === -1
          ) && (
            <div className="ml-auto">
              <ClipLoader color={"#123abc"} loading={true} size={20} />
            </div>
          )}
        {/*<div className="flex items-center space-x-2">
          <Button onClick={loadHealthChecks} className="font-bold">
            <ReloadIcon className="mr-2 h-4 w-4" />
            Reload
          </Button>
        </div>*/}
      </div>
      <Tabs
        value={tab}
        onValueChange={onTabChange}
        className="h-full space-y-6"
      >
        <div className="space-between flex items-center">
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
            {/*<TabsTrigger value="cfg">
              <span>Configuration</span>
            </TabsTrigger>*/}
          </TabsList>
        </div>

        <TabsContent value="overview">
          <div
            className="grid gap-4 md:grid-cols-1 lg:grid-cols-1"
            style={{ marginBottom: "10px" }}
          >
            {matchingDeployment &&
              Object.keys(matchingDeployment).length > 0 &&
              info.length > 0 &&
              metrics.length > 0 &&
              healthStatuses &&
              (() => {
                const deploymentInfo =
                  info &&
                  info.find((i) => {
                    return i.name === matchingDeployment.name;
                  });

                const deploymentMetrics =
                  metrics &&
                  metrics.find((m) => {
                    return m.name === matchingDeployment.name;
                  });
                const deploymentHealthStatus =
                  healthStatuses &&
                  healthStatuses.find((h) => h.name === matchingDeployment.name)
                    ?.healthStatus;

                console.log(
                  "deploymentInfoEntity",
                  deploymentInfo,
                  "deploymentMetricsEntity",
                  deploymentMetrics,
                  "deploymentHealthStatusEntity",
                  deploymentHealthStatus
                );

                const infoComponent = (
                  <Info
                    key={matchingDeployment.id}
                    name={
                      (deploymentInfo &&
                      Array.isArray(deploymentInfo.info) &&
                      deploymentInfo.info.length > 0 &&
                      typeof deploymentInfo.info[0].url === "string"
                        ? deploymentInfo.info[0].url
                            .replace("https://", "")
                            .replace("http://", "")
                            .replace(/\/$/, "") +
                          (matchingDeployment.name
                            ? ` (${matchingDeployment.name})`
                            : "")
                        : "") || ""
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
                    health={
                      deploymentHealthStatus &&
                      typeof deploymentHealthStatus === "string"
                        ? deploymentHealthStatus
                        : ""
                    }
                    IconFooter1={getIcon("Clock")}
                    IconFooter2={getIcon("Upload")}
                    IconFooter3={getIcon("Desktop")}
                    className="hover:bg-gray-100 transition-colors duration-200"
                  />
                );

                return deploymentHealthStatus === "OFFLINE" ? (
                  <div key={matchingDeployment.id}>{infoComponent}</div>
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
          {sortedJobs.length > 0
            ? sortedJobs.map((job: Job) => (
                <>
                  <div
                    className="grid gap-4 md:grid-cols-1 lg:grid-cols-1"
                    style={{ marginBottom: "10px" }}
                  >
                    <JobInfo
                      key={job.id}
                      entity={job.entity}
                      label={job.label}
                      tilesets={job.details.tileSets}
                      percent={job.percent}
                      startedAt={job.startedAt}
                      updatedAt={job.updatedAt}
                      info={`${job.current}/${job.total}`}
                      id={job.id}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"></div>
                </>
              ))
            : null}
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
      </Tabs>
    </div>
  );
}
