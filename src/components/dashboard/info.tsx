import { IconProps } from "@radix-ui/react-icons/dist/types";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import React, { ReactNode } from "react";
import { getIcon } from "@/lib/icons";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";

interface SummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  version: string;
  uptime: number;
  memory: number;
  health: string;
  Icon?: React.FunctionComponent<IconProps>;
}

export default function CustomersPage({
  name,
  version,
  uptime,
  memory,
  health,
  Icon,
}: SummaryProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle
          className={`text-sm font-semibold ${
            health === "ACTIVE" || health === "true" || health === "HEALTHY"
              ? "text-blue-700"
              : "text-red-700"
          }`}
        >
          {health}
        </CardTitle>
        {Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : null}
      </CardHeader>
      <CardContent className="flex justify-between items-center overflow-hidden">
        <div
          className="text-2xl font-bold break-normal"
          style={{
            marginBottom: "3px",
          }}
        >
          {name}
          <p
            className="text-xs text-muted-foreground"
            style={{ marginTop: "10px" }}
          >
            {version}
          </p>
        </div>
        <div style={{ marginRight: "250px", marginBottom: "-10px" }}>
          <p style={{ fontSize: "14px", fontWeight: "bold" }}>
            Uptime: {uptime}
          </p>
          <p style={{ fontSize: "14px", fontWeight: "bold" }}>
            Memory: {memory}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
