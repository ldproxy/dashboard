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
import { FooterSummary } from "./FooterSummary";

interface SummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: string;
  main: string | React.ReactElement;
  footer?: string;
  route?: string;
  Icon?: React.FunctionComponent<IconProps>;
}

export default function CustomersPage({
  header,
  main,
  footer,
  route,
  Icon,
  ...props
}: SummaryProps) {
  return (
    <Link href={route || "#"}>
      <Card
        className="shadow-lg hover:bg-gray-100 transition-colors duration-200"
        {...props}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle
            className={`text-sm font-semibold ${
              header === "ACTIVE" || header === "true"
                ? "text-blue-700"
                : "text-red-700"
            }`}
          >
            {header ? (
              header
            ) : Icon ? (
              <Icon className="h-4 w-4 text-muted-foreground" />
            ) : null}
          </CardTitle>
          {Icon && header ? (
            <Icon className="h-4 w-4 text-muted-foreground" />
          ) : null}
        </CardHeader>
        <CardContent className="overflow-hidden">
          {main.toString().includes("ConnectivityCheck") ? (
            <>
              <div className="text-1xl font-bold break-normal">
                {main.toString().split("ConnectivityCheck")[0]}
              </div>
              <div className="text-1xl font-bold break-normal">
                ConnectivityCheck
              </div>
            </>
          ) : (
            <div
              className="text-2xl font-bold break-normal"
              style={{
                marginBottom: "5px",
              }}
            >
              {main}
            </div>
          )}
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <p
              className="text-xs text-muted-foreground"
              style={{ display: "flex", flexDirection: "row" }}
            >
              {footer ? <FooterSummary footer={footer} /> : null}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
