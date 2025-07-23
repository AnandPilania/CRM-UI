import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMetadata } from "@/contexts/metadata-context";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, MoreHorizontal, FileEdit, Trash2, Eye, Database } from "lucide-react";

export default function FieldsList() {
  const { objectApiName } = useParams<{ objectApiName: string }>();
  const { getObjectByApiName, getFieldsByObjectApiName, deleteField, isLoading } = useMetadata();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<any>(null);

  const object = getObjectByApiName(objectApiName || "");
  const fields = getFieldsByObjectApiName(objectApiName || "");

  // Contextual sidebar content
  const contextualSidebarContent = object ? (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">Object Info</h3>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">Label:</span> {object.label}</p>
          <p><span className="font-medium">API Name:</span> {object.apiName}</p>
          <p><span className="font-medium">Fields:</span> {object.fields.length}</p>
          <p><span className="font-medium">Records:</span> {object.recordCount || 0}</p>
        </div>
      </div>
      <div>
        <h3 className="font-medium mb-2">Quick Actions</h3>
        <div className="space-y-2">
          <Link to={`/objects/${object.apiName}/fields/create`}>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Add Field
            </Button>
          </Link>
          <Link to={`/objects/${object.apiName}/records`}>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Database className="mr-2 h-4 w-4" />
              View Records
            </Button>
          </Link>
        </div>
      </div>
    </div>
  ) : null;

  const handleDelete = async (field: any) => {
    if (window.confirm(`Are you sure you want to delete the field '${field.label}'?`)) {
      await deleteField(objectApiName!, field.id);
      setDeleteDialogOpen(false);
      setFieldToDelete(null);
    }
  };

  if (!object && !isLoading) {
    return (
      <MainLayout breadcrumbs={[{ label: "Objects", href: "/objects" }, { label: objectApiName || "Unknown" }, { label: "Fields" }]}>
        <div className="text-center py-12 text-muted-foreground">Object not found.</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout breadcrumbs={[{ label: "Objects", href: "/objects" }, { label: object?.label || objectApiName }, { label: "Fields" }]} contextualSidebarContent={contextualSidebarContent}>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Fields for {object?.label}</h1>
          <Link to={`/objects/${objectApiName}/fields/create`}>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Field</span>
            </Button>
          </Link>
        </div>
        <div className="overflow-x-auto rounded-md border bg-card">
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
              ) : fields.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <p className="text-muted-foreground">No fields found.</p>
                  </TableCell>
                </TableRow>
              ) : (
                fields.map(field => (
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
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
                          <DropdownMenuItem onClick={() => handleDelete(field)} className="text-destructive focus:text-destructive">
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
      </div>
    </MainLayout>
  );
} 