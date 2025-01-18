"use client";

import Summary from "@/components/dashboard/Summary";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/shadcn-ui/tabs";
import { useDataLoader } from "@/lib/loadDataHook";
import { useEffect, useState } from "react";
import { getIcon } from "@/lib/icons";
import { columns } from "@/components/dashboard/DataTableComponents/ColumnsValues";
import { DataTable } from "@/components/dashboard/DataTableComponents/DataTable";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { getDeploymentId } from "@/lib/deployments";
import { useReloadInterval } from "../layout";
import { IS_MODE_MULTI } from "@/lib/env";
import { Value } from "@/lib/values";

interface TableDataItem {
  label: string;
  type: string;
}

export default function EntitiesPage() {
  const autoRefreshInterval = useReloadInterval();
  const [tab, setTab] = useState("overview");
  const [tableData, setTableData] = useState<TableDataItem[]>([]);
  const router = useRouter();
  let pathname = usePathname();
  const [deploymentId, setDeploymentId] = useState("");
  const { values, nodesDifferent, loadData } = useDataLoader();

  useEffect(() => {
    loadData({ loadValues: true, checkDifferences: true });

    if (autoRefreshInterval > 0) {
      const interval = setInterval(() => {
        loadData({ loadValues: true, checkDifferences: true });
      }, autoRefreshInterval * 1000);
      return () => clearInterval(interval);
    }

    if (pathname) {
      setTab(window.location.hash.slice(1) || "overview");
    }
    if (IS_MODE_MULTI) {
      getDeploymentId(setDeploymentId);
    }
    // did not include checkDifferences() to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, autoRefreshInterval]);

  useEffect(() => {
    if (values.length > 0) {
      declareTableData();
    }
    // did not include checkDifferences() to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const declareTableData = async () => {
    try {
      const tableData = values.map((value: any) => ({
        label: value.path,
        type: value.type,
      }));
      setTableData(tableData);
    } catch (error) {
      console.error("Error loading values:", error);
    }
  };

  const valueTypes = values
    .map((value: Value) => value.type)
    .filter((typ, index, self) => self.indexOf(typ) === index);

  const valueTypeCounts = values.reduce((counts, value) => {
    const valueType = value.type;
    if (!counts[valueType]) {
      counts[valueType] = 0;
    }
    counts[valueType]++;
    return counts;
  }, {} as { [key: string]: number });

  const getWarningMessage = () => {
    if (nodesDifferent.values) {
      return `Warning: Differences detected in values across different replicas. This issue is likely temporary.`;
    }
    return null;
  };

  const onTabChange = (tab: string) => {
    setTab(tab);
    if (deploymentId !== "") {
      router.push(`${pathname}?did=${deploymentId}#${tab}`);
    } else {
      router.push(`${pathname}#${tab}`);
    }
  };

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

        {getWarningMessage() && (
          <div className="flex items-center space-x-2 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            <ExclamationTriangleIcon className="h-5 w-5" />
            <span>{getWarningMessage()}</span>
          </div>
        )}

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {valueTypes.length > 0 ? (
              valueTypes.map((valueType) => (
                <Summary
                  key={valueType}
                  main={valueType}
                  total={valueTypeCounts[valueType]}
                  onClick={() => {
                    setTab(valueType);
                  }}
                  Icon={getIcon("Code")}
                  route={`${pathname}${
                    deploymentId !== "" ? `?did=${deploymentId}` : ""
                  }#${valueType}`}
                />
              ))
            ) : (
              <span>Currently No Values</span>
            )}
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
