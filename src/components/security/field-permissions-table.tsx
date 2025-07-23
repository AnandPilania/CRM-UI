import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { FieldPermission, ObjectField, CustomObject } from "@/types";
import { DataTable } from "@/components/ui/data-table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock objects
const mockObjects: CustomObject[] = [
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

// Mock fields
const mockFields: ObjectField[] = [
  {
    id: "1",
    objectId: "4",
    name: "Name",
    label: "Project Name",
    apiName: "Name",
    dataType: "Text",
    isRequired: true,
    isUnique: true,
    helpText: "Enter the name of the project",
    isCustom: false,
    isActive: true,
    createdAt: new Date("2023-05-15"),
    updatedAt: new Date("2023-05-15")
  },
  {
    id: "2",
    objectId: "4",
    name: "Status_c",
    label: "Status",
    apiName: "Status__c",
    dataType: "Picklist",
    isRequired: true,
    isUnique: false,
    defaultValue: "New",
    helpText: "Current status of the project",
    isCustom: true,
    isActive: true,
    createdAt: new Date("2023-05-15"),
    updatedAt: new Date("2023-06-10")
  },
  {
    id: "3",
    objectId: "4",
    name: "Due_Date_c",
    label: "Due Date",
    apiName: "Due_Date__c",
    dataType: "Date",
    isRequired: false,
    isUnique: false,
    helpText: "When the project is due",
    isCustom: true,
    isActive: true,
    createdAt: new Date("2023-05-15"),
    updatedAt: new Date("2023-05-15")
  },
  {
    id: "4",
    objectId: "4",
    name: "Priority_c",
    label: "Priority",
    apiName: "Priority__c",
    dataType: "Picklist",
    isRequired: false,
    isUnique: false,
    defaultValue: "Medium",
    helpText: "Priority level of the project",
    isCustom: true,
    isActive: true,
    createdAt: new Date("2023-05-15"),
    updatedAt: new Date("2023-05-15")
  },
  {
    id: "5",
    objectId: "4",
    name: "Description_c",
    label: "Description",
    apiName: "Description__c",
    dataType: "Long Text Area",
    isRequired: false,
    isUnique: false,
    helpText: "Detailed description of the project",
    isCustom: true,
    isActive: true,
    createdAt: new Date("2023-05-15"),
    updatedAt: new Date("2023-05-15")
  }
];

// Mock field permissions
const mockFieldPermissions: FieldPermission[] = [
  { id: "1", fieldId: "1", profileId: "1", permissionType: "edit" },
  { id: "2", fieldId: "2", profileId: "1", permissionType: "edit" },
  { id: "3", fieldId: "3", profileId: "1", permissionType: "edit" },
  { id: "4", fieldId: "4", profileId: "1", permissionType: "read" },
  { id: "5", fieldId: "5", profileId: "1", permissionType: "none" },
];

interface FieldPermissionsTableProps {
  searchTerm?: string;
  profileId?: string;
  objectId?: string;
}

export function FieldPermissionsTable({
  searchTerm = "",
  profileId,
  objectId = "4"
}: FieldPermissionsTableProps) {
  const [selectedObject, setSelectedObject] = useState(objectId);
  const [permissions, setPermissions] = useState<FieldPermission[]>(mockFieldPermissions);

  // Filter fields by selected object
  const objectFields = mockFields.filter(field => field.objectId === selectedObject);

  // Filter by search term and profile
  const filteredPermissions = permissions.filter(perm => {
    const field = mockFields.find(f => f.id === perm.fieldId);
    if (!field || field.objectId !== selectedObject) return false;

    const matchesProfile = !profileId || perm.profileId === profileId;
    if (!matchesProfile) return false;

    if (!searchTerm) return true;

    return (
      field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.apiName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Map permissions to display data with field info
  const tableData = filteredPermissions.map(perm => {
    const field = mockFields.find(f => f.id === perm.fieldId);
    if (!field) return null;

    return {
      permissionId: perm.id,
      fieldId: field.id,
      fieldLabel: field.label,
      fieldApiName: field.apiName,
      dataType: field.dataType,
      isCustom: field.isCustom,
      permissionType: perm.permissionType,
    };
  }).filter(Boolean) as Array<{
    permissionId: string;
    fieldId: string;
    fieldLabel: string;
    fieldApiName: string;
    dataType: string;
    isCustom: boolean;
    permissionType: 'read' | 'edit' | 'none';
  }>;

  // Update a field permission
  const updatePermission = (permissionId: string, value: 'read' | 'edit' | 'none') => {
    setPermissions(prev =>
      prev.map(p =>
        p.id === permissionId ? { ...p, permissionType: value } : p
      )
    );
  };

  const columns: ColumnDef<typeof tableData[0]>[] = [
    {
      accessorKey: "fieldLabel",
      header: "Field",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="font-medium">{row.getValue("fieldLabel")}</div>
          <div className="text-xs text-gray-500">{row.original.fieldApiName}</div>
          {row.original.isCustom && (
            <Badge className="mt-1 w-fit" variant="outline">Custom</Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "dataType",
      header: "Data Type",
    },
    {
      id: "permissions",
      header: "Field Access",
      cell: ({ row }) => {
        const { permissionId, permissionType } = row.original;

        return (
          <RadioGroup
            value={permissionType}
            onValueChange={(value) => updatePermission(
              permissionId,
              value as 'read' | 'edit' | 'none'
            )}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="edit" id={`${permissionId}-edit`} />
              <Label htmlFor={`${permissionId}-edit`}>Edit</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="read" id={`${permissionId}-read`} />
              <Label htmlFor={`${permissionId}-read`}>Read Only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id={`${permissionId}-none`} />
              <Label htmlFor={`${permissionId}-none`}>None</Label>
            </div>
          </RadioGroup>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="object-select">Select Object</Label>
        <Select
          value={selectedObject}
          onValueChange={setSelectedObject}
        >
          <SelectTrigger className="w-[280px] mt-1">
            <SelectValue placeholder="Select an object" />
          </SelectTrigger>
          <SelectContent>
            {mockObjects.map(obj => (
              <SelectItem key={obj.id} value={obj.id}>
                {obj.label} ({obj.apiName})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={tableData}
        filterableColumns={[
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
          {
            id: "permissionType",
            title: "Access Level",
            options: [
              { label: "Edit", value: "edit" },
              { label: "Read Only", value: "read" },
              { label: "None", value: "none" },
            ],
          },
          {
            id: "isCustom",
            title: "Field Type",
            options: [
              { label: "Standard", value: "false" },
              { label: "Custom", value: "true" },
            ],
          },
        ]}
        searchableColumns={[
          {
            id: "fieldLabel",
            title: "field name",
          },
        ]}
      />
    </div>
  );
}
