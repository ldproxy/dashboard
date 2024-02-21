"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import Summary from "@/components/dashboard/summary";
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
import { GetEntities, getHealthChecks } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Check } from "@/data/health";
import { getIcon } from "@/lib/icons";
import { Entity } from "@/data/entities";

export default function DeploymentPage() {
  const [healthChecks, setHealthChecks] = useState<Check[]>([]);
  const [tab, setTab] = useState("overview");
  const [entities, setEntities] = useState<Entity[]>([]);

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

  useEffect(() => {
    loadHealthChecks();
    loadEntities();
  }, []);

  const onTabChange = (tab: string) => {
    setTab(tab);
  };

  // Following variables are only used for the footer of the entities summary
  const totalEntities = entities.length;
  const activeEntities = entities.filter(
    (entity) => entity.status === "ACTIVE"
  ).length;

  const entitiesFooterCaseActive = `${activeEntities} active`;
  const entitiesFooterCaseInactive =
    totalEntities !== activeEntities
      ? `${totalEntities - activeEntities} inactive`
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Summary
              key="Entities"
              main="Entities"
              route="/entities"
              footer={actualEntitiesFooter}
              Icon={getIcon("Id")}
            />
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
