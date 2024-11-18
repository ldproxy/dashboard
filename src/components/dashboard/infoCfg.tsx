import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import React from "react";

interface SummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  className?: string;
}

export default function InfoCfg({ title, name, className }: SummaryProps) {
  return (
    <Card className={`shadow-lg ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <div
          className="text-2xl font-bold break-normal"
          style={{
            marginBottom: "3px",
            width: "100%",
          }}
        >
          {name}
        </div>
      </CardContent>
    </Card>
  );
}
