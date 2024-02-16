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
import { Tabs, TabsList, TabsTrigger } from "@/components/shadcn-ui/tabs";
import { Badge } from "@/components/shadcn-ui/badge";
import { healthChecks } from "@/data/health";
import GetEntities from "@/lib/utils";

export default function EntitiesPage() {
  const entities = GetEntities();
  console.log("entities", entities);
  //TODO: fetch, pass to [id]?
  const customers = [
    { id: 1, name: "IT.NRW", issues: 3, duration: "3 years" },
    { id: 2, name: "Hamburg", issues: 1, duration: "1 month" },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Entities</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <ReloadIcon className="mr-2 h-4 w-4" />
            Reload all
          </Button>
        </div>
      </div>
      <Tabs defaultValue="health" className="h-full space-y-6">
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
      </Tabs>
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
    </div>
  );
}
