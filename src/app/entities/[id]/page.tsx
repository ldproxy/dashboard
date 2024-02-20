"use client";
import { Button } from "@/components/shadcn-ui/button";
import { GetEntities } from "@/lib/utils";
import { ReloadIcon } from "@radix-ui/react-icons";
import { notFound } from "next/navigation";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/shadcn-ui/tabs";
import { getHealthChecks } from "@/lib/utils";
import Summary from "@/components/dashboard/summary";
import { useState, useEffect } from "react";
import { Entity } from "@/data/entities";
import { Check } from "@/data/health";

export default function CustomerPage({ params }: { params: { id: string } }) {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [entity, setEntity] = useState<Entity | null>(null); // entities[params.id]);
  const [healthChecks, setHealthChecks] = useState<Check[]>([]);
  const [tab, setTab] = useState("health");
  const [isLoading, setIsLoading] = useState(true);

  console.log("params", params);

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
      console.log("newEntities", newEntities);
      console.log("myEntity", myEntity);
    } catch (error) {
      console.error("Error loading entities:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await loadEntities();
      await loadHealthChecks();
      setIsLoading(false);
      console.log("entities[id]", entities);
      console.log("entity[id]", entity);
    };

    loadData();
  }, []);

  const onTabChange = (tab: string) => {
    setTab(tab);
  };

  //const entity = entities ? entities.find((e) => (e.uid = params.id)) : null; Diese Funktion hat UIDs in entities verändert.

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
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

      <Tabs
        value={tab}
        onValueChange={onTabChange}
        className="h-full space-y-6"
      >
        <div className="space-between flex items-center">
          <TabsList>
            <TabsTrigger value="health">
              <span>Health</span>
            </TabsTrigger>
            <TabsTrigger value="store">
              <span>Store</span>
            </TabsTrigger>
            <TabsTrigger value="cfg">
              <span>Configuration</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="health">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {healthChecks && entity
              ? healthChecks
                  .filter(
                    (check) =>
                      check.name.startsWith("db") &&
                      check.name.includes(entity.id)
                  )
                  .map((check) => (
                    <Summary
                      key={check.name}
                      header={`${check.healthy}`}
                      main={check.name}
                      footer={`${check.timestamp}`}
                    />
                  ))
              : null}
          </div>
        </TabsContent>
        <TabsContent value="store">
          <div>Store content goes here</div>
        </TabsContent>
        <TabsContent value="cfg">
          <div>Configuration content goes here</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
