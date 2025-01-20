"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import { Badge } from "@/components/shadcn-ui/badge";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn-ui/tooltip";

export type HealthCheck = {
  name: string;
  label?: string;
  description?: string;
  state: string;
  checked: string;
  message: string;
  subRows: HealthCheck[];
  url: string;
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
    cell: ({ row }) => (
      <div className={`${row.depth === 0 ? "ml-4 flex items-center" : "ml-8"}`}>
        {row.depth === 0
          ? row.original.label || row.original.name || row.original.url
          : row.original.url}{" "}
        {row.depth === 0 && row.original.description && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <QuestionMarkCircledIcon className="ml-2 h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>{row.original.description}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
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
        let badgeColor = "";
        let textColor = "white";

        switch (row.original.state) {
          case "HEALTHY":
          case "AVAILABLE":
            badgeColor = "#4CAF50";
            break;
          case "LIMITED":
            badgeColor = "#FFDD44";
            break;
          default:
            badgeColor = "#F44336";
            break;
        }

        return (
          <Badge
            className="ml-4"
            style={{
              backgroundColor: badgeColor,
              color: textColor,
              cursor: "default",
            }}
          >
            {row.original.state}
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
