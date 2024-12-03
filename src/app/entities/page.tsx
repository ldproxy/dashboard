"use client";

import Summary from "@/components/dashboard/summary";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/shadcn-ui/tabs";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import {
  GetEntities,
  getHealthChecks,
  compareDataAcrossUrls,
} from "@/lib/utils";
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
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export default function EntitiesPage() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [tab, setTab] = useState("overview");
  const router = useRouter();
  let pathname = usePathname();
  const [deploymentId, setDeploymentId] = useState("");
  const [nodesDifferent, setNodesDifferent] = useState({
    entities: false,
  });

  const multipleDeployments = process.env.NEXT_PUBLIC_MULTIPLE_DEPLOYMENTS;

  const getDeploymentId = async () => {
    const currentUrl = new URL(window.location.href);
    const queryParams = new URLSearchParams(currentUrl.search);
    const did = queryParams.get("did");
    if (did) {
      setDeploymentId(did);
    }
  };

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

      newEntities.forEach((entity: any) => {
        const hc = healthChecks.find(
          (check: any) => check.name === `entities/${entity.type}/${entity.id}`
        );
        entity.status = hc && hc.state ? hc.state : "UNKNOWN";
      });

      setEntities(newEntities);
    } catch (error) {
      console.error("Error loading entities:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await loadEntities();
    };

    loadData();
    checkDifferences();

    const interval = setInterval(() => {
      loadEntities(), checkDifferences();
    }, autoRefreshInterval);
    if (pathname) {
      setTab(window.location.hash.slice(1) || "overview");
    }
    if (multipleDeployments === "multi" || multipleDeployments === "saas") {
      getDeploymentId();
    }
    return () => clearInterval(interval);
  }, [multipleDeployments, pathname]);

  const onTabChange = (tab: string) => {
    setTab(tab);
    if (deploymentId !== "") {
      router.push(`${pathname}?did=${deploymentId}#${tab}`);
    } else {
      router.push(`${pathname}#${tab}`);
    }
  };

  const checkDifferences = async () => {
    const differences = await compareDataAcrossUrls();
    const newNodesDifferent = { ...nodesDifferent };

    if (differences.entitiesDifferent) {
      newNodesDifferent.entities = true;
    }

    setNodesDifferent(newNodesDifferent);
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
