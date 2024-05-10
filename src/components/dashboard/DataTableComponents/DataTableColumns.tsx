"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import { Badge } from "@/components/shadcn-ui/badge";
import { ChevronRightIcon, ChevronDownIcon } from "@radix-ui/react-icons";

export type HealthCheck = {
  label: string;
  status: string;
  checked: string;
  message: string;
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
      <div className={`${row.depth === 0 ? "ml-4 flex items-center" : "ml-8"}`}>
        {getValue<string>()}{" "}
        {row.getCanExpand() ? (
          <button
            {...{
              onClick: row.getToggleExpandedHandler(),
              className: "ml-2",
              style: { cursor: "pointer" },
            }}
          >
            {row.getIsExpanded() ? <ChevronDownIcon /> : <ChevronRightIcon />}
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
          row.original.status === "HEALTHY" ||
          row.original.status === "AVAILABLE"
            ? "success"
            : row.original.status === "LIMITED"
            ? "warning"
            : "destructive";
        return (
          <Badge className="ml-4" variant={badgeColor}>
            {row.original.status}
          </Badge>
        );
      }
      return null;
    },
  },
  {
    accessorKey: "message",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-start">
          <Button variant="ghost">Message</Button>
        </div>
      );
    },
    cell: ({ row, getValue }) => (
      <div className="ml-4 flex items-center justify-start">
        {getValue<string>()}
      </div>
    ),
  },
  {
    accessorKey: "checked",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-start">
          <Button variant="ghost">Last checked</Button>
        </div>
      );
    },
    cell: ({ row, getValue }) => (
      <div className="ml-4 flex items-center justify-start">
        {getValue<string>()}
      </div>
    ),
  },
];
