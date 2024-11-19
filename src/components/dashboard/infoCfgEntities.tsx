import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import Link from "next/link";
import { getIcon } from "@/lib/icons";
import { IconProps } from "@radix-ui/react-icons/dist/types";
import { deleteConfig, getCfgs } from "../../lib/utils";

interface SummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  title?: string;
  className?: string;
  setConfigurations: any;
}

export default function InfoCfg({
  title,
  name,
  setConfigurations,
  className,
}: SummaryProps) {
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
  const Icon: React.FunctionComponent<IconProps> =
    getIcon("Trash") || (() => <span />);

  const deleteCfg = async () => {
    try {
      await deleteConfig(title || "", name);
      const cfgData = await getCfgs();
      setConfigurations(cfgData);
      return { success: true };
    } catch (error) {
      console.error("Fehler beim Löschen der Konfiguration", error);
      return { success: false };
    }
  };
  return (
    <div className={`relative shadow-lg ${className}`}>
      <Link href={route}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-blue-700">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
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
      <Icon
        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 text-red-500 cursor-pointer mr-20"
        onClick={deleteCfg}
      />
    </div>
  );
}
