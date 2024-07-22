import { IconProps } from "@radix-ui/react-icons/dist/types";
import prettyMs from "pretty-ms";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import React, { ReactNode } from "react";
import { filesize } from "filesize";

interface SummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  version: string;
  uptime: number;
  memory: number;
  health: string;
  Icon?: React.FunctionComponent<IconProps>;
  IconFooter1?: React.FunctionComponent<IconProps>;
  IconFooter2?: React.FunctionComponent<IconProps>;
  IconFooter3?: React.FunctionComponent<IconProps>;
  className?: string;
}

export default function CustomersPage({
  name,
  version,
  uptime,
  memory,
  health,
  Icon,
  IconFooter1,
  IconFooter2,
  IconFooter3,
  className,
}: SummaryProps) {
  const formattedMemory = filesize(memory, { base: 10 });
  const formattedUptime = prettyMs(uptime, { secondsDecimalDigits: 0 });

  return (
    <Card className={`shadow-lg ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle
          className={`text-sm font-semibold ${
            health === "ACTIVE" || health === "true" || health === "HEALTHY"
              ? "text-success"
              : health === "OFFLINE"
              ? "text-muted-foreground"
              : "text-destructive"
          }`}
        >
          {health}
        </CardTitle>
        {Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : null}
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <div
          className="text-2xl font-bold break-normal"
          style={{
            marginBottom: "3px",
            width: "65%",
          }}
        >
          {name}
        </div>
        <div style={{ width: "35%", marginTop: "-30px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {IconFooter3 ? (
              <IconFooter3
                className="h-4 w-4 text-muted-foreground"
                style={{ marginRight: "5px", marginTop: "2px" }}
              />
            ) : null}
            <span
              style={{
                color: "dimgray",
                width: "65px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              Version:
            </span>
            <span
              style={{
                color: "dimgray",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {version}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {IconFooter1 ? (
              <IconFooter1
                className="h-4 w-4 text-muted-foreground"
                style={{ marginRight: "5px", marginTop: "2px" }}
              />
            ) : null}
            <span
              style={{
                color: "dimgray",
                width: "65px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              Uptime:
            </span>
            <span
              style={{
                color: "dimgray",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {uptime === -1 ? "" : formattedUptime}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {IconFooter2 ? (
              <IconFooter2
                className="h-4 w-4 text-muted-foreground"
                style={{ marginRight: "5px", marginTop: "2px" }}
              />
            ) : null}
            <span
              style={{
                color: "dimgray",
                width: "65px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              Memory:
            </span>
            <span
              style={{
                color: "dimgray",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {memory === -1 ? "" : formattedMemory}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
