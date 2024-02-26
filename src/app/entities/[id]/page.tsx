"use client";
import { Button } from "@/components/shadcn-ui/button";
import { GetEntities } from "@/lib/utils";
import { ReloadIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { notFound } from "next/navigation";
import { getHealthChecks } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Entity } from "@/data/entities";
import { Check } from "@/data/health";
import { DevEntities } from "@/data/constants";
import { columns } from "@/components/dashboard/DataTableComponents/DataTableColumns";
import { DataTable } from "@/components/dashboard/DataTableComponents/DataTable";
import { useRouter } from "next/router";

export default function CustomerPage({ params }: { params: { id: string } }) {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [entity, setEntity] = useState<Entity | null>(null); // entities[params.id]);
  const [healthChecks, setHealthChecks] = useState<Check[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState([] as any[]);

  useEffect(() => {
    if (healthChecks && entity) {
      const myCheck = healthChecks
        .filter(
          (check) =>
            check.name.startsWith("db") && check.name.includes(entity.id)
        )
        .map((check) => ({
          label: check.name,
          status: check.healthy ? "HEALTHY" : "UNHEALTHY",
          checked: check.timestamp,
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

  const loadEntities = async () => {
    try {
      const newEntities = await GetEntities();
      if (!newEntities) {
        return notFound();
      }
      setEntities(newEntities);

      const myEntity = newEntities.find((e) => e.uid === params.id);
      setEntity(myEntity);

      if (DevEntities) {
        console.log("params", params);
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
      setIsLoading(false);
      if (DevEntities) {
        console.log("entities[id]", entities);
        console.log("entity[id]", entity);
      }
    };

    loadData();
  }, []);

  //const entity = entities ? entities.find((e) => (e.uid = params.id)) : null; Diese Funktion hat UIDs in entities verändert.

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            {entity ? entity.id : "Not Found..."}
          </h2>
          <div className="flex items-center space-x-2">
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
        <div className="flex items-center justify-between space-y-0">
          <a
            onClick={() => window.history.back()}
            className="font-bold flex items-center cursor-pointer text-blue-500 hover:text-blue-400"
          >
            <ChevronLeftIcon className="mr-[-1px] h-6 w-6" />
            Back
          </a>
        </div>
        <div>
          <DataTable columns={columns} data={tableData} />
        </div>
      </div>
    </>
  );
}
