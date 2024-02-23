"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import { Badge } from "@/components/shadcn-ui/badge";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment =
  | {
      label: string;
      status: string;
      checked: string;
    }
  | unknown;

type PaymentRow = any;

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "label",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Label
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
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
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }: { row: PaymentRow }) => {
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
          Checked
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
];
