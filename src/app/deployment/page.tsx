"use client";
import { columns } from "@/components/dashboard/DataTableComponents/DataTableColumns";
import Summary from "@/components/dashboard/summary";
import Info from "@/components/dashboard/info";
import { Button } from "@/components/shadcn-ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import Link from "next/link";
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
} from "@/lib/utils";
import { useState, useEffect } from "react";
import { Check } from "@/data/health";
import { getIcon } from "@/lib/icons";
import { Entity } from "@/data/entities";
import { InputInfo } from "@/data/info";
import { Metrics } from "@/data/metrics";
import { DataTable } from "@/components/dashboard/DataTableComponents/DataTable";
import { DevDeployment } from "@/data/constants";
import Prism from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/themes/prism.css";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { ClipLoader } from "react-spinners";

export default function DeploymentPage() {
  const [healthChecks, setHealthChecks] = useState<Check[]>([]);
  const [tab, setTab] = useState("overview");
  const [entities, setEntities] = useState<Entity[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({ uptime: 0, memory: 0 });
  const [info, setInfo] = useState<InputInfo>({
    name: "",
    version: "",
    status: "",
  });
  const [values, setValues] = useState([] as any[]);
  const [tableData, setTableData] = useState([] as any[]);
  const [storeState, setStoreState] = useState(true);
  const [cfg, setCfg] = useState<{}>({});
  const [hasError, setHasError] = useState(false);
  const router = useRouter();
  let pathname = usePathname();

  useEffect(() => {
    const storeCheck = healthChecks.find((check) => check.name === "store");
    if (DevDeployment) {
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
    }
  }, [healthChecks]);

  const loadInfo = async () => {
    try {
      const newInfo = await getInfo();
      setInfo(newInfo);
    } catch (error) {
      console.error("Error loading info:", error);
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

  const loadMetrics = async () => {
    try {
      const newMetrics = await getMetrics();
      setMetrics(newMetrics);
    } catch (error) {
      console.error("Error loading metrics:", error);
    }
  };

  const loadEntities = async () => {
    try {
      const newEntities = await GetEntities();
      setEntities(newEntities);
    } catch (error) {
      console.error("Error loading entities:", error);
    }
  };

  const loadHealthChecks = async () => {
    try {
      const newHealthChecks = await getHealthChecks();
      setHealthChecks(newHealthChecks);
    } catch (error) {
      console.error("Error loading health checks:", error);
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
    loadHealthChecks();
    loadEntities();
    loadInfo();
    loadMetrics();
    loadValues();
    loadCfg();
  }, []);

  const onTabChange = (tab: string) => {
    setTab(tab);
    router.push(`${pathname}#${tab}`);
  };

  const totalSources = tableData.length;
  const totalValues = values.length;
  console.log("Values:", totalValues);
  console.log("totalSources:", totalSources);
  // Following variables are only used for the footer of the entities summary
  const totalEntities = entities.length;
  const activeEntities = entities.filter(
    (entity) => entity.status === "ACTIVE" || entity.status === "HEALTHY"
  ).length;

  const entitiesFooterCaseActive = `${activeEntities} active`;
  const entitiesFooterCaseInactive =
    totalEntities !== activeEntities
      ? `${totalEntities - activeEntities} defective`
      : "";

  const actualEntitiesFooter =
    entitiesFooterCaseInactive && entitiesFooterCaseActive
      ? entitiesFooterCaseActive + " " + entitiesFooterCaseInactive
      : entitiesFooterCaseActive
      ? entitiesFooterCaseActive
      : entitiesFooterCaseInactive
      ? entitiesFooterCaseInactive
      : "No entities found";

  return (
    <div className="flex-1 space-y-4 p-8 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Deployment</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={loadHealthChecks} className="font-bold">
            <ReloadIcon className="mr-2 h-4 w-4" />
            Reload
          </Button>
        </div>
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
              <span>Store</span>
            </TabsTrigger>
            <TabsTrigger value="cfg">
              <span>Configuration</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview">
          <div
            className="grid gap-4 md:grid-cols-1 lg:grid-cols-1"
            style={{ marginBottom: "10px" }}
          >
            <Info
              key="Entities"
              name={info.name}
              version={info.version}
              uptime={metrics.uptime}
              memory={metrics.memory}
              health={info.status}
              IconFooter1={getIcon("Clock")}
              IconFooter2={getIcon("Upload")}
              IconFooter3={getIcon("Desktop")}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Summary
              key="Entities"
              main="Entities"
              route="/entities"
              footer={actualEntitiesFooter}
              total={totalEntities}
              Icon={getIcon("Id")}
            />
            <Summary
              key="Sources"
              main="Sources"
              footer={storeState ? "true" : "false"}
              Icon={getIcon("ListBullet")}
              total={totalSources}
              onClick={() => setTab("store")}
            />
            <Summary
              key="Values"
              main="Values"
              route="/values"
              footer="Go to Values..."
              total={totalValues}
              Icon={getIcon("Code")}
            />
          </div>
        </TabsContent>
        <TabsContent value="store">
          <div>
            <DataTable columns={columns} data={tableData} />
          </div>
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
