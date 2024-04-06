"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import { Badge } from "@/components/shadcn-ui/badge";

export type HealthCheck = {
  label: string;
  status: string;
  checked: string;
  subRows: HealthCheck[];
};

export const columns: ColumnDef<HealthCheck>[] = [
  {
    accessorKey: "label",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row, getValue }) => (
      <div className={`${row.getCanExpand() ? "" : "ml-4"}`}>
        {getValue<string>()}{" "}
        {row.getCanExpand() ? (
          <button
            {...{
              onClick: row.getToggleExpandedHandler(),
              style: { cursor: "pointer" },
            }}
          >
            {row.getIsExpanded() ? "👇" : "👉"}
          </button>
        ) : (
          ""
        )}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }: { row: Row<HealthCheck> }) => {
      if (row.original) {
        const badgeColor =
          row.original.status === "HEALTHY" ? "default" : "destructive";
        return <Badge variant={badgeColor}>{row.original.status}</Badge>;
      }
      return null;
    },
  },
  {
    accessorKey: "checked",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last checked
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
];
