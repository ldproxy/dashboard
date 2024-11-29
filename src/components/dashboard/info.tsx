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
import { ExternalLinkIcon } from "@radix-ui/react-icons";

export interface SummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  versions: { version: string; apiUrl: string }[];
  uptimes: { uptime: number; apiUrl: string }[];
  memories: { memory: number; apiUrl: string }[];
  health: string;
  infoUrl: string;
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
  infoUrl,
  Icon,
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

  const formattedUrl = infoUrl.endsWith("/") ? infoUrl.slice(0, -1) : infoUrl;

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.open(formattedUrl, "_blank", "noopener,noreferrer");
  };

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
        {formattedUrl && (
          <div className="text-2xl font-bold break-normal">
            <a
              href={formattedUrl}
              onClick={handleLinkClick}
              className="text-blue-500 hover:underline relative"
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {formattedUrl}
              <ExternalLinkIcon
                className="h-4 w-4 text-blue-500"
                style={{ marginLeft: "5px" }}
              />
              <span className="absolute left-0 bottom-full mb-1 hidden w-max bg-gray-700 text-white text-xs rounded py-1 px-2 z-10 group-hover:block">
                {formattedUrl}
              </span>
            </a>
          </div>
        )}{" "}
      </CardHeader>
      <CardContent className="w-full">
        <DataTable columns={columns} data={combinedData} />
      </CardContent>
    </Card>
  );
}
