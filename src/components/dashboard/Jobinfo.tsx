import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import React, { useState } from "react";
import prettyMs from "pretty-ms";
import { Progress } from "@/components/dashboard/Progress";
import { JobStatus, TileSetProgress, TileSets } from "@/lib/jobs";

export interface SummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  entity: string;
  tilesets: TileSets;
  label: string;
  percent: number;
  status: JobStatus;
  startedAt: number;
  updatedAt: number;
  id: string;
  info: string;
  url: string;
}

const tileSetPercent = ({ percent, current, total }: TileSetProgress) =>
  percent ?? (total > 0 ? Math.round((100 * current) / total) : 0);

export default function JobInfo({
  entity,
  tilesets,
  label,
  percent,
  status,
  startedAt,
  updatedAt,
  id,
  info,
  url,
}: SummaryProps) {
  const completed = status === "SUCCESSFUL";
  const durationInMs = updatedAt - startedAt;
  const readableDuration =
    startedAt <= 0
      ? "waiting"
      : updatedAt <= 0
        ? "starting"
        : prettyMs(durationInMs);

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
      className="shadow-lg flex flex-col overflow-hidden"
      style={{ height: "250px", boxSizing: "border-box" }}
    >
      <CardHeader>
        <CardTitle className="text-2xl font-bold break-normal mb-5">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div
              className={`flex-none ${
                completed ? "text-green-500" : "text-blue-500"
              }`}
              style={{
                width: "360px",
                marginRight: "90px",
                paddingRight: "60px",
                textAlign: "center",
              }}
            >
              {label}
            </div>

            <div>{entity}</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-start flex-1 min-h-0">
        <div
          className="text-xl font-bold break-normal"
          style={{
            width: "360px",
            marginRight: "90px",
          }}
        >
          <div>
            <div
              className={`flex flex-col justify-center items-center w-5/6 ${
                completed ? "" : "animate-pulse"
              } mt-1`}
            >
              <div
                className="text-center"
                style={{
                  marginTop: "-20px",
                  marginBottom: "10px",
                }}
              >
                <span>{readableDuration}</span>
              </div>
              <Progress
                value={percent}
                indicatorColor={`${completed ? "bg-green-400" : "bg-blue-400"}`}
              />
              <span className="w-1/6 text-right mt-3">{percent}%</span>
            </div>
            <div className={`flex flex-col justify-center items-center w-5/6`}>
              <span
                className={`w-5/6 text-right mt-3 ${
                  completed ? "text-green-500" : "text-blue-500"
                }`}
                style={{
                  textAlign: "center",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={url}
              >
                {url}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 self-stretch min-w-0 mt-[-28px] overflow-y-auto visible-scrollbar">
          {Object.keys(tilesets).length > 0 && (
            <div>
              {Object.entries(tilesets).map(([key, value]) => {
                const tilesetPercent = tileSetPercent(value);
                return (
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
                        {expandedSections.includes(`${id} + ${key}`)
                          ? "▼"
                          : "▶"}
                      </button>
                      <div
                        style={{
                          width: "300px",
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
                      <div
                        className={`flex flex-col justify-center items-center w-1/6 ${
                          tilesetPercent === 100 ? "" : "animate-pulse"
                        } mt-1`}
                      >
                        <Progress
                          value={tilesetPercent}
                          indicatorColor={`${
                            tilesetPercent === 100
                              ? "bg-green-400"
                              : "bg-blue-400"
                          }`}
                        />
                      </div>
                    </div>

                    {expandedSections.includes(`${id} + ${key}`) &&
                      value.levels &&
                      Object.keys(value.levels).map((tms) => (
                        <div
                          key={tms}
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
                          <div>{tms}:&nbsp;&nbsp;</div>
                          {value.levels &&
                            value.levels[tms].map((levelProgress, level) =>
                              levelProgress > -1 ? (
                                <span
                                  key={level}
                                  className={`${
                                    levelProgress > 0
                                      ? "animate-pulse"
                                      : "text-green-400"
                                  }`}
                                  style={{ marginRight: "5px" }}
                                >
                                  {level}&nbsp;
                                </span>
                              ) : null,
                            )}
                        </div>
                      ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
