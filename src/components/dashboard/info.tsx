import { IconProps } from "@radix-ui/react-icons/dist/types";
import prettyMs from "pretty-ms";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import React from "react";
import { filesize } from "filesize";
import { GlobeIcon } from "@radix-ui/react-icons";
interface SummaryProps extends React.HTMLAttributes<HTMLDivElement> {
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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle
          className={`text-sm font-semibold ${
            health === "ACTIVE" || health === "true" || health === "HEALTHY"
              ? "text-success"
              : health === "OFFLINE"
              ? "text-muted-foreground"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {combinedData.map((data, index) => (
              <div
                key={index}
                className="flex flex-col items-start p-4 "
                style={{ minWidth: "300px", minHeight: "100px" }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: "10px",
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
                      width: "80px",
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
                    {data.version}
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
                  {IconFooter1 ? (
                    <IconFooter1
                      className="h-4 w-4 text-muted-foreground"
                      style={{ marginRight: "5px", marginTop: "2px" }}
                    />
                  ) : null}
                  <span
                    style={{
                      color: "dimgray",
                      width: "80px",
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
                    {data.uptime}
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
                      width: "80px",
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
                    {data.memory}
                  </span>
                </div>
                {data.apiUrl.length > 1 && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        color: "dimgray",
                        width: "50px",
                        fontSize: "14px",
                        fontWeight: "bold",
                        marginRight: "2px",
                      }}
                    >
                      <GlobeIcon className="h-4 w-4 inline" />
                    </span>
                    <span
                      style={{
                        color: "dimgray",
                        fontSize: "14px",
                        fontWeight: "bold",
                        marginLeft: "-30px",
                      }}
                    >
                      {data.apiUrl}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
