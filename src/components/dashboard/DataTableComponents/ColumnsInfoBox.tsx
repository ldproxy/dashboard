"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Button } from "@/components/shadcn-ui/button";

export type CombinedData = {
  version: string;
  apiUrl: string;
  uptime: string;
  memory: string;
};

import {
  GlobeIcon,
  ClockIcon,
  DesktopIcon,
  UploadIcon,
} from "@radix-ui/react-icons";

export const columns: ColumnDef<CombinedData>[] = [
  {
    accessorKey: "label",
    header: ({ column }) => {
      return (
        <Button variant="ghost">
          <GlobeIcon className="h-4 w-4 inline mr-2" />
          Instance
        </Button>
      );
    },
    cell: ({ row }: { row: Row<CombinedData> }) => {
      if (row.original) {
        return <span className="ml-4">{row.original.apiUrl}</span>;
      }
      return null;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <DesktopIcon className="h-4 w-4 inline mr-2" />
          Version
        </Button>
      );
    },
    cell: ({ row }: { row: Row<CombinedData> }) => {
      if (row.original) {
        return <span className="ml-4">{row.original.version}</span>;
      }
      return null;
    },
  },
  {
    accessorKey: "message",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ClockIcon className="h-4 w-4 inline mr-2" />
          Uptime
        </Button>
      );
    },
    cell: ({ row }: { row: Row<CombinedData> }) => {
      if (row.original) {
        return <span className="ml-4">{row.original.uptime}</span>;
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
          <UploadIcon className="h-4 w-4 inline mr-2" />
          Memory
        </Button>
      );
    },
    cell: ({ row }: { row: Row<CombinedData> }) => {
      if (row.original) {
        return <span className="ml-4">{row.original.memory}</span>;
      }
      return null;
    },
  },
];
