"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/shadcn-ui/button";

import React, { useEffect, useState } from "react";
import { NavButton } from "./Navbutton";
import { getIcon } from "@/lib/icons";
import { usePathname } from "next/navigation";
import { getDeployments, getDeploymentId } from "@/lib/deployments";
import { IS_MODE_MULTI } from "@/lib/env";

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  sections: SectionProps[];
}

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  entries: EntryProps[];
  global: EntryProps[];
}

interface EntryProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  selected?: boolean;
  route?: string;
  icon?: string;
}

export function Section({ title, entries, global }: SectionProps) {
  const [deployments, setDeployments] = useState([
    { name: "", url: "", id: "" },
  ]);
  const [deploymentName, setDeploymentName] = useState("");
  const pathname = usePathname();
  const [isHomePage, setIsHomePage] = useState(true);
  const [isCfgPage, setIsCfgPage] = useState(true);
  const [deploymentId, setDeploymentId] = useState("");

  const removeQueryFromUrl = (url: string) => {
    const urlObj = new URL(url, window.location.origin);
    urlObj.search = ""; // Entfernt alle Query-Parameter
    return urlObj.toString();
  };

  const hasDidQueryParam = new URLSearchParams(window.location.search).has(
    "did"
  );

  useEffect(() => {
    if (IS_MODE_MULTI) {
      getDeploymentId(setDeploymentId);
      getDeployments().then((data: any) => setDeployments(data));
    }
  }, [pathname]);

  useEffect(() => {
    if (deployments.length > 0) {
      const currentDeployment = deployments.find(
        (deployment) => deployment.id === deploymentId
      );
      if (currentDeployment) {
        setDeploymentName(currentDeployment.name);
      }
    }
    // leaving out currentUrl from dependencies since it is not needed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deployments, pathname]),
    useEffect(() => {
      setIsHomePage(pathname === "/home");
      setIsCfgPage(
        pathname === "/configurations" ||
          pathname === "/configurations/details" ||
          pathname === "/configurations/details/cfg"
      );
    }, [pathname]);

  if (isHomePage && IS_MODE_MULTI) {
    return (
      <div
        style={{
          marginLeft: "30px",
          marginTop: "10px",
          fontSize: "0.875rem",
          color: "#4a4a4a",
        }}
      >
        No Deployment Selected
      </div>
    );
  }

  if (
    (isHomePage && IS_MODE_MULTI) ||
    (isCfgPage && !hasDidQueryParam && IS_MODE_MULTI)
  ) {
    return (
      <div className="px-3 py-2">
        <div className="space-y-1">
          {global.map(({ title, selected, route, icon }) =>
            route ? (
              <NavButton
                key={title}
                title={title}
                route={removeQueryFromUrl(route)}
                icon={icon}
              />
            ) : (
              <Button
                key={title}
                variant={selected ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                {(() => {
                  const Icon = icon ? getIcon(icon) : null;
                  return Icon ? <Icon className="mr-2 h-4 w-4" /> : null;
                })()}
                {title}
              </Button>
            )
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 py-2">
      <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
        {deploymentName}
      </h2>
      <div className="space-y-1">
        {entries.map(({ title, selected, route, icon }) =>
          route ? (
            <NavButton key={title} title={title} route={route} icon={icon} />
          ) : (
            <Button
              key={title}
              variant={selected ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              {(() => {
                const Icon = icon ? getIcon(icon) : null;
                return Icon ? <Icon className="mr-2 h-4 w-4" /> : null;
              })()}
              {title}
            </Button>
          )
        )}
      </div>
      <div className="space-y-1 mt-24">
        {global.map(({ title, selected, route, icon }) =>
          route ? (
            <NavButton key={title} title={title} route={route} icon={icon} />
          ) : (
            <Button
              key={title}
              variant={selected ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              {(() => {
                const Icon = icon ? getIcon(icon) : null;
                return Icon ? <Icon className="mr-2 h-4 w-4" /> : null;
              })()}
              {title}
            </Button>
          )
        )}
      </div>
    </div>
  );
}

export function Sidebar({ className, sections }: SidebarProps) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        {sections.map(({ title, entries, global }) => (
          <Section
            key={title}
            title={title}
            entries={entries}
            global={global}
          />
        ))}
      </div>
    </div>
  );
}
