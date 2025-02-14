"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/shadcn-ui/button";

import React, { useEffect, useState } from "react";
import { NavButton } from "./Navbutton";
import { getIcon } from "@/lib/icons";
import { usePathname, useSearchParams } from "next/navigation";
import { getDeployments, getDeploymentId, Deployment } from "@/lib/deployments";
import { IS_MODE_MULTI } from "@/lib/env";
import { Badge } from "../shadcn-ui/badge";

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  sections: SectionProps[];
}

export interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  entries: EntryProps[];
  global: EntryProps[];
}

interface EntryProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  selected?: boolean;
  route?: string;
  icon?: string;
  ignore?: boolean;
}

export function Section({ title, entries, global }: SectionProps) {
  const [deploymentName, setDeploymentName] = useState<string>();

  if (IS_MODE_MULTI) {
    const searchParams = useSearchParams();
    const deploymentId = searchParams.get("did");

    useEffect(() => {
      if (!deploymentId) {
        setDeploymentName(undefined);
      } else {
        getDeployments().then((deployments: Deployment[]) => {
          const currentDeployment = deployments.find(
            (deployment) => deployment.id === deploymentId
          );
          if (currentDeployment) {
            setDeploymentName(currentDeployment.name);
          }
        });
      }
    }, [deploymentId]);
  }

  const globals = (
    <div className="space-y-1">
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
  );

  return (
    <div className="px-4 py-2">
      {globals}
      <div className="mt-8 mb-2 px-4">
        {deploymentName && (
          <Badge variant="outline">
            <span className="text-slate-500">{deploymentName}</span>
          </Badge>
        )}
      </div>
      <div className="space-y-1">
        {entries
          .filter((e) => !e.ignore)
          .map(({ title, selected, route, icon }) =>
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
