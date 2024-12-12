"use client";

import Summary from "@/components/dashboard/Summary";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/shadcn-ui/tabs";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { autoRefreshInterval, DevEntities } from "@/dev-data/constants";
import { getIcon } from "@/lib/icons";
import {
  asLabel,
  getEntityCategory,
  getEntityCategoryCounts,
  getStateSummary,
} from "@/lib/entities";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useDataLoader } from "@/lib/loadDataHook";

import { getDeploymentId } from "@/lib/deployments";

export default function EntitiesPage() {
  const [tab, setTab] = useState("overview");
  const router = useRouter();
  let pathname = usePathname();
  const [deploymentId, setDeploymentId] = useState("");
  const { entities, nodesDifferent, loadData } = useDataLoader({
    loadEntities: true,
    checkDifferences: true,
  });

  const multipleDeployments = process.env.NEXT_PUBLIC_MULTIPLE_DEPLOYMENTS;

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

  useEffect(() => {
    loadData({ loadEntities: true, checkDifferences: true });

    const interval = setInterval(() => {
      loadData({ loadEntities: true, checkDifferences: true });
    }, autoRefreshInterval);
    return () => clearInterval(interval);
    // not all dependendies to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pathname) {
      setTab(window.location.hash.slice(1) || "overview");
    }
    if (multipleDeployments === "multi" || multipleDeployments === "saas") {
      getDeploymentId(setDeploymentId);
    }
    // did not include function checkDifferences() to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multipleDeployments, pathname]);

  const onTabChange = (tab: string) => {
    setTab(tab);
    if (deploymentId !== "") {
      router.push(`${pathname}?did=${deploymentId}#${tab}`);
    } else {
      router.push(`${pathname}#${tab}`);
    }
  };

  const getWarningMessage = () => {
    if (nodesDifferent.entities) {
      return `Warning: Differences detected in entities across different replicas. This issue is likely temporary.`;
    }
    return null;
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

        {getWarningMessage() && (
          <div className="flex items-center space-x-2 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            <ExclamationTriangleIcon className="h-5 w-5" />
            <span>{getWarningMessage()}</span>
          </div>
        )}

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {entityCategories.map((entityCategory) => (
              <Summary
                key={entityCategory}
                main={asLabel(entityCategory)}
                footer={getStateSummary(entityTypeStatusCounts[entityCategory])}
                total={entityTypeCounts[entityCategory]}
                onClick={() => setTab(entityCategory)}
                route={`${pathname}${
                  deploymentId !== "" ? `?did=${deploymentId}` : ""
                }#${entityCategory}`}
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
                    route={`/entities/details${
                      deploymentId ? `?did=${deploymentId}&` : "?"
                    }id=${entity.uid}`}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
