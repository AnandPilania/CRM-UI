import { useState } from "react";
import { useNavigate, Outlet, useLocation, useParams, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Profile, PermissionSet } from "@/types";
import { ObjectPermissions } from "@/components/security/object-permissions";
import { FieldPermissionsTable } from "@/components/security/field-permissions-table";

// Mock data
const mockProfiles: Profile[] = [
  { id: "1", name: "System Administrator", description: "Complete access to the system with all administrative privileges", isStandard: true },
  { id: "2", name: "Standard User", description: "Standard user access with basic CRUD permissions", isStandard: true },
  { id: "3", name: "Marketing User", description: "Access to marketing features and campaign management", isStandard: true },
  { id: "4", name: "Sales Manager", description: "Custom profile for sales team managers", isStandard: false },
];

const mockPermissionSets: PermissionSet[] = [
  { id: "1", name: "View All Data", description: "Ability to view all records across the org", isActive: true },
  { id: "2", name: "Modify All Data", description: "Ability to modify all records across the org", isActive: true },
  { id: "3", name: "API Access", description: "Access to APIs and integration features", isActive: true },
  { id: "4", name: "Report Builder", description: "Create and manage reports and dashboards", isActive: true },
];

// Mock data for permission set groups
const mockPermissionSetGroups = [
  { id: "1", name: "Admin Group", description: "All admin permission sets" },
  { id: "2", name: "Sales Group", description: "Sales-related permission sets" },
];

// Mock data for sharing rules
const mockSharingRules = [
  { id: "1", name: "Project: Public Read Only", object: "Project", access: "Read Only", criteria: "All records" },
  { id: "2", name: "Account: Private", object: "Account", access: "Private", criteria: "All records" },
];

// Mock data for sharing settings
const mockSharingSettings = [
  { id: "1", object: "Project", defaultAccess: "Read Only" },
  { id: "2", object: "Account", defaultAccess: "Private" },
];

export default function SecurityPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { objectId, permissionSetId } = useParams<{ objectId: string; permissionSetId: string }>();
  const path = location.pathname;

  // Check for object permissions page
  if (path.includes("/security/object-permissions/")) {
    return <ObjectPermissions objectId={objectId || ""} />;
  }

  // Check for permission set details page
  if (path.startsWith("/security/permission-sets/") && path !== "/security/permission-sets" && path !== "/security/permission-sets/new") {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Permission Set Details</h1>
        </div>
        <p className="text-muted-foreground">Permission set details coming soon...</p>
      </div>
    );
  }

  // Check for permission set creation page
  if (path === "/security/permission-sets/new") {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">New Permission Set</h1>
        </div>
        <p className="text-muted-foreground">Permission Set creator coming soon...</p>
      </div>
    );
  }

  // Add a stubbed new profile form component
  function NewProfileForm() {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Create New Profile</h1>
        </div>
        <p className="text-muted-foreground">Profile creation form coming soon...</p>
      </div>
    );
  }

  // Check for new profile creation page
  if (path === "/security/profiles/new") {
    return <NewProfileForm />;
  }

  // Redirect /security/field-security to /security/field-level-security
  if (path === "/security/field-security") {
    return <Navigate to="/security/field-level-security" replace />;
  }

  // If we're on a specific path that should render its own component via Outlet
  if (path !== "/security/profiles" && path !== "/security/permission-sets" &&
    path !== "/security/field-level-security" && path !== "/security/sharing-settings" &&
    path !== "/security/sharing-rules" && path !== "/security/permission-set-groups") {
    return <Outlet />;
  }

  // Field Level Security page
  if (path === "/security/field-level-security") {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Field-Level Security</h1>
        </div>
        <FieldPermissionsTable />
      </div>
    );
  }

  // Sharing Settings page
  if (path === "/security/sharing-settings") {
    return <SharingSettingsTable />;
  }

  // Sharing Rules page
  if (path === "/security/sharing-rules") {
    return <SharingRulesTable />;
  }

  // Permission Set Groups page
  if (path === "/security/permission-set-groups") {
    return <PermissionSetGroupsTable />;
  }

  // Profiles Table
  if (path === "/security/profiles") {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Profiles</h1>
          <Button onClick={() => navigate("/security/profiles/new")}>
            <Plus className="mr-2 h-4 w-4" /> New Profile
          </Button>
        </div>

        <ProfilesTable profiles={mockProfiles} />
      </div>
    );
  }

  // Permission Sets Table
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Permission Sets</h1>
        <Button onClick={() => navigate("/security/permission-sets/new")}>
          <Plus className="mr-2 h-4 w-4" /> New Permission Set
        </Button>
      </div>

      <PermissionSetsTable permissionSets={mockPermissionSets} />
    </div>
  );
}

interface ProfilesTableProps {
  profiles: Profile[];
}

function ProfilesTable({ profiles }: ProfilesTableProps) {
  const navigate = useNavigate();

  const columns: ColumnDef<Profile>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="font-medium">{row.getValue("name")}</div>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "isStandard",
      header: "Type",
      cell: ({ row }) => {
        const isStandard = row.original.isStandard;
        return (
          <Badge variant={isStandard ? "secondary" : "outline"}>
            {isStandard ? "Standard" : "Custom"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const profile = row.original;

        return (
          <Button
            variant="link"
            onClick={() => navigate(`/security/profiles/${profile.id}`)}
          >
            View Details
          </Button>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={profiles}
      filterableColumns={[
        {
          id: "isStandard",
          title: "Type",
          options: [
            { label: "Standard", value: "true" },
            { label: "Custom", value: "false" },
          ],
        },
      ]}
      searchableColumns={[
        {
          id: "name",
          title: "name",
        },
      ]}
    />
  );
}

interface PermissionSetsTableProps {
  permissionSets: PermissionSet[];
}

function PermissionSetsTable({ permissionSets }: PermissionSetsTableProps) {
  const navigate = useNavigate();

  const columns: ColumnDef<PermissionSet>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="font-medium">{row.getValue("name")}</div>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
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
        const permissionSet = row.original;

        return (
          <Button
            variant="link"
            onClick={() => navigate(`/security/permission-sets/${permissionSet.id}`)}
          >
            View Details
          </Button>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={permissionSets}
      filterableColumns={[
        {
          id: "isActive",
          title: "Status",
          options: [
            { label: "Active", value: "true" },
            { label: "Inactive", value: "false" },
          ],
        },
      ]}
      searchableColumns={[
        {
          id: "name",
          title: "name",
        },
      ]}
    />
  );
}

function PermissionSetGroupsTable() {
  const [groups, setGroups] = useState(mockPermissionSetGroups);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editGroup, setEditGroup] = useState(null);

  const handleAdd = () => setShowAddDialog(true);
  const handleEdit = (group) => {
    setEditGroup(group);
    setShowEditDialog(true);
  };
  const handleDelete = (groupId) => {
    if (window.confirm("Delete this group?")) {
      setGroups(groups.filter(g => g.id !== groupId));
    }
  };
  const handleAddGroup = () => {
    setGroups([...groups, { id: Date.now().toString(), name: "New Group", description: "Description" }]);
    setShowAddDialog(false);
  };
  const handleEditGroup = () => {
    setGroups(groups.map(g => g.id === editGroup.id ? { ...editGroup } : g));
    setShowEditDialog(false);
  };

  const columns: ColumnDef<typeof groups[0]>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <span>{row.getValue("name")}</span>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <span>{row.getValue("description")}</span>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const group = row.original;
        return (
          <div className="space-x-2">
            <Button size="sm" variant="outline" onClick={() => handleEdit(group)}>Edit</Button>
            <Button size="sm" variant="destructive" onClick={() => handleDelete(group.id)}>Delete</Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Permission Set Groups</h1>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> New Group
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={groups}
        filterableColumns={[]}
        searchableColumns={[
          { id: "name", title: "name" },
          { id: "description", title: "description" },
        ]}
      />
      {/* Add/Edit dialogs (stubbed) */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-bold mb-2">Add Group</h2>
            <p className="mb-4">Group creation form coming soon...</p>
            <Button onClick={handleAddGroup}>Add Group</Button>
            <Button variant="outline" className="ml-2" onClick={() => setShowAddDialog(false)}>Cancel</Button>
          </div>
        </div>
      )}
      {showEditDialog && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-bold mb-2">Edit Group</h2>
            <p className="mb-4">Group edit form coming soon...</p>
            <Button onClick={handleEditGroup}>Save</Button>
            <Button variant="outline" className="ml-2" onClick={() => setShowEditDialog(false)}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function SharingRulesTable() {
  const [rules, setRules] = useState(mockSharingRules);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editRule, setEditRule] = useState(null);

  const handleAdd = () => setShowAddDialog(true);
  const handleEdit = (rule) => {
    setEditRule(rule);
    setShowEditDialog(true);
  };
  const handleDelete = (ruleId) => {
    if (window.confirm("Delete this rule?")) {
      setRules(rules.filter(r => r.id !== ruleId));
    }
  };
  const handleAddRule = () => {
    setRules([...rules, { id: Date.now().toString(), name: "New Rule", object: "Object", access: "Read Only", criteria: "Criteria" }]);
    setShowAddDialog(false);
  };
  const handleEditRule = () => {
    setRules(rules.map(r => r.id === editRule.id ? { ...editRule } : r));
    setShowEditDialog(false);
  };

  const columns: ColumnDef<typeof rules[0]>[] = [
    { accessorKey: "name", header: "Name", cell: ({ row }) => <span>{row.getValue("name")}</span> },
    { accessorKey: "object", header: "Object", cell: ({ row }) => <span>{row.getValue("object")}</span> },
    { accessorKey: "access", header: "Access", cell: ({ row }) => <span>{row.getValue("access")}</span> },
    { accessorKey: "criteria", header: "Criteria", cell: ({ row }) => <span>{row.getValue("criteria")}</span> },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const rule = row.original;
        return (
          <div className="space-x-2">
            <Button size="sm" variant="outline" onClick={() => handleEdit(rule)}>Edit</Button>
            <Button size="sm" variant="destructive" onClick={() => handleDelete(rule.id)}>Delete</Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sharing Rules</h1>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> New Sharing Rule
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={rules}
        filterableColumns={[]}
        searchableColumns={[
          { id: "name", title: "name" },
          { id: "object", title: "object" },
          { id: "access", title: "access" },
          { id: "criteria", title: "criteria" },
        ]}
      />
      {/* Add/Edit dialogs (stubbed) */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-bold mb-2">Add Sharing Rule</h2>
            <p className="mb-4">Rule creation form coming soon...</p>
            <Button onClick={handleAddRule}>Add Rule</Button>
            <Button variant="outline" className="ml-2" onClick={() => setShowAddDialog(false)}>Cancel</Button>
          </div>
        </div>
      )}
      {showEditDialog && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-bold mb-2">Edit Sharing Rule</h2>
            <p className="mb-4">Rule edit form coming soon...</p>
            <Button onClick={handleEditRule}>Save</Button>
            <Button variant="outline" className="ml-2" onClick={() => setShowEditDialog(false)}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function SharingSettingsTable() {
  const [settings, setSettings] = useState(mockSharingSettings);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editSetting, setEditSetting] = useState(null);

  const handleEdit = (setting) => {
    setEditSetting(setting);
    setShowEditDialog(true);
  };
  const handleEditSetting = () => {
    setSettings(settings.map(s => s.id === editSetting.id ? { ...editSetting } : s));
    setShowEditDialog(false);
  };

  const columns: ColumnDef<typeof settings[0]>[] = [
    { accessorKey: "object", header: "Object", cell: ({ row }) => <span>{row.getValue("object")}</span> },
    { accessorKey: "defaultAccess", header: "Default Access", cell: ({ row }) => <span>{row.getValue("defaultAccess")}</span> },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const setting = row.original;
        return (
          <Button size="sm" variant="outline" onClick={() => handleEdit(setting)}>Edit</Button>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sharing Settings</h1>
      </div>
      <DataTable
        columns={columns}
        data={settings}
        filterableColumns={[]}
        searchableColumns={[
          { id: "object", title: "object" },
          { id: "defaultAccess", title: "default access" },
        ]}
      />
      {/* Edit dialog (stubbed) */}
      {showEditDialog && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-bold mb-2">Edit Sharing Setting</h2>
            <p className="mb-4">Setting edit form coming soon...</p>
            <Button onClick={handleEditSetting}>Save</Button>
            <Button variant="outline" className="ml-2" onClick={() => setShowEditDialog(false)}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}
