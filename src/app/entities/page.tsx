"use client";

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
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { GetEntities } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Entity } from "@/data/entities";
import { DevEntities } from "@/data/constants";
import { getIcon } from "@/lib/icons";

export default function EntitiesPage() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [tab, setTab] = useState("overview");
  const router = useRouter();
  let pathname = usePathname();

  const entityTypes = entities
    .filter((entity) => {
      const entityType = entity.subType.split(/[ _/]/)[0];
      return (
        !(entityType === "features" && entity.type !== "providers") &&
        !(entityType === "ogc" && entity.type !== "services") &&
        !(entityType === "tiles" && entity.type !== "providers")
      );
    })
    .map((entity) => entity.subType.split(/[ _/]/)[0])
    .filter((value, index, self) => self.indexOf(value) === index);

  const filteredEntities = entities.filter((entity) => {
    const entityType = entity.subType.split(/[ _/]/)[0];
    return (
      !(entityType === "features" && entity.type !== "providers") &&
      !(entityType === "ogc" && entity.type !== "services") &&
      !(entityType === "tiles" && entity.type !== "providers")
    );
  });

  const entityTypeCounts = filteredEntities.reduce((counts, entity) => {
    const entityType = entity.subType.split(/[ _/]/)[0];
    if (!counts[entityType]) {
      counts[entityType] = 0;
    }
    counts[entityType]++;
    return counts;
  }, {} as { [key: string]: number });

  const entityTypeStatusCounts = filteredEntities.reduce((counts, entity) => {
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
    if (pathname) {
      setTab(window.location.hash.slice(1) || "overview");
    }
  }, []);

  const onTabChange = (tab: string) => {
    setTab(tab);
    router.push(`${pathname}#${tab}`);
  };

  if (DevEntities) {
    console.log("entityTypeStatusCounts:", entityTypeStatusCounts);
    console.log("entities", entities);
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
            <TabsTrigger value="overview">
              <span>Overview</span>
            </TabsTrigger>
            {entityTypes.map((entityType) => (
              <TabsTrigger key={entityType} value={entityType}>
                <span>{entityType}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="overview">
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
                onClick={() => setTab(entity)}
                route={`${pathname}#${entity}`}
                Icon={getIcon("Id")}
              />
            ))}
          </div>
        </TabsContent>
        {entityTypes.map((entityType) => (
          <TabsContent key={entityType} value={entityType}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {filteredEntities
                .filter(
                  (entity) => entity.subType.split(/[ _/]/)[0] === entityType
                )
                .map((entity) => (
                  <Summary
                    key={entity.uid}
                    header={entity.status}
                    main={entity.id}
                    footer={entity.subType}
                    route={`/entities/${entity.uid}`}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
