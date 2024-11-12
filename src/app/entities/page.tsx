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
import { GetEntities, getHealthChecks } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Entity } from "@/data/entities";
import { autoRefreshInterval, DevEntities } from "@/data/constants";
import { getIcon } from "@/lib/icons";
import {
  asLabel,
  getEntityCategory,
  getEntityCategoryCounts,
  getStateSummary,
} from "@/lib/entities";

export default function EntitiesPage() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [tab, setTab] = useState("overview");
  const router = useRouter();
  let pathname = usePathname();

  const entityCategories = entities
    .map(getEntityCategory)
    .filter((typ, index, self) => self.indexOf(typ) === index);

  const entityTypeCounts = entities.reduce((counts, entity) => {
    const entityType = getEntityCategory(entity);
    if (!counts[entityType]) {
      counts[entityType] = 0;
    }
    counts[entityType]++;
    return counts;
  }, {} as { [key: string]: number });

  const entityTypeStatusCounts = getEntityCategoryCounts(
    entities,
    entityCategories
  );

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

  useEffect(() => {
    const interval = setInterval(() => {
      loadEntities();
    }, autoRefreshInterval);
    if (pathname) {
      setTab(window.location.hash.slice(1) || "overview");
    }
    return () => clearInterval(interval);
  }, [pathname]);

  const onTabChange = (tab: string) => {
    setTab(tab);
    router.push(`${pathname}#${tab}`);
  };

  if (DevEntities) {
    console.log("entityTypeStatusCounts:", entityTypeStatusCounts);
    console.log("entities", entities);
    console.log("Counts:", entityTypeCounts.API);
    console.log("entityTypes", entityCategories);
  }
  return (
    <div className="flex-1 space-y-4 p-8 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Entities</h2>
        {/*<div className="flex items-center space-x-2">
          <Button onClick={loadEntities} className="font-bold">
            <ReloadIcon className="mr-2 h-4 w-4" />
            Reload all
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
            {entityCategories.map((entityCategory) => (
              <TabsTrigger key={entityCategory} value={entityCategory}>
                <span>{asLabel(entityCategory)}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {entityCategories.map((entityCategory) => (
              <Summary
                key={entityCategory}
                main={asLabel(entityCategory)}
                footer={getStateSummary(entityTypeStatusCounts[entityCategory])}
                total={entityTypeCounts[entityCategory]}
                onClick={() => setTab(entityCategory)}
                route={`${pathname}#${entityCategory}`}
                Icon={getIcon("Id")}
              />
            ))}
          </div>
        </TabsContent>
        {entityCategories.map((entityCategory) => (
          <TabsContent key={entityCategory} value={entityCategory}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {entities
                .filter(
                  (entity) => getEntityCategory(entity) === entityCategory
                )
                .map((entity) => (
                  <Summary
                    key={entity.uid}
                    header={entity.status}
                    main={entity.id}
                    footer={entity.subType.toUpperCase()}
                    route={`/entities/details?id=${entity.uid}`}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
