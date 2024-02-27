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

interface TableDataItem {
  label: string;
  type: string;
}

export default function EntitiesPage() {
  const [values, setValues] = useState<any[]>([]);
  const [tab, setTab] = useState("overview");
  const [tableData, setTableData] = useState<TableDataItem[]>([]);

  const loadValues = async () => {
    try {
      const newValues = await getValues();
      setValues(newValues);
      const tableData = newValues.map((value: any) => ({
        label: value.id ? value.id : value.path,
        type: value.type,
      }));
      setTableData(tableData);
    } catch (error) {
      console.error("Error loading values:", error);
    }
  };

  useEffect(() => {
    loadValues();
  }, []);

  const onTabChange = (tab: string) => {
    setTab(tab);
  };

  const valueTypes = values
    .map((value: InputValue) => value.type)
    .filter((value, index, self) => self.indexOf(value) === index);

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
        <div className="flex items-center space-x-2">
          <Button onClick={loadValues} className="font-bold">
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
            {valueTypes.map((valueType) => (
              <TabsTrigger key={valueType} value={valueType}>
                <span>{valueType}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <Summary
                key={value.id ? value.id : value.path ? value.path : "No Id"}
                main={value.type}
                total={valueTypeCounts[value.type]}
                onClick={() => setTab(value.type)}
                Icon={getIcon("Code")}
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
