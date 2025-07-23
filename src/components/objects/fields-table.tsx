import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { ObjectField } from "@/types";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface FieldsTableProps {
  fields: ObjectField[];
}

export function FieldsTable({ fields }: FieldsTableProps) {
  const navigate = useNavigate();
  const columns: ColumnDef<ObjectField>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={
            row.getIsSelected()
              ? true
              : row.getIsSomeSelected()
                ? "indeterminate"
                : false
          }
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
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
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="font-medium">{row.getValue("label")}</div>
          <div className="text-xs text-gray-500">{row.original.apiName}</div>
        </div>
      ),
    },
    {
      accessorKey: "dataType",
      header: "Data Type",
    },
    {
      accessorKey: "isRequired",
      header: "Required",
      cell: ({ row }) => {
        return row.original.isRequired ? (
          <Badge variant="default">Required</Badge>
        ) : (
          <span className="text-muted-foreground">Optional</span>
        );
      },
    },
    {
      accessorKey: "isCustom",
      header: "Type",
      cell: ({ row }) => {
        const isCustom = row.original.isCustom;
        return (
          <Badge variant={isCustom ? "outline" : "secondary"}>
            {isCustom ? "Custom" : "Standard"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Last Modified",
      cell: ({ row }) => {
        return new Date(row.original.updatedAt).toLocaleDateString();
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const field = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigate(`/objects/fields/edit/${field.id}`)}>Edit Field</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/security/field-level-security?fieldId=${field.id}`)}>View Field Security</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { }} className="text-red-600">
                Delete Field
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={fields}
      filterableColumns={[
        {
          id: "isCustom",
          title: "Type",
          options: [
            { label: "Standard", value: "false" },
            { label: "Custom", value: "true" },
          ],
        },
        {
          id: "isRequired",
          title: "Required",
          options: [
            { label: "Required", value: "true" },
            { label: "Optional", value: "false" },
          ],
        },
        {
          id: "dataType",
          title: "Data Type",
          options: [
            { label: "Text", value: "Text" },
            { label: "Number", value: "Number" },
            { label: "Date", value: "Date" },
            { label: "Picklist", value: "Picklist" },
            { label: "Checkbox", value: "Checkbox" },
            { label: "Long Text Area", value: "Long Text Area" },
          ],
        },
      ]}
      searchableColumns={[
        {
          id: "label",
          title: "label",
        },
      ]}
    />
  );
}
