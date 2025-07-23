import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AuditLog } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock audit data with proper typing
const mockAuditLogs: Array<AuditLog & {
  entityName: string;
  userName: string;
}> = [
    {
      id: "1",
      entityId: "4",
      entityType: "CustomObject",
      entityName: "Project__c",
      action: "create",
      userId: "1",
      userName: "Admin User",
      changes: {},
      timestamp: new Date("2025-07-15T14:30:00Z"),
    },
    {
      id: "2",
      entityId: "2",
      entityType: "ObjectField",
      entityName: "Status__c (Project__c)",
      action: "update",
      userId: "1",
      userName: "Admin User",
      changes: {
        "isRequired": { old: false, new: true },
        "defaultValue": { old: null, new: "New" }
      },
      timestamp: new Date("2025-07-18T09:45:00Z"),
    },
    {
      id: "3",
      entityId: "4",
      entityType: "Profile",
      entityName: "Sales Manager",
      action: "update",
      userId: "1",
      userName: "Admin User",
      changes: {
        "permissions": { old: "...", new: "..." }
      },
      timestamp: new Date("2025-07-20T16:15:00Z"),
    },
    {
      id: "4",
      entityId: "1",
      entityType: "Layout",
      entityName: "Account Layout",
      action: "update",
      userId: "2",
      userName: "Maria Johnson",
      changes: {
        "sections": { old: "...", new: "..." }
      },
      timestamp: new Date("2025-07-21T10:20:00Z"),
    },
  ];

const mockFieldHistory = [
  { id: "fh1", object: "Project", field: "Status", oldValue: "Open", newValue: "Closed", changedBy: "Admin User", changedAt: new Date("2025-07-18T09:45:00Z") },
  { id: "fh2", object: "Project", field: "Priority", oldValue: "Medium", newValue: "High", changedBy: "Maria Johnson", changedAt: new Date("2025-07-19T11:00:00Z") },
];
const mockLoginHistory = [
  { id: "lh1", user: "Admin User", status: "Success", ip: "192.168.1.10", timestamp: new Date("2025-07-21T08:00:00Z") },
  { id: "lh2", user: "Maria Johnson", status: "Failed", ip: "192.168.1.11", timestamp: new Date("2025-07-21T09:00:00Z") },
];

export default function AuditPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("setup-audit");
  const [showDetails, setShowDetails] = useState(false);
  const [detailsChanges, setDetailsChanges] = useState<any>({});
  const [selectedObject, setSelectedObject] = useState("Project");
  const [selectedField, setSelectedField] = useState("Status");

  const columns: ColumnDef<typeof mockAuditLogs[0]>[] = [
    {
      accessorKey: "timestamp",
      header: "Date/Time",
      cell: ({ row }) => {
        const timestamp = row.original.timestamp;
        return (
          <div className="flex flex-col">
            <div>{format(timestamp, "MMM dd, yyyy")}</div>
            <div className="text-xs text-muted-foreground">
              {format(timestamp, "hh:mm a")}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const action = row.getValue("action") as string;

        return (
          <Badge
            variant={
              action === "create" ? "default" :
                action === "update" ? "outline" :
                  action === "delete" ? "destructive" :
                    "secondary"
            }
            className="capitalize"
          >
            {action}
          </Badge>
        );
      },
    },
    {
      accessorKey: "entityName",
      header: "Item",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <div className="font-medium">{row.getValue("entityName")}</div>
            <div className="text-xs text-muted-foreground">{row.original.entityType}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "userName",
      header: "User",
    },
    {
      id: "details",
      header: "Details",
      cell: ({ row }) => {
        const changes = row.original.changes;
        const changeCount = Object.keys(changes).length;

        if (changeCount === 0) {
          return <span className="text-muted-foreground">No changes recorded</span>;
        }

        return (
          <div>
            <span>{changeCount} field{changeCount !== 1 ? 's' : ''} changed</span>
            <Button variant="link" className="p-0 h-auto text-xs ml-2" onClick={() => { setDetailsChanges(changes); setShowDetails(true); }}>
              View Details
            </Button>
          </div>
        );
      },
    },
  ];

  // Filter data based on search term, date and active tab
  const filteredData = mockAuditLogs.filter(log => {
    // Filter by search term
    const matchesSearch =
      !searchTerm ||
      log.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by date
    const matchesDate =
      !date ||
      format(log.timestamp, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");

    // Filter by tab
    const matchesTab =
      (activeTab === "setup-audit") ||
      (activeTab === "field-history" && log.entityType === "ObjectField") ||
      (activeTab === "login-history" && log.entityType === "Login");

    return matchesSearch && matchesDate && matchesTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search audit logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[250px]"
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[180px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Filter by date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {date && (
            <Button variant="ghost" onClick={() => setDate(undefined)}>
              Clear date
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="setup-audit" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="setup-audit">Setup Audit Trail</TabsTrigger>
          <TabsTrigger value="field-history">Field History</TabsTrigger>
          <TabsTrigger value="login-history">Login History</TabsTrigger>
        </TabsList>

        <TabsContent value="setup-audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Setup Audit Trail</CardTitle>
              <CardDescription>
                Track changes to your organization's setup configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={filteredData}
                filterableColumns={[
                  {
                    id: "action",
                    title: "Action",
                    options: [
                      { label: "Create", value: "create" },
                      { label: "Update", value: "update" },
                      { label: "Delete", value: "delete" },
                    ],
                  },
                  {
                    id: "entityType",
                    title: "Entity Type",
                    options: [
                      { label: "Custom Object", value: "CustomObject" },
                      { label: "Object Field", value: "ObjectField" },
                      { label: "Profile", value: "Profile" },
                      { label: "Layout", value: "Layout" },
                    ],
                  },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="field-history">
          <Card>
            <CardHeader>
              <CardTitle>Field History</CardTitle>
              <CardDescription>
                Track changes to field values on individual records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Object</label>
                  <select value={selectedObject} onChange={e => setSelectedObject(e.target.value)} className="border rounded px-2 py-1">
                    <option value="Project">Project</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Field</label>
                  <select value={selectedField} onChange={e => setSelectedField(e.target.value)} className="border rounded px-2 py-1">
                    <option value="Status">Status</option>
                    <option value="Priority">Priority</option>
                  </select>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date/Time</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Old Value</TableHead>
                    <TableHead>New Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockFieldHistory.filter(h => h.object === selectedObject && h.field === selectedField).map(h => (
                    <TableRow key={h.id}>
                      <TableCell>{format(h.changedAt, "MMM dd, yyyy hh:mm a")}</TableCell>
                      <TableCell>{h.changedBy}</TableCell>
                      <TableCell>{h.oldValue}</TableCell>
                      <TableCell>{h.newValue}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="login-history">
          <Card>
            <CardHeader>
              <CardTitle>Login History</CardTitle>
              <CardDescription>
                Track successful and failed login attempts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date/Time</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLoginHistory.map(lh => (
                    <TableRow key={lh.id}>
                      <TableCell>{format(lh.timestamp, "MMM dd, yyyy hh:mm a")}</TableCell>
                      <TableCell>{lh.user}</TableCell>
                      <TableCell>{lh.status}</TableCell>
                      <TableCell>{lh.ip}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* View Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {Object.keys(detailsChanges).length === 0 ? (
              <p>No changes recorded.</p>
            ) : (
              Object.entries(detailsChanges).map(([field, value]: any) => (
                <div key={field} className="border rounded p-2">
                  <div className="font-medium">{field}</div>
                  <div className="text-xs text-muted-foreground">Old: {value.old?.toString() ?? ""}</div>
                  <div className="text-xs text-muted-foreground">New: {value.new?.toString() ?? ""}</div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
