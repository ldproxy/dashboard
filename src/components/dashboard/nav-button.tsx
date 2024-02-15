"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/shadcn-ui/button";
import { getIcon } from "@/lib/icons";

interface EntryProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  route: string;
  icon?: string;
}

export function NavButton({ title, route, icon }: EntryProps) {
  const pathname = usePathname();
  const Icon = icon ? getIcon(icon) : null;

  return (
    <Button
      key={title}
      variant={pathname.startsWith(route) ? "secondary" : "ghost"}
      className="w-full justify-start"
      asChild
    >
      <Link href={route}>
        {Icon ? <Icon className="mr-2 h-4 w-4" /> : null}
        {title}
      </Link>
    </Button>
  );
}
