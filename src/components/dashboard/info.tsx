import { IconProps } from "@radix-ui/react-icons/dist/types";
import { columns } from "@/components/dashboard/DataTableComponents/ColumnsInfoBox";
import { DataTable } from "@/components/dashboard/DataTableComponents/DataTable";
import prettyMs from "pretty-ms";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import React from "react";
import { filesize } from "filesize";

export interface SummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  versions: { version: string; apiUrl: string }[];
  uptimes: { uptime: number; apiUrl: string }[];
  memories: { memory: number; apiUrl: string }[];
  health: string;
  Icon?: React.FunctionComponent<IconProps>;
  IconFooter1?: React.FunctionComponent<IconProps>;
  IconFooter2?: React.FunctionComponent<IconProps>;
  IconFooter3?: React.FunctionComponent<IconProps>;
  className?: string;
}

export default function CustomersPage({
  name,
  versions = [],
  uptimes = [],
  memories = [],
  health,
  Icon,
  IconFooter1,
  IconFooter2,
  IconFooter3,
  className,
}: SummaryProps) {
  const formattedMemories = memories.map((memory) =>
    filesize(memory.memory, { base: 10 })
  );
  const formattedUptimes = uptimes.map((uptime) =>
    prettyMs(uptime.uptime, { secondsDecimalDigits: 0 })
  );

  const cardClassName = `shadow-lg ${className} ${
    health === "OFFLINE" ? "opacity-50 pointer-events-none" : ""
  }`;

  const combinedData = versions.map((version, index) => ({
    version: version.version,
    apiUrl: version.apiUrl,
    uptime: formattedUptimes[index],
    memory: formattedMemories[index],
  }));

  return (
    <Card className={cardClassName}>
      <CardHeader className="flex flex-col items-start space-y-2 pb-2  mb-5">
        <div className="flex flex-row items-center justify-between w-full">
          <CardTitle
            className={`text-sm font-semibold mb-2 ${
              health === "ACTIVE" || health === "true" || health === "HEALTHY"
                ? "text-success"
                : health === "OFFLINE"
                ? "text-muted-foreground"
                : health === "LIMITED"
                ? "text-yellow-500"
                : "text-destructive"
            }`}
            style={{ fontSize: "1.25rem" }}
          >
            {health}
          </CardTitle>
          {Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : null}
        </div>
        <div className="text-2xl font-bold break-normal">{name}</div>
      </CardHeader>
      <CardContent className="w-full">
        <DataTable columns={columns} data={combinedData} />
      </CardContent>
    </Card>
  );
}
