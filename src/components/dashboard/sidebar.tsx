import { cn } from "@/lib/utils";
import { Button } from "@/components/shadcn-ui/button";

import React from "react";
import { NavButton } from "./nav-button";
import { getIcon } from "@/lib/icons";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  sections: SectionProps[];
}

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  entries: EntryProps[];
}

interface EntryProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  selected?: boolean;
  route?: string;
  icon?: string;
}

export function Section({ title, entries }: SectionProps) {
  return (
    <div className="px-3 py-2">
      <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
        {title}
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
    </div>
  );
}

export function Sidebar({ className, sections }: SidebarProps) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        {sections.map(({ title, entries }) => (
          <Section key={title} title={title} entries={entries} />
        ))}
      </div>
    </div>
  );
}
