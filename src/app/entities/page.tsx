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

export default function EntitiesPage() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [tab, setTab] = useState("health");

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

  return (
    <div className="flex-1 space-y-4 p-8 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Entities</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={loadEntities}>
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
            {entities.map((entity) => (
              <Summary
                key={entity.uid}
                header={`${entity.status}`}
                main={entity.id}
                footer={`${entity.type}`}
                route={`/entities/${entity.uid}`}
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
