import { IconProps } from "@radix-ui/react-icons/dist/types";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import React from "react";

interface SummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  header: string;
  main: string | React.ReactElement;
  footer: string;
  route?: string;
  Icon?: React.FunctionComponent<IconProps>;
}

export default function CustomersPage({
  header,
  main,
  footer,
  route,
  Icon,
}: SummaryProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{header}</CardTitle>
        {Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : null}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {route ? <Link href={route}>{main}</Link> : main}
        </div>
        <p className="text-xs text-muted-foreground">{footer}</p>
      </CardContent>
    </Card>
  );
}
