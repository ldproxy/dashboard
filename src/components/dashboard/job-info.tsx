import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
// import { Progress } from "@/components/shadcn-ui/progress";
import React, { useState } from "react";
import prettyMs from "pretty-ms";
import { Progress } from "@/components/dashboard/Progress";
import { TileSets } from "@/data/jobs";

interface SummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  entity: string;
  tilesets: TileSets;
  label: string;
  percent: number;
  startedAt: number;
  updatedAt: number;
  id: string;
}

export default function CustomersPage({
  entity,
  tilesets,
  label,
  percent,
  startedAt,
  updatedAt,
  id,
}: SummaryProps) {
  const durationInMs = (updatedAt - startedAt) * 1000;
  const readableDuration = prettyMs(durationInMs, { compact: true });

  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  return (
    <Card
      className="shadow-lg"
      style={{ height: "290px", overflow: "auto", boxSizing: "border-box" }}
    >
      <CardHeader>
        <CardTitle className="text-2xl font-bold break-normal mb-5">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <span className="text-blue-600" style={{ width: "50%" }}>
              {label}
            </span>
            <span style={{ width: "50%" }}>Tilesets</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-start">
        <div
          className="text-2xl font-bold break-normal"
          style={{
            width: "30%",
            marginRight: "220px",
          }}
        >
          <span>{entity}</span>
          <div>
            <div
              className={`flex flex-col justify-center items-center w-5/6 ${
                percent === 100 ? "" : "animate-pulse"
              } mt-1`}
            >
              <div
                className="text-center"
                style={{
                  marginTop: "30px",
                  fontSize: "14px",
                  color: "gray",
                }}
              >
                Duration: {readableDuration}
              </div>
              <Progress
                value={percent}
                indicatorColor={`${
                  percent === 100 ? "bg-green-400" : "bg-blue-400"
                }`}
              />
              <span className="w-1/6 text-right mt-4">{percent}%</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-[360px] mt-[-10px]">
          {Object.keys(tilesets).length > 0 && (
            <div
              style={{
                marginRight: "225px",
                marginTop: "-18px",
                height: "50px",
                width: "100%",
              }}
            >
              {Object.entries(tilesets).map(([key, value]) => (
                <div key={key}>
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      color: "dimgray",
                      fontSize: "14px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    <button
                      onClick={() => toggleSection(`${id} + ${key}`)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        marginRight: "5px",
                        width: "20px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {expandedSections.includes(`${id} + ${key}`) ? "▼" : "▶"}
                    </button>
                    <div
                      style={{
                        width: "175px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: "dimgray",
                        fontSize: "14px",
                        fontWeight: "bold",
                        marginRight: "20px",
                      }}
                      title={key}
                    >
                      {key}
                    </div>
                    {value.progress && value.progress.total && (
                      <div
                        className={`flex flex-col justify-center items-center w-1/6 ${
                          value.progress.total === 100 ? "" : "animate-pulse"
                        } mt-1`}
                      >
                        <Progress
                          value={value.progress.total}
                          indicatorColor={`${
                            value.progress.total === 100
                              ? "bg-green-400"
                              : "bg-blue-400"
                          }`}
                        />
                      </div>
                    )}
                  </div>

                  {expandedSections.includes(`${id} + ${key}`) &&
                    value.progress &&
                    Object.keys(value.progress)[1] && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          marginLeft: "35px",
                          marginBottom: "5px",
                          color: "#808080",
                          fontSize: "12px",
                          fontWeight: "bold",
                          marginRight: "20px",
                        }}
                      >
                        <div
                          className={`mr-2 ${
                            value.progress.total === 100 ? "text-green-400" : ""
                          }`}
                        >
                          {Object.keys(value.progress)[1]}:
                        </div>
                        {value.progress &&
                          Object.keys(
                            Object.values(value.progress)[1] as {
                              [key: string]: number;
                            }
                          ).map((zoomlevel, index, array) => {
                            if (!value.progress) {
                              return null;
                            }
                            const progressValues = Object.values(
                              value.progress
                            )[1] as { [zoomlevel: string]: number };
                            const isComplete =
                              progressValues[zoomlevel] === 100;

                            return (
                              <span
                                key={zoomlevel}
                                className={`${
                                  !isComplete
                                    ? "animate-pulse"
                                    : "text-green-400"
                                }`}
                                style={{ marginRight: "5px" }}
                              >
                                {zoomlevel}
                                {index < array.length - 1 ? ", " : ""}
                              </span>
                            );
                          })}
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
