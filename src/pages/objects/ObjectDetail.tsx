import React, { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/main-layout";
import { useMetadata } from "@/contexts/metadata-context";
import { useLayout } from "@/contexts/layout-context";
import { Field } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Activity,
  Database,
  Edit,
  FileEdit,
  FilePlus,
  FileText,
  Grid3X3,
  LayoutGrid,
  MoreHorizontal,
  Plus,
  Trash2,
  Settings,
  Eye
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function ObjectDetail() {
  const { objectApiName } = useParams<{ objectApiName: string }>();
  const { objects, isLoading, getObjectByApiName, deleteField } = useMetadata();
  const { layouts, getLayoutsByObjectApiName } = useLayout();
  const [activeTab, setActiveTab] = useState("overview");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<Field | null>(null);

  // Get object data
  const object = getObjectByApiName(objectApiName || "");
  const objectLayouts = objectApiName ? getLayoutsByObjectApiName(objectApiName) : [];
  
  // If the object doesn't exist, redirect to the objects list
  if (!isLoading && !object) {
    return <Navigate to="/objects" replace />;
  }

  // Generate breadcrumbs
  const breadcrumbs = [
    { label: "Objects", link: "/objects" },
    { label: object?.label || "Loading..." }
  ];

  // Handle field deletion
  const confirmDeleteField = async () => {
    if (fieldToDelete && objectApiName) {
      try {
        await deleteField(objectApiName, fieldToDelete.id);
        setDeleteDialogOpen(false);
        setFieldToDelete(null);
      } catch (error) {
        console.error("Error deleting field:", error);
      }
    }
  };

  // Handle opening the delete confirmation dialog
  const handleDeleteFieldClick = (field: Field) => {
    setFieldToDelete(field);
    setDeleteDialogOpen(true);
  };

  // Generate contextual sidebar content
  const contextualSidebarContent = object ? (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">Object Details</h3>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">API Name:</span> {object.apiName}</p>
          <p><span className="font-medium">Label:</span> {object.label}</p>
          <p><span className="font-medium">Plural Label:</span> {object.pluralLabel}</p>
          <p><span className="font-medium">Fields:</span> {object.fields.length}</p>
          <p><span className="font-medium">Records:</span> {object.recordCount || 0}</p>
          <p><span className="font-medium">Created:</span> {new Date(object.createdAt).toLocaleDateString()}</p>
          <p><span className="font-medium">Last Modified:</span> {new Date(object.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Quick Actions</h3>
        <div className="space-y-2">
          <Link to={`/objects/${object.apiName}/fields/create`}>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Add New Field
            </Button>
          </Link>
          <Link to={`/objects/${object.apiName}/records`}>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Database className="mr-2 h-4 w-4" />
              View Records
            </Button>
          </Link>
          <Link to={`/layouts/create?object=${object.apiName}`}>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Create Layout
            </Button>
          </Link>
          <Link to={`/objects/${object.apiName}/edit`}>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Configure Object
            </Button>
          </Link>
        </div>
      </div>
      
      {objectLayouts.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">Layouts</h3>
          <div className="space-y-1">
            {objectLayouts.map(layout => (
              <Link to={`/layouts/${layout.id}`} key={layout.id}>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  {layout.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  ) : null;

  return (
    <MainLayout 
      breadcrumbs={breadcrumbs}
      contextualSidebarContent={contextualSidebarContent}
    >
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">
                {isLoading ? <Skeleton className="h-9 w-64" /> : object?.label}
              </h1>
              {object && (
                <Badge variant={object.isCustom ? "secondary" : "default"}>
                  {object.isCustom ? "Custom" : "Standard"}
                </Badge>
              )}
              {object && !object.isActive && (
                <Badge variant="destructive">Inactive</Badge>
              )}
            </div>
            {object?.description && (
              <p className="text-muted-foreground">{object.description}</p>
            )}
          </div>
          
          <div className="flex gap-2">
            <Link to={`/objects/${objectApiName}/edit`}>
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Configure</span>
              </Button>
            </Link>
            <Link to={`/objects/${objectApiName}/fields/create`}>
              <Button className="flex items-center gap-2">
                <FilePlus className="h-4 w-4" />
                <span>New Field</span>
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Tabs */}
        <Tabs 
          defaultValue="overview" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="fields" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Fields
            </TabsTrigger>
            <TabsTrigger value="layouts" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              Layouts
            </TabsTrigger>
            <TabsTrigger value="records" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Records
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Object Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Object Information</CardTitle>
                  <CardDescription>Basic details about this object</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-5 w-2/3" />
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between py-1">
                        <span className="font-medium">API Name:</span>
                        <span className="text-muted-foreground">{object?.apiName}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="font-medium">Plural Label:</span>
                        <span className="text-muted-foreground">{object?.pluralLabel}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="font-medium">Type:</span>
                        <span className="text-muted-foreground">{object?.isCustom ? "Custom Object" : "Standard Object"}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="font-medium">Status:</span>
                        <span className={`${object?.isActive ? "text-green-600" : "text-red-600"}`}>
                          {object?.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="font-medium">Created:</span>
                        <span className="text-muted-foreground">
                          {object?.createdAt ? new Date(object.createdAt).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="font-medium">Last Modified:</span>
                        <span className="text-muted-foreground">
                          {object?.updatedAt ? new Date(object.updatedAt).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              
              {/* Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                  <CardDescription>Usage metrics for this object</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <StatCard 
                      title="Fields" 
                      value={isLoading ? null : object?.fields.length || 0} 
                      description="Total fields" 
                      onClick={() => setActiveTab("fields")}
                    />
                    <StatCard 
                      title="Records" 
                      value={isLoading ? null : object?.recordCount || 0} 
                      description="Data records" 
                      onClick={() => setActiveTab("records")}
                    />
                    <StatCard 
                      title="Layouts" 
                      value={isLoading ? null : objectLayouts.length} 
                      description="Page layouts" 
                      onClick={() => setActiveTab("layouts")}
                    />
                    <StatCard 
                      title="Required" 
                      value={isLoading ? null : object?.fields.filter(f => f.required).length || 0}
                      description="Required fields" 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Quick Access to Fields */}
            <Card>
              <CardHeader>
                <CardTitle>Field Overview</CardTitle>
                <CardDescription>Quick access to key fields</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Label</TableHead>
                      <TableHead>API Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-8" /></TableCell>
                          <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                        </TableRow>
                      ))
                    ) : object?.fields.slice(0, 5).map(field => (
                      <TableRow key={field.id}>
                        <TableCell className="font-medium">{field.label}</TableCell>
                        <TableCell>{field.apiName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{field.type}</Badge>
                        </TableCell>
                        <TableCell>
                          {field.required ? "Yes" : "No"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link to={`/objects/${objectApiName}/fields/${field.id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {object && object.fields.length > 5 && (
                  <div className="mt-4 text-center">
                    <Button variant="outline" onClick={() => setActiveTab("fields")}>
                      View All Fields
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Fields Tab */}
          <TabsContent value="fields" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Fields</h2>
              <Link to={`/objects/${objectApiName}/fields/create`}>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Field</span>
                </Button>
              </Link>
            </div>
            
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Label</TableHead>
                    <TableHead>API Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Required</TableHead>
                    <TableHead>Unique</TableHead>
                    <TableHead>Custom</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array(8).fill(0).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-8" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-8" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-8" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : object?.fields.map(field => (
                    <TableRow key={field.id}>
                      <TableCell className="font-medium">{field.label}</TableCell>
                      <TableCell>{field.apiName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{field.type}</Badge>
                      </TableCell>
                      <TableCell>{field.required ? "Yes" : "No"}</TableCell>
                      <TableCell>{field.unique ? "Yes" : "No"}</TableCell>
                      <TableCell>{field.isCustom ? "Yes" : "No"}</TableCell>
                      <TableCell className="text-right">
                        <FieldActions 
                          field={field} 
                          objectApiName={objectApiName || ""} 
                          onDelete={() => handleDeleteFieldClick(field)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {object && object.fields.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <p className="text-muted-foreground">
                          No fields found for this object.
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
          
          {/* Layouts Tab */}
          <TabsContent value="layouts" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Layouts</h2>
              <Link to={`/layouts/create?object=${objectApiName}`}>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Create Layout</span>
                </Button>
              </Link>
            </div>
            
            {objectLayouts.length === 0 ? (
              <Card className="flex flex-col items-center justify-center p-12 text-center">
                <LayoutGrid className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No layouts found</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Layouts define how records are displayed in different contexts. 
                  Create a layout to customize the view experience for this object.
                </p>
                <Link to={`/layouts/create?object=${objectApiName}`}>
                  <Button>Create Your First Layout</Button>
                </Link>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {objectLayouts.map(layout => (
                  <Card key={layout.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle>{layout.name}</CardTitle>
                      <CardDescription>
                        {layout.isActive ? "Active" : "Inactive"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm mb-1">
                        <span className="font-medium">Sections:</span> {layout.sections.length}
                      </p>
                      <p className="text-sm mb-1">
                        <span className="font-medium">Assigned Profiles:</span> {layout.assignedProfiles?.length || 0}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Last Modified:</span> {new Date(layout.updatedAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                    <div className="px-6 pb-6 pt-2 flex gap-2">
                      <Link to={`/layouts/${layout.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">View</Button>
                      </Link>
                      <Link to={`/layouts/${layout.id}/builder`} className="flex-1">
                        <Button variant="secondary" className="w-full">Edit</Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Records Tab */}
          <TabsContent value="records" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Records</h2>
              <Link to={`/objects/${objectApiName}/records/new`}>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span>New Record</span>
                </Button>
              </Link>
            </div>
            
            <Card className="flex flex-col items-center justify-center p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Records view</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                The records view is currently being implemented. Please check back later.
              </p>
              <Link to={`/objects/${objectApiName}/records`}>
                <Button>Go to Records</Button>
              </Link>
            </Card>
          </TabsContent>
          
          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <h2 className="text-xl font-bold">History</h2>
            
            <Card className="flex flex-col items-center justify-center p-12 text-center">
              <Activity className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Audit history</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                The audit history view shows all changes made to this object and its metadata.
                This feature is coming soon.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Delete field confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Field</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the field "{fieldToDelete?.label}"?
              This action cannot be undone and may impact existing records and layouts.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteField}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}

interface StatCardProps {
  title: string;
  value: number | null;
  description: string;
  onClick?: () => void;
}

function StatCard({ title, value, description, onClick }: StatCardProps) {
  return (
    <div 
      className={`p-4 rounded-md border bg-card text-card-foreground shadow-sm ${onClick ? 'cursor-pointer hover:bg-accent/50' : ''}`}
      onClick={onClick}
    >
      <h3 className="text-sm font-medium">{title}</h3>
      {value === null ? (
        <Skeleton className="h-7 w-16 mt-1 mb-1" />
      ) : (
        <p className="text-2xl font-bold">{value}</p>
      )}
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

interface FieldActionsProps {
  field: Field;
  objectApiName: string;
  onDelete: () => void;
}

function FieldActions({ field, objectApiName, onDelete }: FieldActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Field Actions</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link to={`/objects/${objectApiName}/fields/${field.id}`} className="flex cursor-pointer items-center">
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={`/objects/${objectApiName}/fields/${field.id}/edit`} className="flex cursor-pointer items-center">
            <FileEdit className="mr-2 h-4 w-4" />
            Edit Field
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={onDelete}
          className="text-destructive focus:text-destructive"
          disabled={!field.isCustom}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Field
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}