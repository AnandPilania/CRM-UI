import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Plus } from "lucide-react";
import { CustomObject } from "@/types";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ObjectCreateDialog } from "./object-create-dialog";

const mockObjects: CustomObject[] = [
  {
    id: "1",
    name: "Account",
    label: "Account",
    apiName: "Account",
    pluralLabel: "Accounts",
    description: "Organization or person involved with your business",
    isCustom: false,
    isActive: true,
    fields: [],
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "2",
    name: "Contact",
    label: "Contact",
    apiName: "Contact",
    pluralLabel: "Contacts",
    description: "Individual people associated with accounts",
    isCustom: false,
    isActive: true,
    fields: [],
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "3",
    name: "Opportunity",
    label: "Opportunity",
    apiName: "Opportunity",
    pluralLabel: "Opportunities",
    description: "Potential sales or pending deals",
    isCustom: false,
    isActive: true,
    fields: [],
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "4",
    name: "Project_c",
    label: "Project",
    apiName: "Project__c",
    pluralLabel: "Projects",
    description: "Custom project tracking object",
    isCustom: true,
    isActive: true,
    fields: [],
    createdAt: new Date("2023-05-15"),
    updatedAt: new Date("2023-06-20"),
  },
];

export function ObjectsTable({ filter = "all" }: { filter?: "all" | "standard" | "custom" }) {
  const navigate = useNavigate();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filteredObjects = filter === "all"
    ? mockObjects
    : mockObjects.filter(obj =>
      filter === "standard" ? !obj.isCustom : obj.isCustom
    );

  const columns: ColumnDef<CustomObject>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
                ? "indeterminate"
                : false
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
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
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <div className="max-w-xs truncate">{row.getValue("description")}</div>,
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
        const object = row.original;
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
              <DropdownMenuItem
                onClick={() => navigate(`/objects/view/${object.id}`)}
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate(`/objects/view/${object.id}`)}
              >
                Manage Fields
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate(`/security/object-permissions/${object.id}`)}
              >
                Manage Permissions
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate(`/layouts/edit/${object.id}`)}
              >
                Edit Layout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">
          {filter === "all" && "All Objects"}
          {filter === "standard" && "Standard Objects"}
          {filter === "custom" && "Custom Objects"}
        </h2>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Object
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filteredObjects}
        filterableColumns={[
          {
            id: "isCustom",
            title: "Type",
            options: [
              { label: "Standard", value: "false" },
              { label: "Custom", value: "true" },
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

      <ObjectCreateDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      />
    </div>
  );
}
