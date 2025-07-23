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
import { Field, FieldType } from "@/types";
import { Search, Plus, ArrowLeft, HelpCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Link, useParams } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function FieldManager() {
  const { objectApiName } = useParams<{ objectApiName: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreatingField, setIsCreatingField] = useState(false);
  const [selectedFieldType, setSelectedFieldType] = useState<FieldType | "">("");
  
  // Mock object data
  const objectName = objectApiName || "Account";
  const objectLabel = objectName.replace("__c", "").replace(/([A-Z])/g, ' $1').trim();

  // Sample data
  const standardFields: Field[] = [
    {
      id: "1",
      name: "Name",
      label: "Name",
      apiName: "Name",
      type: "Text",
      isCustom: false,
      isRequired: true,
      helpText: "Name of the record",
      description: "The primary identifier for this record",
    },
    {
      id: "2",
      name: "CreatedDate",
      label: "Created Date",
      apiName: "CreatedDate",
      type: "DateTime",
      isCustom: false,
      isRequired: true,
      helpText: "Date and time when the record was created",
    },
    {
      id: "3",
      name: "LastModifiedDate",
      label: "Last Modified Date",
      apiName: "LastModifiedDate",
      type: "DateTime",
      isCustom: false,
      isRequired: true,
      helpText: "Date and time when the record was last modified",
    },
    {
      id: "4",
      name: "OwnerId",
      label: "Owner",
      apiName: "OwnerId",
      type: "Lookup",
      isCustom: false,
      isRequired: true,
      helpText: "User who owns this record",
      relationshipObject: "User",
    },
  ];

  const customFields: Field[] = [
    {
      id: "5",
      name: "Industry",
      label: "Industry",
      apiName: "Industry__c",
      type: "Picklist",
      isCustom: true,
      isRequired: false,
      helpText: "Industry of the company",
      picklistValues: [
        { value: "technology", label: "Technology", isDefault: false, isActive: true },
        { value: "finance", label: "Finance", isDefault: false, isActive: true },
        { value: "healthcare", label: "Healthcare", isDefault: false, isActive: true },
        { value: "retail", label: "Retail", isDefault: false, isActive: true },
      ],
    },
    {
      id: "6",
      name: "AnnualRevenue",
      label: "Annual Revenue",
      apiName: "AnnualRevenue__c",
      type: "Currency",
      isCustom: true,
      isRequired: false,
      helpText: "Annual revenue of the company",
    },
  ];

  const allFields = [...standardFields, ...customFields];

  const filteredFields = allFields.filter(
    (field) =>
      field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.apiName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fieldTypes: FieldType[] = [
    "Text",
    "Number",
    "Date",
    "DateTime",
    "Checkbox",
    "Picklist",
    "MultiPicklist",
    "Lookup",
    "MasterDetail",
    "URL",
    "Email",
    "Phone",
    "TextArea",
    "LongTextArea",
    "RichText",
    "Currency",
    "Percent",
    "AutoNumber",
    "Formula",
    "Geolocation",
    "Encrypted",
  ];

  const renderFieldTypeForm = () => {
    switch (selectedFieldType) {
      case "Text":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="text-length" className="text-right">
                Length
              </Label>
              <Input
                id="text-length"
                type="number"
                defaultValue="255"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="text-default" className="text-right">
                Default Value
              </Label>
              <Input
                id="text-default"
                placeholder="Default value"
                className="col-span-3"
              />
            </div>
          </>
        );

      case "Picklist":
        return (
          <>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Values</Label>
              <div className="col-span-3 space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input placeholder={`Value ${i}`} />
                    <Input placeholder={`Label ${i}`} />
                    <Checkbox id={`default-${i}`} />
                    <Label htmlFor={`default-${i}`}>Default</Label>
                  </div>
                ))}
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Value
                </Button>
              </div>
            </div>
          </>
        );

      case "Lookup":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="related-object" className="text-right">
                Related To
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select object" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="account">Account</SelectItem>
                  <SelectItem value="contact">Contact</SelectItem>
                  <SelectItem value="opportunity">Opportunity</SelectItem>
                  <SelectItem value="case">Case</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case "Formula":
        return (
          <>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="formula-return-type" className="text-right">
                Return Type
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select return type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="datetime">DateTime</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                  <SelectItem value="currency">Currency</SelectItem>
                  <SelectItem value="percent">Percent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="formula-expression" className="text-right">
                Formula Expression
              </Label>
              <Textarea
                id="formula-expression"
                placeholder="Enter your formula"
                className="col-span-3"
                rows={5}
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/setup/objects/manager">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{objectLabel} Fields</h1>
            <p className="text-muted-foreground">
              Manage fields for the {objectLabel} object
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search fields..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isCreatingField} onOpenChange={setIsCreatingField}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Field
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Custom Field</DialogTitle>
                <DialogDescription>
                  Add a new custom field to the {objectLabel} object
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="field-label" className="text-right">
                    Field Label
                  </Label>
                  <Input
                    id="field-label"
                    placeholder="Example: Annual Revenue"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="field-name" className="text-right">
                    API Name
                  </Label>
                  <div className="relative col-span-3">
                    <Input
                      id="field-name"
                      placeholder="Example: AnnualRevenue"
                      className="pr-12"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                      __c
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="field-type" className="text-right">
                    Data Type
                  </Label>
                  <Select
                    value={selectedFieldType}
                    onValueChange={(value) => setSelectedFieldType(value as FieldType)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a field type" />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="field-help-text" className="text-right">
                    Help Text
                  </Label>
                  <Input
                    id="field-help-text"
                    placeholder="Help text for this field"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="field-description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="field-description"
                    placeholder="Describe this field"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="col-span-1"></div>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Checkbox id="field-required" />
                    <Label htmlFor="field-required">Required</Label>
                  </div>
                </div>
                {selectedFieldType && renderFieldTypeForm()}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreatingField(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setIsCreatingField(false)}>
                  Create Field
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="standard">Standard Fields</TabsTrigger>
            <TabsTrigger value="custom">Custom Fields</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="border rounded-md mt-2">
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
                {filteredFields.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No fields found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFields.map((field) => (
                    <TableRow key={field.id}>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {field.label}
                          {field.helpText && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  {field.helpText}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{field.apiName}</TableCell>
                      <TableCell>{field.type}</TableCell>
                      <TableCell>
                        {field.isRequired ? "Yes" : "No"}
                      </TableCell>
                      <TableCell className="text-right">
                        {!field.isCustom ? (
                          <Button variant="ghost" size="sm" disabled>
                            Standard Field
                          </Button>
                        ) : (
                          <>
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500">
                              Delete
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="standard" className="border rounded-md mt-2">
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
                {standardFields
                  .filter((field) =>
                    field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    field.apiName.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((field) => (
                    <TableRow key={field.id}>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {field.label}
                          {field.helpText && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  {field.helpText}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{field.apiName}</TableCell>
                      <TableCell>{field.type}</TableCell>
                      <TableCell>
                        {field.isRequired ? "Yes" : "No"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" disabled>
                          Standard Field
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="custom" className="border rounded-md mt-2">
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
                {customFields
                  .filter((field) =>
                    field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    field.apiName.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((field) => (
                    <TableRow key={field.id}>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {field.label}
                          {field.helpText && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  {field.helpText}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{field.apiName}</TableCell>
                      <TableCell>{field.type}</TableCell>
                      <TableCell>
                        {field.isRequired ? "Yes" : "No"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500">
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}