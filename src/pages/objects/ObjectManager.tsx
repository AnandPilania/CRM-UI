import React, { useState, useMemo } from "react";
import { useMetadata } from "@/contexts/metadata-context";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import {
  Plus,
  MoreHorizontal,
  Trash2,
  Edit,
  Database,
  Eye,
  CheckCircle2,
  XCircle,
  Layers,
  Settings,
} from "lucide-react";

const TABS = [
  { label: "All", value: "all" },
  { label: "Custom", value: "custom" },
  { label: "Standard", value: "standard" },
  { label: "Inactive", value: "inactive" },
];

export default function ObjectManager() {
  const { objects, isLoading, deleteObject, updateObject } = useMetadata();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const filteredObjects = useMemo(() => {
    let filtered = objects.filter(obj =>
      obj.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obj.apiName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (activeTab === "custom") filtered = filtered.filter(obj => obj.isCustom);
    if (activeTab === "standard") filtered = filtered.filter(obj => !obj.isCustom);
    if (activeTab === "inactive") filtered = filtered.filter(obj => !obj.isActive);
    return filtered;
  }, [objects, searchTerm, activeTab]);

  const stats = useMemo(() => ({
    total: objects.length,
    custom: objects.filter(o => o.isCustom).length,
    standard: objects.filter(o => !o.isCustom).length,
    inactive: objects.filter(o => !o.isActive).length,
    fields: objects.reduce((acc, o) => acc + o.fields.length, 0),
    records: objects.reduce((acc, o) => acc + (o.recordCount || 0), 0),
  }), [objects]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedIds(filteredObjects.map(obj => obj.id));
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const handleBulkDelete = async () => {
    setBulkActionLoading(true);
    for (const id of selectedIds) {
      await deleteObject(id);
    }
    setBulkActionLoading(false);
    clearSelection();
  };

  const handleBulkToggleActive = async (active: boolean) => {
    setBulkActionLoading(true);
    for (const id of selectedIds) {
      await updateObject(id, { isActive: active });
    }
    setBulkActionLoading(false);
    clearSelection();
  };

  // Contextual sidebar content
  const contextualSidebarContent = (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">Object Stats</h3>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">Total Objects:</span> {stats.total}</p>
          <p><span className="font-medium">Custom:</span> {stats.custom}</p>
          <p><span className="font-medium">Standard:</span> {stats.standard}</p>
          <p><span className="font-medium">Inactive:</span> {stats.inactive}</p>
          <p><span className="font-medium">Fields:</span> {stats.fields}</p>
          <p><span className="font-medium">Records:</span> {stats.records}</p>
        </div>
      </div>
      <div>
        <h3 className="font-medium mb-2">Quick Actions</h3>
        <div className="space-y-2">
          <Link to="/objects/create">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Create Object
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout breadcrumbs={[{ label: "Objects" }, { label: "Manager" }]} contextualSidebarContent={contextualSidebarContent}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
              <Layers className="h-7 w-7 text-muted-foreground" />
              Object Manager
            </h1>
            <p className="text-muted-foreground">Manage all CRM objects, fields, and records in one place.</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/objects/create">
                <Plus className="h-4 w-4 mr-2" /> New Object
              </Link>
            </Button>
            <Button variant="outline" onClick={selectAll} disabled={filteredObjects.length === 0}>Select All</Button>
            <Button variant="outline" onClick={clearSelection} disabled={selectedIds.length === 0}>Clear</Button>
            <Button variant="destructive" onClick={handleBulkDelete} disabled={selectedIds.length === 0 || bulkActionLoading}>Delete</Button>
            <Button onClick={() => handleBulkToggleActive(true)} disabled={selectedIds.length === 0 || bulkActionLoading}>Activate</Button>
            <Button onClick={() => handleBulkToggleActive(false)} disabled={selectedIds.length === 0 || bulkActionLoading}>Deactivate</Button>
          </div>
        </div>
        {/* Tabs for filtering */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            {TABS.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={activeTab} className="space-y-4">
            {/* Search */}
            <div className="flex items-center gap-4 mb-2">
              <Input
                placeholder="Search objects..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
              <span className="text-muted-foreground text-xs">{filteredObjects.length} found</span>
            </div>
            {/* Table */}
            <div className="overflow-x-auto rounded-md border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Label</TableHead>
                    <TableHead>API Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fields</TableHead>
                    <TableHead>Records</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array(8).fill(0).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-5" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-8" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-8" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredObjects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        <p className="text-muted-foreground">No objects found.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredObjects.map(obj => (
                      <TableRow key={obj.id} className={selectedIds.includes(obj.id) ? "bg-accent/30" : ""}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(obj.id)}
                            onChange={() => toggleSelect(obj.id)}
                            className="accent-primary"
                          />
                        </TableCell>
                        <TableCell className="font-medium flex items-center gap-2">
                          <Link to={`/objects/${obj.apiName}`} className="hover:underline">
                            {obj.label}
                          </Link>
                          <Badge variant={obj.isCustom ? "secondary" : "default"} className="ml-1">
                            {obj.isCustom ? "Custom" : "Standard"}
                          </Badge>
                        </TableCell>
                        <TableCell>{obj.apiName}</TableCell>
                        <TableCell>
                          {obj.isCustom ? (
                            <Badge variant="secondary">Custom</Badge>
                          ) : (
                            <Badge>Standard</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {obj.isActive ? (
                            <Badge variant="success" className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4" />Active</Badge>
                          ) : (
                            <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-4 w-4" />Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell>{obj.fields.length}</TableCell>
                        <TableCell>{obj.recordCount || 0}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link to={`/objects/${obj.apiName}`} className="flex cursor-pointer items-center">
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/objects/${obj.apiName}/fields`} className="flex cursor-pointer items-center">
                                  <Database className="mr-2 h-4 w-4" />
                                  Fields
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/objects/${obj.apiName}/records`} className="flex cursor-pointer items-center">
                                  <Database className="mr-2 h-4 w-4" />
                                  Records
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link to={`/objects/${obj.apiName}/edit`} className="flex cursor-pointer items-center">
                                  <Settings className="mr-2 h-4 w-4" />
                                  Configure
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={async () => await updateObject(obj.id, { isActive: !obj.isActive })}
                                className={obj.isActive ? "text-destructive focus:text-destructive" : "text-success focus:text-success"}
                              >
                                {obj.isActive ? (
                                  <>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={async () => await deleteObject(obj.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
} 