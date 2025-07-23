import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/main-layout";
import { useMetadata } from "@/contexts/metadata-context";
import { MetadataObject } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Filter,
  FilePlus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Search,
  Layout,
  Database,
  FileText,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface ObjectsListProps {
  standardOnly?: boolean;
  customOnly?: boolean;
}

export default function ObjectsList({ standardOnly, customOnly }: ObjectsListProps) {
  const { objects, isLoading, deleteObject } = useMetadata();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [objectToDelete, setObjectToDelete] = useState<MetadataObject | null>(null);
  const [currentView, setCurrentView] = useState<"grid" | "table">("grid");
  
  // Filter objects based on props and search term
  const filteredObjects = objects.filter(obj => {
    const matchesObjectType = (
      (standardOnly && !obj.isCustom) || 
      (customOnly && obj.isCustom) ||
      (!standardOnly && !customOnly)
    );
    
    const matchesSearch = 
      obj.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obj.apiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obj.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
    return matchesObjectType && matchesSearch;
  });
  
  // Determine breadcrumbs and title based on props
  let breadcrumbs = [{ label: "Objects" }];
  let title = "All Objects";
  
  if (standardOnly) {
    breadcrumbs.push({ label: "Standard" });
    title = "Standard Objects";
  } else if (customOnly) {
    breadcrumbs.push({ label: "Custom" });
    title = "Custom Objects";
  }
  
  // Handle object deletion
  const confirmDelete = async () => {
    if (objectToDelete) {
      try {
        await deleteObject(objectToDelete.id);
        setDeleteDialogOpen(false);
        setObjectToDelete(null);
      } catch (error) {
        console.error("Error deleting object:", error);
      }
    }
  };
  
  // Handle opening the delete confirmation dialog
  const handleDeleteClick = (obj: MetadataObject) => {
    setObjectToDelete(obj);
    setDeleteDialogOpen(true);
  };
  
  // Generate contextual sidebar content
  const contextualSidebarContent = (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">Filter Objects</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="active-only" className="rounded" />
            <label htmlFor="active-only" className="text-sm">Active Objects Only</label>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="with-records" className="rounded" />
            <label htmlFor="with-records" className="text-sm">With Records Only</label>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Sort By</h3>
        <div className="space-y-1">
          <Button variant="ghost" size="sm" className="w-full justify-start">Label (A-Z)</Button>
          <Button variant="ghost" size="sm" className="w-full justify-start">Label (Z-A)</Button>
          <Button variant="ghost" size="sm" className="w-full justify-start">Created Date</Button>
          <Button variant="ghost" size="sm" className="w-full justify-start">Last Modified</Button>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Quick Stats</h3>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">Total Objects:</span> {objects.length}</p>
          <p><span className="font-medium">Standard:</span> {objects.filter(obj => !obj.isCustom).length}</p>
          <p><span className="font-medium">Custom:</span> {objects.filter(obj => obj.isCustom).length}</p>
          <p><span className="font-medium">Active:</span> {objects.filter(obj => obj.isActive).length}</p>
          <p><span className="font-medium">Total Records:</span> {objects.reduce((acc, obj) => acc + (obj.recordCount || 0), 0)}</p>
        </div>
      </div>
    </div>
  );
  
  return (
    <MainLayout 
      breadcrumbs={breadcrumbs}
      contextualSidebarContent={contextualSidebarContent}
    >
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{title}</h1>
          <div className="flex items-center gap-2">
            <Link to="/objects/create">
              <Button className="flex items-center gap-2">
                <FilePlus className="h-4 w-4" />
                <span>New Object</span>
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Filters and search */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search objects..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Tabs defaultValue="grid" value={currentView} onValueChange={(v) => setCurrentView(v as "grid" | "table")}>
              <TabsList>
                <TabsTrigger value="grid" className="flex items-center gap-1">
                  <Layout className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="table" className="flex items-center gap-1">
                  <Database className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {/* Grid view */}
        {currentView === "grid" && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <Card key={i} className="p-6 space-y-3">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-12 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </Card>
              ))
            ) : (
              filteredObjects.map(obj => (
                <Card key={obj.id} className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{obj.label}</h3>
                    <ObjectActions 
                      object={obj} 
                      onDelete={() => handleDeleteClick(obj)} 
                    />
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant={obj.isCustom ? "secondary" : "default"}>
                      {obj.isCustom ? "Custom" : "Standard"}
                    </Badge>
                    {!obj.isActive && (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </div>
                  {obj.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{obj.description}</p>
                  )}
                  <div className="flex justify-between items-center text-sm mt-4 text-muted-foreground">
                    <span>{obj.fields.length} fields</span>
                    <span>{obj.recordCount || 0} records</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Link to={`/objects/${obj.apiName}`}>
                      <Button variant="outline" className="w-full">Details</Button>
                    </Link>
                    <Link to={`/objects/${obj.apiName}/records`}>
                      <Button variant="secondary" className="w-full">Records</Button>
                    </Link>
                  </div>
                </Card>
              ))
            )}
            
            {filteredObjects.length === 0 && !isLoading && (
              <div className="col-span-3 p-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No objects found</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {searchTerm ? "Try adjusting your search term." : "Start by creating a new object."}
                </p>
                {!customOnly && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate("/objects/create")}
                  >
                    Create New Object
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Table view */}
        {currentView === "table" && (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead>API Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-center">Fields</TableHead>
                  <TableHead className="text-center">Records</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(6).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-5 w-8 mx-auto" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-5 w-8 mx-auto" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-5 w-16 mx-auto" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  filteredObjects.map(obj => (
                    <TableRow key={obj.id}>
                      <TableCell className="font-medium">{obj.label}</TableCell>
                      <TableCell>{obj.apiName}</TableCell>
                      <TableCell>
                        <Badge variant={obj.isCustom ? "secondary" : "default"}>
                          {obj.isCustom ? "Custom" : "Standard"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{obj.fields.length}</TableCell>
                      <TableCell className="text-center">{obj.recordCount || 0}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={obj.isActive ? "outline" : "destructive"} className="text-xs">
                          {obj.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <ObjectActions 
                          object={obj} 
                          onDelete={() => handleDeleteClick(obj)} 
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
                
                {filteredObjects.length === 0 && !isLoading && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <p className="text-muted-foreground">
                        {searchTerm ? "No objects matching your search." : "No objects found."}
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
      
      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Object</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the object "{objectToDelete?.label}"?
              This action cannot be undone and will also delete all related records and metadata.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}

interface ObjectActionsProps {
  object: MetadataObject;
  onDelete: () => void;
}

function ObjectActions({ object, onDelete }: ObjectActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link to={`/objects/${object.apiName}`} className="flex cursor-pointer items-center">
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={`/objects/${object.apiName}/fields`} className="flex cursor-pointer items-center">
            <Database className="mr-2 h-4 w-4" />
            Manage Fields
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={`/objects/${object.apiName}/records`} className="flex cursor-pointer items-center">
            <FileText className="mr-2 h-4 w-4" />
            View Records
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={`/objects/${object.apiName}/edit`} className="flex cursor-pointer items-center">
            <Edit className="mr-2 h-4 w-4" />
            Edit Object
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={onDelete}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Object
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}