import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomObject, Profile } from "@/types";
import { useNavigate } from "react-router-dom";

type ObjectPermission = {
  profileId: string;
  objectId: string;
  read: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  viewAll: boolean;
  modifyAll: boolean;
};

// Mock profiles
const mockProfiles = [
  {
    id: "1",
    name: "System Administrator",
    description: "Full system access"
  },
  {
    id: "2",
    name: "Standard User",
    description: "Standard access for most users"
  },
  {
    id: "3",
    name: "Marketing User",
    description: "For marketing team members"
  },
  {
    id: "4",
    name: "Project Manager",
    description: "For project management staff"
  },
];

// Mock permissions
const mockPermissions: Record<string, ObjectPermission[]> = {
  "4": [ // Project__c object
    {
      profileId: "1", // System Admin
      objectId: "4",
      read: true,
      create: true,
      edit: true,
      delete: true,
      viewAll: true,
      modifyAll: true,
    },
    {
      profileId: "2", // Standard User
      objectId: "4",
      read: true,
      create: true,
      edit: true,
      delete: false,
      viewAll: false,
      modifyAll: false,
    },
    {
      profileId: "3", // Marketing User
      objectId: "4",
      read: true,
      create: false,
      edit: false,
      delete: false,
      viewAll: false,
      modifyAll: false,
    },
    {
      profileId: "4", // Project Manager
      objectId: "4",
      read: true,
      create: true,
      edit: true,
      delete: true,
      viewAll: true,
      modifyAll: false,
    },
  ]
};

const findObject = (objectId: string): CustomObject | undefined => {
  // In a real app, fetch this from your backend
  return {
    id: "4",
    name: "Project_c",
    label: "Project",
    apiName: "Project__c",
    pluralLabel: "Projects",
    description: "Custom project tracking object for internal use",
    isCustom: true,
    isActive: true,
    fields: [],
    createdAt: new Date("2023-05-15"),
    updatedAt: new Date("2023-06-20")
  };
};

export function ObjectPermissions({ objectId }: { objectId: string }) {
  const navigate = useNavigate();
  const object = findObject(objectId);
  const permissions = mockPermissions[objectId] || [];
  const [localPermissions, setLocalPermissions] = useState<ObjectPermission[]>(permissions);

  if (!object) {
    return (
      <div className="p-8 text-center">
        <h2 className="font-semibold text-lg">Object Not Found</h2>
        <p className="text-muted-foreground mt-2">The requested object could not be found.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/objects")}
        >
          Back to Objects
        </Button>
      </div>
    );
  }

  const handlePermissionChange = (profileId: string, field: keyof ObjectPermission, value: boolean) => {
    const updatedPermissions = localPermissions.map(permission => {
      if (permission.profileId === profileId) {
        return { ...permission, [field]: value };
      }
      return permission;
    });
    setLocalPermissions(updatedPermissions);
  };

  const saveChanges = () => {
    // In a real app, you'd save these changes to your backend
    console.log("Saving permissions:", localPermissions);
    navigate(`/objects/view/${objectId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Object Permissions: {object.label}</h1>
        <p className="text-muted-foreground">
          Manage which profiles can access and modify records in this object
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Object Access by Profile</CardTitle>
          <CardDescription>
            Configure object-level permissions for each profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Profile</TableHead>
                <TableHead className="text-center">Read</TableHead>
                <TableHead className="text-center">Create</TableHead>
                <TableHead className="text-center">Edit</TableHead>
                <TableHead className="text-center">Delete</TableHead>
                <TableHead className="text-center">View All</TableHead>
                <TableHead className="text-center">Modify All</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localPermissions.map((permission) => {
                const profile = mockProfiles.find(p => p.id === permission.profileId);

                return (
                  <TableRow key={permission.profileId}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{profile?.name}</div>
                        <div className="text-xs text-muted-foreground">{profile?.description}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={permission.read}
                        onCheckedChange={(checked) =>
                          handlePermissionChange(permission.profileId, 'read', checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={permission.create}
                        onCheckedChange={(checked) =>
                          handlePermissionChange(permission.profileId, 'create', checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={permission.edit}
                        onCheckedChange={(checked) =>
                          handlePermissionChange(permission.profileId, 'edit', checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={permission.delete}
                        onCheckedChange={(checked) =>
                          handlePermissionChange(permission.profileId, 'delete', checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={permission.viewAll}
                        onCheckedChange={(checked) =>
                          handlePermissionChange(permission.profileId, 'viewAll', checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={permission.modifyAll}
                        onCheckedChange={(checked) =>
                          handlePermissionChange(permission.profileId, 'modifyAll', checked as boolean)
                        }
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => navigate(`/objects/view/${objectId}`)}>
          Cancel
        </Button>
        <Button onClick={saveChanges}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
