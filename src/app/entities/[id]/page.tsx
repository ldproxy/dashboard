import { Button } from "@/components/shadcn-ui/button";
import { GetEntities, getCfg, getHealthChecks } from "@/lib/utils";
import { ReloadIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { Entity } from "@/data/entities";
import { Check } from "@/data/health";
import { DevEntities } from "@/data/constants";
import { columns } from "@/components/dashboard/DataTableComponents/DataTableColumns";
import { DataTable } from "@/components/dashboard/DataTableComponents/DataTable";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/shadcn-ui/tabs";
import Prism from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/themes/prism.css";

export function generateStaticParams() {
  return [
    { id: "services_bergbau" },
    { id: "providers_bergbau" },
    { id: "services_krankenhaeuser" },
  ];
}

export default function CustomerPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  let entities: Entity[] = [];
  let entity: Entity | null = {
    type: "providers",
    uid: `providers_bergbau`,
    id: "bergbau",
    status: "ACTIVE",
    subType: "features/wfs",
  }; // entities[params.id]);
  let healthChecks: Check[] = [];
  let cfg = {};
  let isLoading = true;
  let tableData: { label: string; status: string; checked: string }[] = [];
  let tab = "overview";
  let hasError = false;

  const table = () => {
    if (healthChecks && entity) {
      const myCheck = healthChecks
        .filter(
          (check) =>
            check.name.startsWith("db") &&
            entity &&
            check.name.includes(entity.id)
        )
        .map((check) => ({
          label: check.name,
          status: check.healthy ? "HEALTHY" : "UNHEALTHY",
          checked: check.timestamp,
        }));
      tableData = myCheck;
      if (DevEntities) {
        console.log("myCheck:", myCheck);
      }
    }
  };
  table();

  const loadHealthChecks = async () => {
    try {
      const newHealthChecks = await getHealthChecks();
      healthChecks = newHealthChecks;
    } catch (error) {
      console.error("Error loading health checks:", error);
    }
  };

  const loadCfg = async () => {
    try {
      const newCfg = await getCfg(id);
      if (newCfg.message === "Method not allowed") {
        hasError = true;
      } else {
        cfg = newCfg;
      }
    } catch (error) {
      console.error("Error loading cfg:", error);
      hasError = true;
    }
  };

  const loadEntities = async () => {
    try {
      const newEntities = await GetEntities();
      if (!newEntities) {
        return notFound();
      }
      entities = newEntities;

      const myEntity = newEntities.find((e) => e.uid === id);
      entity = myEntity;

      if (DevEntities) {
        console.log("params", params);
        console.log("newEntities", newEntities);
        console.log("myEntity", myEntity);
      }
    } catch (error) {
      console.error("Error loading entities:", error);
    }
  };

  const loadData = async () => {
    await loadEntities();
    await loadHealthChecks();
    await loadCfg();
    isLoading = false;
    if (DevEntities) {
      console.log("entities[id]", entities);
      console.log("entity[id]", entity);
      console.log("cfg", cfg);
    }
  };

  loadData();

  const onTabChange = (tab: string) => {
    tab = tab;
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
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <a
            //      onClick={() => router.back()}
            className="font-bold flex items-center cursor-pointer text-blue-500 hover:text-blue-400"
          >
            <ChevronLeftIcon className="mr-[-1px] h-6 w-6" />
          </a>
          <h2 className="text-2xl font-semibold tracking-tight ml-2">
            {entity ? entity.id : "Not Found..."}
          </h2>
        </div>
        <div className="p-8 pt-6">
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
        </div>
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
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="cfg">
                <span>Configuration</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview">
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
    </div>
  );
}
