"use client";

import Summary from "@/components/dashboard/summary";
import { Button } from "@/components/shadcn-ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/shadcn-ui/tabs";
import { getValues } from "@/lib/utils";
import { useEffect, useState } from "react";
import { InputValue } from "@/data/values";
import { getIcon } from "@/lib/icons";
import { columns } from "@/components/dashboard/DataTableComponents/ColumnsValues";
import { DataTable } from "@/components/dashboard/DataTableComponents/DataTable";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

interface TableDataItem {
  label: string;
  type: string;
}

export default function EntitiesPage() {
  const [values, setValues] = useState<any[]>([]);
  const [tab, setTab] = useState("overview");
  const [tableData, setTableData] = useState<TableDataItem[]>([]);
  const router = useRouter();
  let pathname = usePathname();
  const [deploymentId, setDeploymentId] = useState("");

  const multipleDeployments = process.env.NEXT_PUBLIC_MULTIPLE_DEPLOYMENTS;

  const getDeploymentId = async () => {
    const currentUrl = new URL(window.location.href);
    const queryParams = new URLSearchParams(currentUrl.search);
    const did = queryParams.get("did");
    if (did) {
      setDeploymentId(did);
    }
  };

  const loadValues = async () => {
    try {
      const newValues = await getValues();
      setValues(newValues);
      const tableData = newValues.map((value: any) => ({
        label: value.path,
        type: value.type,
      }));
      setTableData(tableData);
    } catch (error) {
      console.error("Error loading values:", error);
    }
  };

  useEffect(() => {
    loadValues();
    if (pathname) {
      setTab(window.location.hash.slice(1) || "overview");
    }
    if (multipleDeployments === "true") {
      getDeploymentId();
    }
  }, [multipleDeployments, pathname]);

  const onTabChange = (tab: string) => {
    setTab(tab);
    router.push(`${pathname}?did=${deploymentId}#${tab}`);
  };

  const valueTypes = values
    .map((value: InputValue) => value.type)
    .filter((typ, index, self) => self.indexOf(typ) === index);

  const valueTypeCounts = values.reduce((counts, value) => {
    const valueType = value.type;
    if (!counts[valueType]) {
      counts[valueType] = 0;
    }
    counts[valueType]++;
    return counts;
  }, {} as { [key: string]: number });

  return (
    <div className="flex-1 space-y-4 p-8 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Values</h2>
        {/*<div className="flex items-center space-x-2">
          <Button onClick={loadValues} className="font-bold">
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
            {valueTypes.map((valueType) => (
              <TabsTrigger key={valueType} value={valueType}>
                <span>{valueType}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {valueTypes.map((valueType) => (
              <Summary
                key={valueType}
                main={valueType}
                total={valueTypeCounts[valueType]}
                onClick={() => {
                  setTab(valueType);
                }}
                Icon={getIcon("Code")}
                route={`${pathname}#${valueType}`}
              />
            ))}
          </div>
        </TabsContent>
        {valueTypes.map((valueType) => (
          <TabsContent key={valueType} value={valueType}>
            <DataTable
              columns={columns}
              data={tableData.filter((item) => item.type === valueType)}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
