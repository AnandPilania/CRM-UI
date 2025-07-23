import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Profile,
  PermissionSet,
  Role,
  SharingRule,
  OrgWideDefaults,
} from "@/types";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Plus,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  Users,
  X,
  Lock as LockIcon
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function PermissionManager() {
  const [activeTab, setActiveTab] = useState("profiles");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedObjects, setExpandedObjects] = useState<Record<string, boolean>>({});
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Sample data for profiles
  const profiles: Profile[] = [
    {
      id: "1",
      type: "Profile",
      name: "System Administrator",
      description: "Complete system access",
      objectPermissions: [
        {
          objectApiName: "Account",
          create: true,
          read: true,
          edit: true,
          delete: true,
          viewAll: true,
          modifyAll: true,
        },
        {
          objectApiName: "Contact",
          create: true,
          read: true,
          edit: true,
          delete: true,
          viewAll: true,
          modifyAll: true,
        },
      ],
      fieldPermissions: [
        {
          fieldApiName: "Account.Name",
          read: true,
          edit: true,
        },
        {
          fieldApiName: "Account.Industry__c",
          read: true,
          edit: true,
        },
      ],
      userLicense: "Full CRM",
      layoutAssignments: [
        { object: "Account", layout: "Account Layout" },
        { object: "Contact", layout: "Contact Layout" },
      ],
    },
    {
      id: "2",
      type: "Profile",
      name: "Standard User",
      description: "Standard platform access",
      objectPermissions: [
        {
          objectApiName: "Account",
          create: true,
          read: true,
          edit: true,
          delete: false,
          viewAll: false,
          modifyAll: false,
        },
      ],
      fieldPermissions: [],
      userLicense: "Full CRM",
      layoutAssignments: [],
    },
    {
      id: "3",
      type: "Profile",
      name: "Read Only",
      description: "Read-only access to standard objects",
      objectPermissions: [
        {
          objectApiName: "Account",
          create: false,
          read: true,
          edit: false,
          delete: false,
          viewAll: false,
          modifyAll: false,
        },
      ],
      fieldPermissions: [],
      userLicense: "Full CRM",
      layoutAssignments: [],
    },
  ];

  // Sample data for permission sets
  const permissionSets: PermissionSet[] = [
    {
      id: "1",
      type: "PermissionSet",
      name: "Sales Manager",
      description: "Additional permissions for sales managers",
      objectPermissions: [],
      fieldPermissions: [],
    },
    {
      id: "2",
      type: "PermissionSet",
      name: "Marketing User",
      description: "Permissions for marketing team members",
      objectPermissions: [],
      fieldPermissions: [],
    },
  ];

  // Sample data for roles
  const roles: Role[] = [
    {
      id: "1",
      type: "Role",
      name: "CEO",
      description: "Chief Executive Officer",
      subordinateRoles: ["2", "3"],
      users: ["user1"],
    },
    {
      id: "2",
      type: "Role",
      name: "VP Sales",
      description: "Vice President of Sales",
      parentRole: "1",
      subordinateRoles: ["4"],
      users: ["user2"],
    },
    {
      id: "3",
      type: "Role",
      name: "VP Marketing",
      description: "Vice President of Marketing",
      parentRole: "1",
      subordinateRoles: [],
      users: ["user3"],
    },
    {
      id: "4",
      type: "Role",
      name: "Sales Manager",
      description: "Sales Manager",
      parentRole: "2",
      subordinateRoles: [],
      users: ["user4", "user5"],
    },
  ];

  // Sample data for sharing rules
  const sharingRules: SharingRule[] = [
    {
      id: "1",
      type: "SharingRule",
      name: "Account Sharing: Marketing to Sales",
      description: "Share accounts owned by Marketing with Sales team",
      sourceObject: "Account",
      targetObject: "Account",
      accessLevel: "Read",
      criteriaField: "Type",
      criteriaValue: "Prospect",
      sharedWith: ["VP Sales", "Sales Manager"],
    },
    {
      id: "2",
      type: "SharingRule",
      name: "Opportunity Sharing: High Value",
      description: "Share high value opportunities with executive team",
      sourceObject: "Opportunity",
      targetObject: "Opportunity",
      accessLevel: "ReadWrite",
      criteriaField: "Amount",
      criteriaValue: "100000",
      sharedWith: ["CEO"],
    },
  ];

  // Sample data for org-wide defaults
  const orgWideDefaults: OrgWideDefaults[] = [
    {
      objectApiName: "Account",
      defaultAccess: "Private",
      grantAccessUsing: "Hierarchy",
    },
    {
      objectApiName: "Contact",
      defaultAccess: "ControlledByParent",
    },
    {
      objectApiName: "Opportunity",
      defaultAccess: "Private",
      grantAccessUsing: "Hierarchy",
    },
    {
      objectApiName: "Case",
      defaultAccess: "Private",
      grantAccessUsing: "Hierarchy",
    },
  ];

  const toggleObjectExpansion = (objectName: string) => {
    setExpandedObjects({
      ...expandedObjects,
      [objectName]: !expandedObjects[objectName],
    });
  };

  const renderPermissionIcon = (hasPermission: boolean, tooltip: string) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("p-1 rounded-full", hasPermission ? "text-green-500" : "text-muted-foreground")}>
            {hasPermission ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const renderProfilesList = () => {
    const filteredProfiles = profiles.filter(profile =>
      profile.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Profiles</h2>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Profile
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search profiles..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profile Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>User License</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No profiles found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProfiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">
                      <Link to={`/setup/security/profiles/${profile.id}`} className="text-primary hover:underline">
                        {profile.name}
                      </Link>
                    </TableCell>
                    <TableCell>{profile.description}</TableCell>
                    <TableCell>{profile.userLicense}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/setup/security/profiles/${profile.id}`}>Edit</Link>
                      </Button>
                      <Button variant="ghost" size="sm">Clone</Button>
                      <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  const renderPermissionSetsList = () => {
    const filteredPermSets = permissionSets.filter(perm =>
      perm.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Permission Sets</h2>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Permission Set
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search permission sets..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Permission Set</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPermSets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No permission sets found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPermSets.map((permSet) => (
                  <TableRow key={permSet.id}>
                    <TableCell className="font-medium">
                      <Link to={`/setup/security/permission-sets/${permSet.id}`} className="text-primary hover:underline">
                        {permSet.name}
                      </Link>
                    </TableCell>
                    <TableCell>{permSet.description}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/setup/security/permission-sets/${permSet.id}`}>Edit</Link>
                      </Button>
                      <Button variant="ghost" size="sm">Clone</Button>
                      <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  const renderRolesList = () => {
    const filteredRoles = roles.filter(role =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Roles</h2>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Role
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search roles..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Role Hierarchy</CardTitle>
              <CardDescription>
                Visualize the role hierarchy and its impact on record access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 rounded-md p-4 space-y-2">
                <div className="bg-card border rounded-md p-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">CEO</span>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
                <div className="ml-6 space-y-2">
                  <div className="bg-card border rounded-md p-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">VP Sales</span>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </div>
                  <div className="ml-6 space-y-2">
                    <div className="bg-card border rounded-md p-2 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="font-medium">Sales Manager</span>
                        </div>
                        <Button variant="ghost" size="sm">View</Button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-card border rounded-md p-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">VP Marketing</span>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Parent Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      No roles found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRoles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">
                        <Link to={`/setup/security/roles/${role.id}`} className="text-primary hover:underline">
                          {role.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {role.parentRole ? roles.find(r => r.id === role.parentRole)?.name : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/setup/security/roles/${role.id}`}>Edit</Link>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  };

  const renderSharingRulesList = () => {
    const filteredRules = sharingRules.filter(rule =>
      rule.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Sharing Rules</h2>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Sharing Rule
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search sharing rules..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule Name</TableHead>
                <TableHead>Object</TableHead>
                <TableHead>Access Level</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No sharing rules found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.name}</TableCell>
                    <TableCell>{rule.sourceObject}</TableCell>
                    <TableCell>{rule.accessLevel}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  const renderOWDList = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Organization-Wide Defaults</h2>
          <Button>Save Changes</Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Default Access Settings</CardTitle>
            <CardDescription>
              Configure the default level of access users have to each other's records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Object</TableHead>
                  <TableHead>Default Access</TableHead>
                  <TableHead>Grant Access Using Hierarchies</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orgWideDefaults.map((owd, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{owd.objectApiName}</TableCell>
                    <TableCell>
                      <Select defaultValue={owd.defaultAccess}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Private">Private</SelectItem>
                          <SelectItem value="Public">Public Read</SelectItem>
                          <SelectItem value="PublicReadWrite">Public Read/Write</SelectItem>
                          <SelectItem value="ControlledByParent">Controlled by Parent</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {owd.grantAccessUsing ? (
                        <Checkbox defaultChecked id={`hierarchy-${index}`} />
                      ) : (
                        <Checkbox id={`hierarchy-${index}`} />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Security & Access</h1>
          <p className="text-muted-foreground">
            Manage security settings, user permissions, and data access controls
          </p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {activeTab === "profiles" && "Create New Profile"}
                {activeTab === "permission-sets" && "Create New Permission Set"}
                {activeTab === "roles" && "Create New Role"}
              </DialogTitle>
              <DialogDescription>
                {activeTab === "profiles" && "Define a new profile with specific permissions and access levels."}
                {activeTab === "permission-sets" && "Define a permission set to assign additional permissions to users."}
                {activeTab === "roles" && "Define a new role in the hierarchy."}
              </DialogDescription>
            </DialogHeader>
            {/* Form fields would go here - specific to each type */}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowCreateDialog(false)}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="profiles" className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              <span>Profiles</span>
            </TabsTrigger>
            <TabsTrigger value="permission-sets" className="flex items-center">
              <ShieldCheck className="h-4 w-4 mr-2" />
              <span>Permission Sets</span>
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>Roles</span>
            </TabsTrigger>
            <TabsTrigger value="sharing-rules" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span>Sharing Rules</span>
            </TabsTrigger>
            <TabsTrigger value="owd" className="flex items-center">
              <LockIcon className="h-4 w-4 mr-2" />
              <span>Org-Wide Defaults</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profiles">
            {renderProfilesList()}
          </TabsContent>

          <TabsContent value="permission-sets">
            {renderPermissionSetsList()}
          </TabsContent>

          <TabsContent value="roles">
            {renderRolesList()}
          </TabsContent>

          <TabsContent value="sharing-rules">
            {renderSharingRulesList()}
          </TabsContent>

          <TabsContent value="owd">
            {renderOWDList()}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
