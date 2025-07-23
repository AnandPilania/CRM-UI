import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ObjectPermission, CustomObject } from "@/types";
import { DataTable } from "@/components/ui/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

// Mock data
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

const mockPermissions: ObjectPermission[] = [
  {
    id: "1",
    objectId: "1",
    profileId: "1",
    create: true,
    read: true,
    edit: true,
    delete: true,
    viewAll: true,
    modifyAll: true,
  },
  {
    id: "2",
    objectId: "2",
    profileId: "1",
    create: true,
    read: true,
    edit: true,
    delete: true,
    viewAll: true,
    modifyAll: true,
  },
  {
    id: "3",
    objectId: "3",
    profileId: "1",
    create: true,
    read: true,
    edit: true,
    delete: true,
    viewAll: false,
    modifyAll: false,
  },
  {
    id: "4",
    objectId: "4",
    profileId: "1",
    create: true,
    read: true,
    edit: true,
    delete: false,
    viewAll: false,
    modifyAll: false,
  },
];

interface ObjectPermissionsTableProps {
  searchTerm?: string;
  profileId?: string;
  objectId?: string;
}

export function ObjectPermissionsTable({
  searchTerm = "",
  profileId,
  objectId
}: ObjectPermissionsTableProps) {
  const [permissions, setPermissions] = useState<ObjectPermission[]>(mockPermissions);

  // Filter by search term, profile, and/or object
  const filteredData = permissions.filter(perm => {
    const matchesProfile = !profileId || perm.profileId === profileId;
    const matchesObject = !objectId || perm.objectId === objectId;

    if (!matchesProfile || !matchesObject) return false;

    if (!searchTerm) return true;

    const object = mockObjects.find(obj => obj.id === perm.objectId);
    if (!object) return false;

    return (
      object.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      object.apiName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Map permissions to display data with object info
  const tableData = filteredData.map(perm => {
    const object = mockObjects.find(obj => obj.id === perm.objectId);
    return {
      ...perm,
      objectLabel: object?.label || "",
      objectApiName: object?.apiName || "",
      isCustom: object?.isCustom || false,
    };
  });

  // Toggle a single permission
  const togglePermission = (
    permissionId: string,
    field: keyof Pick<ObjectPermission, "create" | "read" | "edit" | "delete" | "viewAll" | "modifyAll">
  ) => {
    setPermissions(prev =>
      prev.map(p =>
        p.id === permissionId ? { ...p, [field]: !p[field] } : p
      )
    );
  };

  const columns: ColumnDef<typeof tableData[0]>[] = [
    {
      accessorKey: "objectLabel",
      header: "Object",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="font-medium">{row.getValue("objectLabel")}</div>
          <div className="text-xs text-gray-500">{row.original.objectApiName}</div>
          {row.original.isCustom && (
            <Badge className="mt-1 w-fit" variant="outline">Custom</Badge>
          )}
        </div>
      ),
    },
    {
      id: "read",
      header: "Read",
      cell: ({ row }) => {
        const permission = row.original;
        return (
          <Checkbox
            checked={permission.read}
            onCheckedChange={() => togglePermission(permission.id, "read")}
            aria-label="Read permission"
          />
        );
      },
    },
    {
      id: "create",
      header: "Create",
      cell: ({ row }) => {
        const permission = row.original;
        return (
          <Checkbox
            checked={permission.create}
            onCheckedChange={() => togglePermission(permission.id, "create")}
            aria-label="Create permission"
          />
        );
      },
    },
    {
      id: "edit",
      header: "Edit",
      cell: ({ row }) => {
        const permission = row.original;
        return (
          <Checkbox
            checked={permission.edit}
            onCheckedChange={() => togglePermission(permission.id, "edit")}
            aria-label="Edit permission"
          />
        );
      },
    },
    {
      id: "delete",
      header: "Delete",
      cell: ({ row }) => {
        const permission = row.original;
        return (
          <Checkbox
            checked={permission.delete}
            onCheckedChange={() => togglePermission(permission.id, "delete")}
            aria-label="Delete permission"
          />
        );
      },
    },
    {
      id: "viewAll",
      header: "View All",
      cell: ({ row }) => {
        const permission = row.original;
        return (
          <Checkbox
            checked={permission.viewAll}
            onCheckedChange={() => togglePermission(permission.id, "viewAll")}
            aria-label="View All permission"
          />
        );
      },
    },
    {
      id: "modifyAll",
      header: "Modify All",
      cell: ({ row }) => {
        const permission = row.original;
        return (
          <Checkbox
            checked={permission.modifyAll}
            onCheckedChange={() => togglePermission(permission.id, "modifyAll")}
            aria-label="Modify All permission"
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
          id: "isCustom",
          title: "Object Type",
          options: [
            { label: "Standard", value: "false" },
            { label: "Custom", value: "true" },
          ],
        },
      ]}
    />
  );
}
