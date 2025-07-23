import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Profile } from "@/types";
import { PencilIcon, UsersIcon, CopyIcon, SearchIcon } from "lucide-react";
import { ObjectPermissionsTable } from "./object-permissions-table";
import { FieldPermissionsTable } from "./field-permissions-table";
import { AssignedAppsTable } from "./assigned-apps-table";

const mockProfile: Profile = {
  id: "1",
  name: "System Administrator",
  description: "Complete access to the system with all administrative privileges",
  isStandard: true
};

export function ProfileDetail({ profileId = "1" }: { profileId?: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const profile = mockProfile; // In a real app, fetch profile by ID

  // Stub handlers
  const handleEdit = () => alert("Edit profile coming soon!");
  const handleClone = () => alert("Clone profile coming soon!");
  const handleAssignedUsers = () => alert("Assigned users coming soon!");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            {profile.name}
            <Badge className="ml-2" variant={profile.isStandard ? "secondary" : "outline"}>
              {profile.isStandard ? "Standard" : "Custom"}
            </Badge>
          </h1>
          <p className="text-muted-foreground">Profile ID: {profile.id}</p>
        </div>
        <div className="flex space-x-2">
          {!profile.isStandard && (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <PencilIcon className="h-4 w-4 mr-2" /> Edit
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleClone}>
            <CopyIcon className="h-4 w-4 mr-2" /> Clone
          </Button>
          <Button variant="outline" size="sm" onClick={handleAssignedUsers}>
            <UsersIcon className="h-4 w-4 mr-2" /> Assigned Users
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>Information about this profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Name</p>
              <p className="text-sm text-muted-foreground">{profile.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Type</p>
              <p className="text-sm text-muted-foreground">{profile.isStandard ? "Standard" : "Custom"}</p>
            </div>
            <div className="col-span-2 space-y-1">
              <p className="text-sm font-medium">Description</p>
              <p className="text-sm text-muted-foreground">{profile.description || "No description provided."}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex mb-4">
        <div className="relative w-full max-w-sm">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search permissions, objects, fields..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="object-permissions">
        <TabsList className="mb-4">
          <TabsTrigger value="object-permissions">Object Permissions</TabsTrigger>
          <TabsTrigger value="field-permissions">Field Permissions</TabsTrigger>
          <TabsTrigger value="app-permissions">App Permissions</TabsTrigger>
          <TabsTrigger value="system-permissions">System Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="object-permissions">
          <ObjectPermissionsTable searchTerm={searchTerm} profileId={profileId} />
        </TabsContent>

        <TabsContent value="field-permissions">
          <FieldPermissionsTable searchTerm={searchTerm} profileId={profileId} />
        </TabsContent>

        <TabsContent value="app-permissions">
          <AssignedAppsTable searchTerm={searchTerm} profileId={profileId} />
        </TabsContent>

        <TabsContent value="system-permissions">
          <SystemPermissionsTable profileId={profileId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SystemPermissionsTable({ profileId }: { profileId: string }) {
  const [permissions, setPermissions] = useState([
    { name: "API Enabled", enabled: true },
    { name: "Create and Customize Dashboards", enabled: true },
    { name: "Create Dashboard Folders", enabled: true },
    { name: "Create and Customize Reports", enabled: true },
    { name: "Create Report Folders", enabled: true },
    { name: "Edit HTML Templates", enabled: false },
    { name: "Manage Public Documents", enabled: true },
    { name: "Assign Permission Sets", enabled: true },
    { name: "Customize Application", enabled: true },
    { name: "Manage Roles", enabled: true },
    { name: "Manage Profiles and Permission Sets", enabled: true },
    { name: "Manage Sharing", enabled: true },
    { name: "Manage Users", enabled: true },
    { name: "View Setup and Configuration", enabled: true },
  ]);

  const togglePermission = (index: number) => {
    setPermissions(prev => prev.map((perm, i) => i === index ? { ...perm, enabled: !perm.enabled } : perm));
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {permissions.map((perm, idx) => (
              <div key={perm.name} className="flex items-center space-x-2">
                <input type="checkbox" checked={perm.enabled} onChange={() => togglePermission(idx)} />
                <span>{perm.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PermissionCategory({
  title,
  permissions
}: {
  title: string,
  permissions: { name: string, enabled: boolean }[]
}) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="space-y-2">
        {permissions.map((perm, i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
            <span>{perm.name}</span>
            <Badge variant={perm.enabled ? "default" : "outline"}>
              {perm.enabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
