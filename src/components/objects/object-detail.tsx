import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustomObject, ObjectField } from "@/types";
import { PencilIcon, Trash2Icon, PlusIcon, LayoutIcon, ShieldIcon } from "lucide-react";
import { FieldsTable } from "./fields-table";
import { useNavigate } from "react-router-dom";

const mockObject: CustomObject = {
  id: "4",
  name: "Project_c",
  label: "Project",
  apiName: "Project__c",
  pluralLabel: "Projects",
  description: "Custom project tracking object for internal use",
  isCustom: true,
  isActive: true,
  fields: [
    {
      id: "1",
      objectId: "4",
      name: "Name",
      label: "Project Name",
      apiName: "Name",
      dataType: "Text",
      isRequired: true,
      isUnique: true,
      helpText: "Enter the name of the project",
      isCustom: false,
      isActive: true,
      createdAt: new Date("2023-05-15"),
      updatedAt: new Date("2023-05-15")
    },
    {
      id: "2",
      objectId: "4",
      name: "Status_c",
      label: "Status",
      apiName: "Status__c",
      dataType: "Picklist",
      isRequired: true,
      isUnique: false,
      defaultValue: "New",
      helpText: "Current status of the project",
      isCustom: true,
      isActive: true,
      createdAt: new Date("2023-05-15"),
      updatedAt: new Date("2023-06-10")
    },
    {
      id: "3",
      objectId: "4",
      name: "Due_Date_c",
      label: "Due Date",
      apiName: "Due_Date__c",
      dataType: "Date",
      isRequired: false,
      isUnique: false,
      helpText: "When the project is due",
      isCustom: true,
      isActive: true,
      createdAt: new Date("2023-05-15"),
      updatedAt: new Date("2023-05-15")
    },
    {
      id: "4",
      objectId: "4",
      name: "Priority_c",
      label: "Priority",
      apiName: "Priority__c",
      dataType: "Picklist",
      isRequired: false,
      isUnique: false,
      defaultValue: "Medium",
      helpText: "Priority level of the project",
      isCustom: true,
      isActive: true,
      createdAt: new Date("2023-05-15"),
      updatedAt: new Date("2023-05-15")
    },
    {
      id: "5",
      objectId: "4",
      name: "Description_c",
      label: "Description",
      apiName: "Description__c",
      dataType: "Long Text Area",
      isRequired: false,
      isUnique: false,
      helpText: "Detailed description of the project",
      isCustom: true,
      isActive: true,
      createdAt: new Date("2023-05-15"),
      updatedAt: new Date("2023-05-15")
    }
  ],
  createdAt: new Date("2023-05-15"),
  updatedAt: new Date("2023-06-20")
};

export function ObjectDetail({ objectId = "4" }: { objectId?: string }) {
  const navigate = useNavigate();
  const object = mockObject; // In a real app, fetch by objectId

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            {object.label}
            <Badge className="ml-2" variant={object.isCustom ? "outline" : "secondary"}>
              {object.isCustom ? "Custom" : "Standard"}
            </Badge>
          </h1>
          <p className="text-muted-foreground">{object.apiName}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => navigate(`/objects/edit/${object.id}`)}>
            <PencilIcon className="h-4 w-4 mr-2" /> Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate(`/layouts/edit/${object.id}`)}>
            <LayoutIcon className="h-4 w-4 mr-2" /> Layout
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate(`/security/object-permissions/${object.id}`)}>
            <ShieldIcon className="h-4 w-4 mr-2" /> Security
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Object Details</CardTitle>
          <CardDescription>Information about this object</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">API Name</p>
              <p className="text-sm text-muted-foreground">{object.apiName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Plural Label</p>
              <p className="text-sm text-muted-foreground">{object.pluralLabel}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Created</p>
              <p className="text-sm text-muted-foreground">{object.createdAt.toLocaleDateString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Last Modified</p>
              <p className="text-sm text-muted-foreground">{object.updatedAt.toLocaleDateString()}</p>
            </div>
            <div className="col-span-2 space-y-1">
              <p className="text-sm font-medium">Description</p>
              <p className="text-sm text-muted-foreground">{object.description || "No description provided."}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="fields">
        <TabsList className="mb-4">
          <TabsTrigger value="fields">Fields</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
          <TabsTrigger value="validation">Validation Rules</TabsTrigger>
          <TabsTrigger value="triggers">Triggers</TabsTrigger>
        </TabsList>

        <TabsContent value="fields" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => navigate(`/objects/fields/new/${object.id}`)}>
              <PlusIcon className="h-4 w-4 mr-2" /> New Field
            </Button>
          </div>

          <FieldsTable fields={object.fields} />
        </TabsContent>

        <TabsContent value="relationships">
          <div className="bg-muted/50 p-8 rounded-lg text-center">
            <h3 className="font-semibold mb-2">No Relationships Defined</h3>
            <p className="text-muted-foreground mb-4">This object doesn't have any relationships defined yet.</p>
            <Button onClick={() => navigate(`/objects/relationships/new/${object.id}`)}>
              <PlusIcon className="h-4 w-4 mr-2" /> Add Relationship
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="validation">
          <div className="bg-muted/50 p-8 rounded-lg text-center">
            <h3 className="font-semibold mb-2">No Validation Rules</h3>
            <p className="text-muted-foreground mb-4">Define validation rules to ensure data quality.</p>
            <Button onClick={() => navigate(`/objects/validation/new/${object.id}`)}>
              <PlusIcon className="h-4 w-4 mr-2" /> Add Validation Rule
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="triggers">
          <div className="bg-muted/50 p-8 rounded-lg text-center">
            <h3 className="font-semibold mb-2">No Triggers</h3>
            <p className="text-muted-foreground mb-4">Define triggers to automate actions.</p>
            <Button onClick={() => navigate(`/objects/triggers/new/${object.id}`)}>
              <PlusIcon className="h-4 w-4 mr-2" /> Add Trigger
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
