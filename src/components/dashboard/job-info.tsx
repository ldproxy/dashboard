import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
// import { Progress } from "@/components/shadcn-ui/progress";
import React from "react";
import { Progress } from "@/components/dashboard/Progress";

interface SummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  entity: string;
  tilesets: { [key: string]: any }[];
  label: string;
  percent: number;
  startedAt: number;
  updatedAt: number;
}

export default function CustomersPage({
  entity,
  tilesets,
  label,
  percent,
  startedAt,
  updatedAt,
}: SummaryProps) {
  return (
    <Card className="shadow-lg" style={{ height: "275px", overflowY: "auto" }}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold break-normal mb-5">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <span className="text-blue-600">{label}</span>
            <span style={{ marginRight: "275px" }}>Tilesets</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between items-start mb-9.5">
        <div
          className="text-2xl font-bold break-normal"
          style={{
            width: "30%",
            marginTop: "15px",
          }}
        >
          <span>{entity}</span>
          <div>
            <div
              className={`flex flex-col justify-center items-center w-5/6 ${
                percent === 100 ? "" : "animate-pulse"
              } mt-9`}
            >
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

        <div className="flex flex-col w-[360px]">
          {Object.keys(tilesets).length > 0 && (
            <div
              style={{
                marginRight: "225px",
                marginTop: "-18px",
                height: "50px",
              }}
            >
              {Object.entries(tilesets).map(([key, value]) => (
                <div
                  key={key}
                  style={{
                    color: "dimgray",
                    fontSize: "14px",
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  {key}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
