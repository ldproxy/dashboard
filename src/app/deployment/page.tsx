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
import { healthChecks } from "@/data/health";
import { useState } from "react";

export default function DeploymentPage() {
  const [tab, setTab] = useState("health");

  const onTabChange = (tab: string) => {
    setTab(tab);
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Deployment</h2>
        <div className="flex items-center space-x-2">
          <Button>
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
            {healthChecks
              .filter((check) => !check.name.startsWith("db"))
              .map((check) => (
                <Summary
                  key={check.name}
                  header={`${check.healthy}`}
                  main={check.name}
                  footer={`${check.timestamp}`}
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
