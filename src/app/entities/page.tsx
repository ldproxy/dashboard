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
import { GetEntities } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Entity } from "@/data/entities";
import { DevEntities } from "@/data/constants";

export default function EntitiesPage() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [tab, setTab] = useState("health");

  const entityTypes = entities
    .map((entity) => entity.subType.split(/[ _/]/)[0])
    .filter((value, index, self) => self.indexOf(value) === index);

  const entityTypeCounts = entities.reduce((counts, entity) => {
    const entityType = entity.subType.split(/[ _/]/)[0];
    if (!counts[entityType]) {
      counts[entityType] = 0;
    }
    counts[entityType]++;
    return counts;
  }, {} as { [key: string]: number });

  const entityTypeStatusCounts = entities.reduce((counts, entity) => {
    const entityType = entity.subType.split(/[ _/]/)[0];
    if (!counts[entityType]) {
      counts[entityType] = { active: 0, defective: 0 };
    }
    if (entity.status === "ACTIVE") {
      counts[entityType].active++;
    } else if (entity.status === "DEFECTIVE") {
      counts[entityType].defective++;
    }
    return counts;
  }, {} as { [key: string]: { active: number; defective: number } });

  const loadEntities = async () => {
    try {
      const newEntities = await GetEntities();
      setEntities(newEntities);
    } catch (error) {
      console.error("Error loading entities:", error);
    }
  };

  useEffect(() => {
    loadEntities();
  }, []);

  const onTabChange = (tab: string) => {
    setTab(tab);
  };

  if (DevEntities) {
    console.log("entityTypeStatusCounts:", entityTypeStatusCounts.ogc.active);
    console.log("Counts:", entityTypeCounts.ogc);
    console.log("entityTypes", entityTypes);
  }
  return (
    <div className="flex-1 space-y-4 p-8 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Entities</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={loadEntities} className="font-bold">
            <ReloadIcon className="mr-2 h-4 w-4" />
            Reload all
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
            {entityTypes.map((entity) => (
              <Summary
                key={entity}
                main={entity}
                footer={
                  entityTypeStatusCounts &&
                  entityTypeStatusCounts[entity] &&
                  entityTypeStatusCounts[entity].active &&
                  entityTypeStatusCounts[entity].defective
                    ? `${entityTypeStatusCounts[entity].active} active ${entityTypeStatusCounts[entity].defective} defective`
                    : entityTypeStatusCounts &&
                      entityTypeStatusCounts[entity] &&
                      entityTypeStatusCounts[entity].active
                    ? `${entityTypeStatusCounts[entity].active} active`
                    : entityTypeStatusCounts &&
                      entityTypeStatusCounts[entity] &&
                      entityTypeStatusCounts[entity].defective
                    ? `${entityTypeStatusCounts[entity].defective} defective`
                    : "No entities found"
                }
                total={entityTypeCounts[entity]}
                route={`/entities/${entity}`}
              />
            ))}
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
