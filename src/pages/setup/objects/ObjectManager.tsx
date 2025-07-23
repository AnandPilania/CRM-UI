import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CRMObject } from "@/types";
import { Filter, Plus, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ObjectManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [objectType, setObjectType] = useState("All");

  // Sample data
  const standardObjects: CRMObject[] = [
    {
      id: "1",
      name: "Account",
      apiName: "Account",
      label: "Account",
      labelPlural: "Accounts",
      isCustom: false,
      description: "Companies and organizations",
      fields: [],
      createdAt: "2020-01-01T00:00:00.000Z",
      modifiedAt: "2020-01-01T00:00:00.000Z",
    },
    {
      id: "2",
      name: "Contact",
      apiName: "Contact",
      label: "Contact",
      labelPlural: "Contacts",
      isCustom: false,
      description: "Individual people associated with accounts",
      fields: [],
      createdAt: "2020-01-01T00:00:00.000Z",
      modifiedAt: "2020-01-01T00:00:00.000Z",
    },
    {
      id: "3",
      name: "Lead",
      apiName: "Lead",
      label: "Lead",
      labelPlural: "Leads",
      isCustom: false,
      description: "Prospects or potential opportunities",
      fields: [],
      createdAt: "2020-01-01T00:00:00.000Z",
      modifiedAt: "2020-01-01T00:00:00.000Z",
    },
    {
      id: "4",
      name: "Opportunity",
      apiName: "Opportunity",
      label: "Opportunity",
      labelPlural: "Opportunities",
      isCustom: false,
      description: "Pending deals or sales",
      fields: [],
      createdAt: "2020-01-01T00:00:00.000Z",
      modifiedAt: "2020-01-01T00:00:00.000Z",
    },
    {
      id: "5",
      name: "Case",
      apiName: "Case",
      label: "Case",
      labelPlural: "Cases",
      isCustom: false,
      description: "Customer support tickets or issues",
      fields: [],
      createdAt: "2020-01-01T00:00:00.000Z",
      modifiedAt: "2020-01-01T00:00:00.000Z",
    },
  ];

  const customObjects: CRMObject[] = [
    {
      id: "6",
      name: "Project",
      apiName: "Project__c",
      label: "Project",
      labelPlural: "Projects",
      isCustom: true,
      description: "Client projects",
      fields: [],
      createdAt: "2023-05-01T00:00:00.000Z",
      modifiedAt: "2023-05-15T00:00:00.000Z",
    },
    {
      id: "7",
      name: "Product",
      apiName: "Product__c",
      label: "Product",
      labelPlural: "Products",
      isCustom: true,
      description: "Products sold by the company",
      fields: [],
      createdAt: "2023-06-01T00:00:00.000Z",
      modifiedAt: "2023-06-15T00:00:00.000Z",
    },
  ];

  const allObjects = [...standardObjects, ...customObjects];

  const filteredObjects = allObjects
    .filter((obj) => {
      if (objectType === "Standard") return !obj.isCustom;
      if (objectType === "Custom") return obj.isCustom;
      return true;
    })
    .filter(
      (obj) =>
        obj.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obj.apiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obj.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Object Manager</h1>
          <p className="text-muted-foreground">
            Manage standard and custom objects in your CRM
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search objects..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setObjectType("All")}>
                  All Objects
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setObjectType("Standard")}>
                  Standard Objects
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setObjectType("Custom")}>
                  Custom Objects
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Object
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Custom Object</DialogTitle>
                <DialogDescription>
                  Define a new custom object for your CRM. Object names must be
                  unique.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="label" className="text-right">
                    Label
                  </Label>
                  <Input
                    id="label"
                    placeholder="Example: Project"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="plural-label" className="text-right">
                    Plural Label
                  </Label>
                  <Input
                    id="plural-label"
                    placeholder="Example: Projects"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="api-name" className="text-right">
                    API Name
                  </Label>
                  <Input
                    id="api-name"
                    placeholder="Example: Project__c"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    placeholder="Describe this object"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setIsCreating(false)}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="objects" className="w-full">
          <TabsList>
            <TabsTrigger value="objects">Objects</TabsTrigger>
            <TabsTrigger value="fields">Fields</TabsTrigger>
            <TabsTrigger value="relationships">Relationships</TabsTrigger>
          </TabsList>
          <TabsContent value="objects" className="border rounded-md mt-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead>API Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredObjects.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center"
                    >
                      No objects found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredObjects.map((obj) => (
                    <TableRow key={obj.id}>
                      <TableCell className="font-medium">{obj.label}</TableCell>
                      <TableCell>{obj.apiName}</TableCell>
                      <TableCell>
                        {obj.isCustom ? "Custom" : "Standard"}
                      </TableCell>
                      <TableCell>{obj.description}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="fields" className="border rounded-md p-4 mt-2">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Label>Select Object</Label>
                <Select>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Select an object" />
                  </SelectTrigger>
                  <SelectContent>
                    {standardObjects.map((obj) => (
                      <SelectItem key={obj.id} value={obj.apiName}>
                        {obj.label}
                      </SelectItem>
                    ))}
                    {customObjects.map((obj) => (
                      <SelectItem key={obj.id} value={obj.apiName}>
                        {obj.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline">View Fields</Button>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>No Object Selected</CardTitle>
                  <CardDescription>
                    Please select an object to view its fields
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="relationships" className="border rounded-md p-4 mt-2">
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Relationship Types</CardTitle>
                  <CardDescription>
                    Manage relationships between objects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Lookup Relationship
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        A lookup relationship links two objects together without affecting deletion behavior or security. 
                        You can create a lookup relationship between any two custom objects or between a custom object and a standard object.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Master-Detail Relationship
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        In a master-detail relationship, one object is the master and another is the detail. 
                        The master controls certain behaviors of the detail record, like record sharing and deletion.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Create New Relationship</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}