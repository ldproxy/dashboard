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
  info: string;
}

export default function CustomersPage({
  entity,
  tilesets,
  label,
  percent,
  startedAt,
  updatedAt,
  id,
  info,
}: SummaryProps) {
  const durationInMs = (updatedAt - startedAt) * 1000;
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
      className="shadow-lg"
      style={{ height: "250px", overflow: "auto", boxSizing: "border-box" }}
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
                percent === 100 ? "text-green-500" : "text-blue-500"
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
      <CardContent className="flex items-start">
        <div
          className="text-xl font-bold break-normal"
          style={{
            width: "360px",
            marginRight: "90px",
          }}
        >
          {/*<div
            title={entity}
            className="w-5/6"
            style={{
              textWrap: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {entity}
          </div>*/}
          {/*TODO <span>&nbsp;{info}</span>*/}
          <div>
            <div
              className={`flex flex-col justify-center items-center w-5/6 ${
                percent === 100 ? "" : "animate-pulse"
              } mt-1`}
            >
              <div
                className="text-center"
                style={{
                  marginTop: "0px",
                  marginBottom: "10px",
                }}
              >
                <span>{readableDuration}</span>
              </div>
              <Progress
                value={percent}
                indicatorColor={`${
                  percent === 100 ? "bg-green-400" : "bg-blue-400"
                }`}
              />
              <span className="w-1/6 text-right mt-3">{percent}%</span>
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
                    {value.progress && value.progress.percent !== undefined && (
                      <div
                        className={`flex flex-col justify-center items-center w-1/6 ${
                          value.progress.percent === 100 ? "" : "animate-pulse"
                        } mt-1`}
                      >
                        <Progress
                          value={value.progress.percent}
                          indicatorColor={`${
                            value.progress.percent === 100
                              ? "bg-green-400"
                              : "bg-blue-400"
                          }`}
                        />
                      </div>
                    )}
                  </div>

                  {expandedSections.includes(`${id} + ${key}`) &&
                    value.progress &&
                    value.progress.levels &&
                    Object.keys(value.progress.levels).map((tms) => (
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
                        {value.progress &&
                          value.progress.levels &&
                          value.progress.levels[tms].map(
                            (levelProgress, level) =>
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
                              ) : null
                          )}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
