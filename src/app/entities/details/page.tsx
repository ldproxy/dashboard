"use client";
import { Button } from "@/components/shadcn-ui/button";
import { GetEntities, getCfg, getHealthChecks, getJobs } from "@/lib/utils";
import { ReloadIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { Entity } from "@/data/entities";
import { Check } from "@/data/health";
import { autoRefreshInterval, DevEntities } from "@/data/constants";
import { columns } from "@/components/dashboard/DataTableComponents/DataTableColumns";
import { DataTable } from "@/components/dashboard/DataTableComponents/DataTable";
import { useRouter, useSearchParams } from "next/navigation";
import { ClipLoader } from "react-spinners";
import JobInfo from "@/components/dashboard/job-info";
import { Jobs, Job } from "@/data/jobs";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/shadcn-ui/tabs";
import Prism from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/themes/prism.css";
import { Suspense } from "react";
import dayjs from "dayjs";

const SuspenseWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <CustomerPage />
  </Suspense>
);

export default SuspenseWrapper;

function CustomerPage() {
  const router = useRouter();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [entity, setEntity] = useState<Entity | null>(null); // entities[params.id]);
  const [healthChecks, setHealthChecks] = useState<Check[]>([]);
  const [cfg, setCfg] = useState<{}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState([] as any[]);
  const [tab, setTab] = useState("overview");
  const [hasError, setHasError] = useState(false);
  const [tiles, setTiles] = useState(false);
  const [jobs, setJobs] = useState([]);

  let id: string | null = "";
  let searchParams = useSearchParams();

  if (searchParams !== null) {
    const urllId = searchParams.get("id");
    id = urllId;
  }

  useEffect(() => {
    if (id) {
      const isTiles = id.endsWith("tiles");
      setTiles(isTiles);
    }
  }, [id]);

  useEffect(() => {
    if (healthChecks && entity) {
      const myCheck = healthChecks
        .filter(
          (check) => check.name === `entities/${entity.type}/${entity.id}`
        )
        .flatMap((check) =>
          check.capabilities
            ? check.capabilities.map((cap) => ({
                ...cap,
                timestamp: check.timestamp,
                components: check.components
                  ? check.components
                      .filter((comp) => comp.capabilities.includes(cap.name))
                      .map((comp) => ({
                        ...comp,
                        capability: cap.name,
                        component: true,
                      }))
                  : [],
              }))
            : []
        )
        .map((check) => ({
          label: check.name,
          status: check.state,
          message: check.message,
          checked: dayjs(check.timestamp).format("HH:mm:ss"),
          subRows: check.components.map((comp) => ({
            label: comp.name,
            status: comp.state,
            message: comp.message,
            checked: "", //dayjs(check.timestamp).format("HH:mm:ss"),
          })),
        }));
      setTableData(myCheck);
      if (DevEntities) {
        console.log("myCheck:", myCheck);
      }
    }
  }, [healthChecks, entity]);

  const loadHealthChecks = async () => {
    try {
      const newHealthChecks = await getHealthChecks();
      setHealthChecks(newHealthChecks);
    } catch (error) {
      console.error("Error loading health checks:", error);
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
      if (id !== null) {
        const newCfg = await getCfg(id);
        if (newCfg.message === "Method not allowed") {
          setHasError(true);
        } else {
          setCfg(newCfg);
        }
      }
    } catch (error) {
      console.error("Error loading cfg:", error);
      setHasError(true);
    }
  };

  const loadEntities = async () => {
    try {
      const newEntities = await GetEntities();
      if (!newEntities) {
        return notFound();
      }
      setEntities(newEntities);

      const myEntity = newEntities.find((e) => e.uid === id);
      setEntity(myEntity);

      if (DevEntities) {
        console.log("newEntities", newEntities);
        console.log("myEntity", myEntity);
      }
    } catch (error) {
      console.error("Error loading entities:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await loadEntities();
      await loadHealthChecks();
      await loadJobs();
      await loadCfg();
      setIsLoading(false);
      if (DevEntities) {
        console.log("entities[id]", entities);
        console.log("entity[id]", entity);
        console.log("cfg", cfg);
      }
    };
    const interval = setInterval(() => {
      loadData();
    }, autoRefreshInterval);
    return () => clearInterval(interval);
    // some dependencies ignored to avoid indefinite loop
    // eslint-disable-next-line
  }, [tiles]);

  const onTabChange = (tab: string) => {
    setTab(tab);
  };

  //const entity = entities ? entities.find((e) => (e.uid = params.id)) : null; Diese Funktion hat UIDs in entities verändert.

  if (isLoading) {
    return (
      <div className="flex items-center">
        <ClipLoader color={"#123abc"} loading={true} size={20} />
        <span style={{ marginLeft: "10px" }}>Loading...</span>
      </div>
    );
  }
  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <a
            onClick={() => router.back()}
            className="font-bold flex items-center cursor-pointer text-blue-500 hover:text-blue-400"
          >
            <ChevronLeftIcon className="mr-[-1px] h-6 w-6" />
          </a>
          <h2 className="text-2xl font-semibold tracking-tight ml-2">
            {entity ? entity.id : "Not Found..."}
          </h2>
        </div>
        {/*<div className="p-8 pt-6">
          <Button
            onClick={() => {
              loadEntities();
              loadHealthChecks();
            }}
            className="font-bold"
          >
            <ReloadIcon className="mr-2 h-4 w-4" />
            Reload
          </Button>
          </div>*/}
      </div>
      <div className="p-8 pt-6">
        <Tabs
          value={tab}
          onValueChange={onTabChange}
          className="h-full space-y-6"
        >
          <div className="space-between flex items-center">
            <TabsList>
              <TabsTrigger value="overview">
                <span>Health</span>
              </TabsTrigger>
              {id &&
                tiles &&
                jobs &&
                jobs.some(
                  (job: Job) => job.entity === id.split("_").slice(1).join("_")
                ) && (
                  <TabsTrigger value="jobs">
                    <span>Jobs</span>
                  </TabsTrigger>
                )}
              {/*<TabsTrigger value="cfg">
                <span>Configuration</span>
              </TabsTrigger>*/}
            </TabsList>
          </div>

          <TabsContent value="overview">
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Health checks for the capabilities of this entity.
              </p>
              <DataTable columns={columns} data={tableData} />
            </div>
          </TabsContent>
          <TabsContent value="jobs">
            {id &&
            jobs.filter(
              (job: Job) => job.entity === id.split("_").slice(1).join("_")
            ).length > 0
              ? jobs
                  .filter(
                    (job: Job) =>
                      job.entity === id.split("_").slice(1).join("_")
                  )
                  .map((job: Job) => (
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
    </>
  );
}
