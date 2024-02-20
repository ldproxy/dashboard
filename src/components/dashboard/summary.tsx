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
    <Link href={route || "#"}>
      <Card className="shadow-lg hover:bg-gray-100 transition-colors duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle
            className={`text-sm font-semibold ${
              header === "ACTIVE"
                ? "text-blue-700 hover:text-blue-500"
                : "text-red-700 hover:text-red-500"
            }`}
          >
            {header}
          </CardTitle>
          {Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : null}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold ">{main}</div>
          <p className="text-xs text-muted-foreground">{footer}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
