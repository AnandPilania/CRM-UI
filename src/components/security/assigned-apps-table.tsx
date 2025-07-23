import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

// Types
interface AppPermission {
  id: string;
  appId: string;
  profileId: string;
  isVisible: boolean;
  isDefault: boolean;
}

interface App {
  id: string;
  name: string;
  description: string;
  isStandard: boolean;
}

// Mock data
const mockApps: App[] = [
  { id: "1", name: "Sales", description: "Sales process management", isStandard: true },
  { id: "2", name: "Service", description: "Customer service and case management", isStandard: true },
  { id: "3", name: "Marketing", description: "Campaign and lead management", isStandard: true },
  { id: "4", name: "Reports & Dashboards", description: "Analytics and reporting", isStandard: true },
  { id: "5", name: "Project Management", description: "Custom project tracking app", isStandard: false },
];

const mockAppPermissions: AppPermission[] = [
  { id: "1", appId: "1", profileId: "1", isVisible: true, isDefault: true },
  { id: "2", appId: "2", profileId: "1", isVisible: true, isDefault: false },
  { id: "3", appId: "3", profileId: "1", isVisible: true, isDefault: false },
  { id: "4", appId: "4", profileId: "1", isVisible: true, isDefault: false },
  { id: "5", appId: "5", profileId: "1", isVisible: false, isDefault: false },
];

interface AssignedAppsTableProps {
  searchTerm?: string;
  profileId?: string;
}

export function AssignedAppsTable({
  searchTerm = "",
  profileId
}: AssignedAppsTableProps) {
  const [permissions, setPermissions] = useState<AppPermission[]>(mockAppPermissions);

  // Filter by search term and profile
  const filteredPermissions = permissions.filter(perm => {
    const app = mockApps.find(a => a.id === perm.appId);
    if (!app) return false;

    const matchesProfile = !profileId || perm.profileId === profileId;
    if (!matchesProfile) return false;

    if (!searchTerm) return true;

    return (
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Map permissions to display data with app info
  const tableData = filteredPermissions.map(perm => {
    const app = mockApps.find(a => a.id === perm.appId);
    if (!app) return null;

    return {
      permissionId: perm.id,
      appId: app.id,
      appName: app.name,
      appDescription: app.description,
      isStandard: app.isStandard,
      isVisible: perm.isVisible,
      isDefault: perm.isDefault,
    };
  }).filter(Boolean) as Array<{
    permissionId: string;
    appId: string;
    appName: string;
    appDescription: string;
    isStandard: boolean;
    isVisible: boolean;
    isDefault: boolean;
  }>;

  // Toggle visibility
  const toggleVisibility = (permissionId: string) => {
    setPermissions(prev =>
      prev.map(p =>
        p.id === permissionId ? { ...p, isVisible: !p.isVisible } : p
      )
    );
  };

  // Set as default app
  const setDefaultApp = (permissionId: string) => {
    setPermissions(prev =>
      prev.map(p =>
        p.id === permissionId
          ? { ...p, isDefault: true }
          : { ...p, isDefault: false }
      )
    );
  };

  const columns: ColumnDef<typeof tableData[0]>[] = [
    {
      accessorKey: "appName",
      header: "Application",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="font-medium">{row.getValue("appName")}</div>
          <div className="text-xs text-muted-foreground">{row.original.appDescription}</div>
          {!row.original.isStandard && (
            <Badge className="mt-1 w-fit" variant="outline">Custom</Badge>
          )}
        </div>
      ),
    },
    {
      id: "isVisible",
      header: "Visible",
      cell: ({ row }) => {
        const { permissionId, isVisible } = row.original;

        return (
          <Checkbox
            checked={isVisible}
            onCheckedChange={() => toggleVisibility(permissionId)}
            aria-label="Visible permission"
          />
        );
      },
    },
    {
      id: "isDefault",
      header: "Default App",
      cell: ({ row }) => {
        const { permissionId, isDefault, isVisible } = row.original;

        return (
          <Checkbox
            checked={isDefault}
            disabled={!isVisible} // Can't be default if not visible
            onCheckedChange={() => {
              if (!isDefault) setDefaultApp(permissionId);
            }}
            aria-label="Default app"
          />
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={tableData}
      filterableColumns={[
        {
          id: "isStandard",
          title: "App Type",
          options: [
            { label: "Standard", value: "true" },
            { label: "Custom", value: "false" },
          ],
        },
        {
          id: "isVisible",
          title: "Visibility",
          options: [
            { label: "Visible", value: "true" },
            { label: "Hidden", value: "false" },
          ],
        },
      ]}
      searchableColumns={[
        {
          id: "appName",
          title: "app name",
        },
      ]}
    />
  );
}
