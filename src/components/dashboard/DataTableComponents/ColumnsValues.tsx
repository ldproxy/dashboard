"use client";

import { CellContext, ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import Link from "next/link";

export type Values = {
  label: string;
  type: string;
};

export const columns: ColumnDef<Values>[] = [
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
    cell: ({ row }: { row: Row<Values> }) => {
      return <div className="ml-4">{row.original.label}</div>;
    },
    /*cell: ({ row }: { row: Row<Values> }) => {
      const typeWithoutHyphens = row.original.type.replace(/-/g, "");
      return (
        <div style={{ marginLeft: "10px", fontWeight: "bold" }}>
          <Link
            href={`values/details?id=${typeWithoutHyphens}_${row.original.label}`}
          >
            {row.original.label}
          </Link>{" "}
        </div>
      );
    },*/
  },
];
