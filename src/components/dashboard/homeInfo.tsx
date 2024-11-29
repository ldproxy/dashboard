import { IconProps } from "@radix-ui/react-icons/dist/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import React from "react";
import { GlobeIcon, ExternalLinkIcon } from "@radix-ui/react-icons";

export interface SummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  url: string;
  totalNodes: number;
  availableNodes: number;
  health: string;
  Icon?: React.FunctionComponent<IconProps>;
  IconFooter1?: React.FunctionComponent<IconProps>;
  IconFooter2?: React.FunctionComponent<IconProps>;
  IconFooter3?: React.FunctionComponent<IconProps>;
  className?: string;
}

export default function CustomersPage({
  name,
  url,
  totalNodes,
  availableNodes,
  health,
  Icon,
  IconFooter1,
  IconFooter2,
  className,
}: SummaryProps) {
  const cardClassName = `shadow-lg ${className} ${
    health === "OFFLINE" ? "opacity-50 pointer-events-none" : ""
  }`;

  const formattedUrl = url.endsWith("/") ? url.slice(0, -1) : url;

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.open(formattedUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className={cardClassName}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle
          className={`text-sm font-semibold ${
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
        <div style={{ width: "100%", marginTop: "-30px" }}>
          <div
            className="flex flex-col items-start p-4"
            style={{ minWidth: "300px", minHeight: "100px" }}
          >
            {formattedUrl && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <GlobeIcon
                  className="h-4 w-4 text-muted-foreground"
                  style={{ marginTop: "2px" }}
                />
                <a
                  href={formattedUrl}
                  onClick={handleLinkClick}
                  className="text-blue-500 hover:underline relative"
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    marginLeft: "5px",
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
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: "10px",
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
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Total Replicas:
              </span>
              <span
                style={{
                  color: "dimgray",
                  fontSize: "14px",
                  fontWeight: "bold",
                  marginLeft: "5px",
                }}
              >
                {totalNodes}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: "10px",
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
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Available Replicas:
              </span>
              <span
                style={{
                  color: "dimgray",
                  fontSize: "14px",
                  fontWeight: "bold",
                  marginLeft: "5px",
                }}
              >
                {availableNodes}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
