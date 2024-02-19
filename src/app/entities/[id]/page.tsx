"use client";
import { Button } from "@/components/shadcn-ui/button";
import GetEntities from "@/lib/utils";
import { ReloadIcon } from "@radix-ui/react-icons";
import { notFound } from "next/navigation";

import { Tabs, TabsList, TabsTrigger } from "@/components/shadcn-ui/tabs";
import { healthChecks } from "@/data/health";
import Summary from "@/components/dashboard/summary";

export default function CustomerPage({ params }: { params: { id: string } }) {
  const entities = GetEntities();
  const entity = entities.find((e) => (e.uid = params.id));

  if (!entity) {
    return notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{entity.id}</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <ReloadIcon className="mr-2 h-4 w-4" />
            Reload
          </Button>
        </div>
      </div>

      <Tabs defaultValue="health" className="h-full space-y-6">
        <div className="space-between flex items-center">
          <TabsList>
            <TabsTrigger value="health">
              <span>Health</span>
            </TabsTrigger>
            <TabsTrigger value="cfg">
              <span>Configuration</span>
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {healthChecks
          .filter(
            (check) =>
              check.name.startsWith("db") && check.name.includes(entity.id)
          )
          .map((check) => (
            <Summary
              key={check.name}
              header={`${check.healthy}`}
              main={check.name}
              footer={`${check.timestamp}`}
            />
          ))}
      </div>
    </div>
  );
}
