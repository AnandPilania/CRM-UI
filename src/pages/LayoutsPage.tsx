import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout, CustomObject } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { PencilIcon, Plus } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { LayoutEditor } from "@/components/layouts/layout-editor";

// Mock objects
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

// Mock layouts
const mockLayouts: Layout[] = [
  {
    id: "1",
    objectId: "1",
    name: "Account Layout",
    sections: [],
    assignedProfiles: ["1", "2", "3"],
    isActive: true,
  },
  {
    id: "2",
    objectId: "4",
    name: "Project Layout",
    sections: [],
    assignedProfiles: ["1", "4"],
    isActive: true,
  }
];

export default function LayoutsPage() {
  const navigate = useNavigate();
  const { layoutId, objectId, layoutType } = useParams<{
    layoutId: string;
    objectId: string;
    layoutType: string;
  }>();
  const location = useLocation();

  // Check if we're editing or creating a layout
  const isEditLayout = location.pathname.includes('/layouts/edit/');
  const isNewLayout = location.pathname.includes('/layouts/new/');

  // If we're in edit or create mode, show the layout editor
  if (isEditLayout || isNewLayout) {
    return <LayoutEditor layoutId={layoutId} objectId={objectId} />;
  }

  const columns: ColumnDef<Layout & { objectName: string, objectApiName: string, isCustomObject: boolean }>[] = [
    {
      accessorKey: "name",
      header: "Layout Name",
    },
    {
      accessorKey: "objectName",
      header: "Object",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div>{row.getValue("objectName")}</div>
          <div className="text-xs text-muted-foreground">{row.original.objectApiName}</div>
          {row.original.isCustomObject && (
            <Badge className="mt-1 w-fit" variant="outline">Custom</Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "assignedProfiles",
      header: "Assigned Profiles",
      cell: ({ row }) => {
        const count = row.original.assignedProfiles.length;
        return <span>{count} profile{count !== 1 ? 's' : ''}</span>;
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.original.isActive;
        return (
          <Badge variant={isActive ? "default" : "outline"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/layouts/edit/${row.original.id}`)}
          >
            <PencilIcon className="h-4 w-4 mr-2" /> Edit
          </Button>
        );
      },
    },
  ];

  // Combine layout data with object information
  const tableData = mockLayouts.map(layout => {
    const object = mockObjects.find(obj => obj.id === layout.objectId);
    return {
      ...layout,
      objectName: object?.label || "Unknown",
      objectApiName: object?.apiName || "Unknown",
      isCustomObject: object?.isCustom || false,
    };
  });

  // Filter data if we're viewing a specific layout type
  const filteredData = layoutType
    ? tableData.filter(layout => {
        const object = mockObjects.find(obj => obj.id === layout.objectId);
        return layoutType === 'standard'
          ? object && !object.isCustom
          : object && object.isCustom;
      })
    : tableData;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Page Layouts</h1>
        <Button onClick={() => navigate("/layouts/new/4")}>
          <Plus className="mr-2 h-4 w-4" /> New Layout
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Page Layouts</CardTitle>
          <CardDescription>
            Configure how fields appear on record pages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredData}
            filterableColumns={[
              {
                id: "isCustomObject",
                title: "Object Type",
                options: [
                  { label: "Standard", value: "false" },
                  { label: "Custom", value: "true" },
                ],
              },
            ]}
            searchableColumns={[
              {
                id: "name",
                title: "layout name",
              },
              {
                id: "objectName",
                title: "object name",
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
