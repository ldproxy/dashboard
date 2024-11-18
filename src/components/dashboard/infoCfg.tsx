import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import Link from "next/link";

interface SummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  title?: string;
  className?: string;
}

export default function InfoCfg({ title, name, className }: SummaryProps) {
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  const params = new URLSearchParams(url.search);

  const hasIdParam = params.has("id");

  if (!hasIdParam) {
    params.append("id", name);
  } else {
    params.append("cfg", name);
  }

  // Entfernen Sie doppelte Parameter
  const uniqueParams = new URLSearchParams();
  params.forEach((value, key) => {
    if (!uniqueParams.has(key)) {
      uniqueParams.append(key, value);
    }
  });

  let newPathname = url.pathname;
  if (!newPathname.includes("/details")) {
    newPathname += "/details";
  } else {
    newPathname += "/cfg";
  }

  const route = `${url.origin}${newPathname}?${uniqueParams.toString()}`;

  return (
    <Link href={route}>
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
    </Link>
  );
}
