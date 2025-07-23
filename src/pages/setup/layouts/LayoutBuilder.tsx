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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Layout, Field, LayoutSection, LayoutItem } from "@/types";
import { ArrowLeft, Grip, Plus, Save, Trash2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function LayoutBuilder() {
  const { objectApiName, layoutId } = useParams<{
    objectApiName: string;
    layoutId: string;
  }>();
  const [draggedField, setDraggedField] = useState<string | null>(null);
  const [draggedOver, setDraggedOver] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [showSectionDialog, setShowSectionDialog] = useState(false);
  const [isDraggingSection, setIsDraggingSection] = useState(false);

  // Mock object data
  const objectName = objectApiName || "Account";
  const objectLabel = objectName.replace("__c", "").replace(/([A-Z])/g, ' $1').trim();
  
  // Mock field data
  const availableFields: Field[] = [
    {
      id: "1",
      name: "Name",
      label: "Name",
      apiName: "Name",
      type: "Text",
      isCustom: false,
      isRequired: true,
    },
    {
      id: "2",
      name: "Industry",
      label: "Industry",
      apiName: "Industry__c",
      type: "Picklist",
      isCustom: true,
      isRequired: false,
    },
    {
      id: "3",
      name: "Phone",
      label: "Phone",
      apiName: "Phone",
      type: "Phone",
      isCustom: false,
      isRequired: false,
    },
    {
      id: "4",
      name: "Website",
      label: "Website",
      apiName: "Website",
      type: "URL",
      isCustom: false,
      isRequired: false,
    },
    {
      id: "5",
      name: "Description",
      label: "Description",
      apiName: "Description",
      type: "LongTextArea",
      isCustom: false,
      isRequired: false,
    },
    {
      id: "6",
      name: "AnnualRevenue",
      label: "Annual Revenue",
      apiName: "AnnualRevenue__c",
      type: "Currency",
      isCustom: true,
      isRequired: false,
    },
    {
      id: "7",
      name: "NumberOfEmployees",
      label: "Employees",
      apiName: "NumberOfEmployees",
      type: "Number",
      isCustom: false,
      isRequired: false,
    },
    {
      id: "8",
      name: "CreatedDate",
      label: "Created Date",
      apiName: "CreatedDate",
      type: "DateTime",
      isCustom: false,
      isRequired: true,
    },
  ];

  // Mock layout data
  const [layout, setLayout] = useState<Layout>({
    id: layoutId || "1",
    name: "Standard Layout",
    objectApiName: objectName,
    sections: [
      {
        id: "section-1",
        heading: "Account Information",
        columns: 2,
        isCollapsible: true,
        isCollapsed: false,
        layoutItems: [
          [
            { fieldApiName: "Name", isRequired: true, isReadOnly: false },
            { fieldApiName: "Industry__c", isRequired: false, isReadOnly: false },
            { fieldApiName: "Phone", isRequired: false, isReadOnly: false },
          ],
          [
            { fieldApiName: "Website", isRequired: false, isReadOnly: false },
            { fieldApiName: "NumberOfEmployees", isRequired: false, isReadOnly: false },
            { fieldApiName: "AnnualRevenue__c", isRequired: false, isReadOnly: false },
          ],
        ],
      },
      {
        id: "section-2",
        heading: "System Information",
        columns: 2,
        isCollapsible: true,
        isCollapsed: false,
        layoutItems: [
          [
            { fieldApiName: "CreatedDate", isRequired: true, isReadOnly: true },
          ],
          [],
        ],
      },
    ],
    buttons: [
      { name: "Save", label: "Save", position: "Top" },
      { name: "Edit", label: "Edit", position: "Top" },
      { name: "Delete", label: "Delete", position: "Top" },
    ],
    relatedLists: [
      {
        objectApiName: "Contact",
        fields: ["Name", "Email", "Phone"],
        buttons: ["New"],
      },
      {
        objectApiName: "Opportunity",
        fields: ["Name", "Amount", "CloseDate", "StageName"],
        buttons: ["New"],
      },
    ],
    createdAt: "2023-01-01T00:00:00.000Z",
    modifiedAt: "2023-01-01T00:00:00.000Z",
    assignedProfiles: ["System Administrator", "Sales User"],
  });

  const handleDragStart = (fieldApiName: string) => {
    setDraggedField(fieldApiName);
  };

  const handleDragOver = (e: React.DragEvent, sectionId: string, columnIndex: number, itemIndex: number) => {
    e.preventDefault();
    setDraggedOver(`${sectionId}-${columnIndex}-${itemIndex}`);
  };

  const handleDrop = (e: React.DragEvent, sectionId: string, columnIndex: number, itemIndex: number) => {
    e.preventDefault();

    if (!draggedField) return;

    const field = availableFields.find(f => f.apiName === draggedField);
    if (!field) return;
    
    const newLayout = { ...layout };
    const sectionIndex = newLayout.sections.findIndex(s => s.id === sectionId);
    
    if (sectionIndex === -1) return;

    // Create new layout item
    const newItem: LayoutItem = {
      fieldApiName: field.apiName,
      isRequired: field.isRequired,
      isReadOnly: false,
    };

    // Insert at the drop position
    const currentItems = [...newLayout.sections[sectionIndex].layoutItems[columnIndex]];
    currentItems.splice(itemIndex, 0, newItem);
    newLayout.sections[sectionIndex].layoutItems[columnIndex] = currentItems;

    setLayout(newLayout);
    setDraggedField(null);
    setDraggedOver(null);
  };

  const handleRemoveField = (sectionId: string, columnIndex: number, itemIndex: number) => {
    const newLayout = { ...layout };
    const sectionIndex = newLayout.sections.findIndex(s => s.id === sectionId);
    
    if (sectionIndex === -1) return;

    newLayout.sections[sectionIndex].layoutItems[columnIndex].splice(itemIndex, 1);
    setLayout(newLayout);
  };

  const handleAddSection = () => {
    const newSection: LayoutSection = {
      id: `section-${Date.now()}`,
      heading: "New Section",
      columns: 2,
      isCollapsible: true,
      isCollapsed: false,
      layoutItems: [[], []],
    };

    const newLayout = { ...layout };
    newLayout.sections.push(newSection);
    setLayout(newLayout);
    setShowSectionDialog(false);
  };

  const handleSectionDragStart = (e: React.DragEvent, sectionId: string) => {
    e.dataTransfer.setData('text/plain', sectionId);
    setIsDraggingSection(true);
  };

  const handleSectionDragOver = (e: React.DragEvent) => {
    if (isDraggingSection) {
      e.preventDefault();
    }
  };

  const handleSectionDrop = (e: React.DragEvent, targetSectionId: string) => {
    if (!isDraggingSection) return;
    
    e.preventDefault();
    const sourceSectionId = e.dataTransfer.getData('text/plain');
    
    const newLayout = { ...layout };
    const sections = [...newLayout.sections];
    const sourceIndex = sections.findIndex(s => s.id === sourceSectionId);
    const targetIndex = sections.findIndex(s => s.id === targetSectionId);
    
    if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) return;
    
    // Reorder sections
    const [movedSection] = sections.splice(sourceIndex, 1);
    sections.splice(targetIndex, 0, movedSection);
    
    newLayout.sections = sections;
    setLayout(newLayout);
    setIsDraggingSection(false);
  };

  const getFieldLabel = (apiName: string): string => {
    const field = availableFields.find(f => f.apiName === apiName);
    return field ? field.label : apiName;
  };

  const getFieldInLayout = (fieldApiName: string): boolean => {
    return layout.sections.some(section =>
      section.layoutItems.some(column =>
        column.some(item => item.fieldApiName === fieldApiName)
      )
    );
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/setup/layouts/assignments">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Page Layout Editor</h1>
              <p className="text-muted-foreground">
                {objectLabel} - {layout.name}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Layout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="related-lists">Related Lists</TabsTrigger>
                <TabsTrigger value="buttons">Buttons</TabsTrigger>
                <TabsTrigger value="mobile">Mobile</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="border rounded-md mt-2 p-4 min-h-[600px] bg-muted/30">
                <div className="space-y-4">
                  {layout.sections.map((section, sectionIndex) => (
                    <Card 
                      key={section.id}
                      className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors"
                      draggable
                      onDragStart={(e) => handleSectionDragStart(e, section.id)}
                      onDragOver={handleSectionDragOver}
                      onDrop={(e) => handleSectionDrop(e, section.id)}
                    >
                      <CardHeader className="bg-muted/50 cursor-move flex flex-row items-center justify-between p-3">
                        <div className="flex items-center">
                          <Grip className="h-4 w-4 mr-2 text-muted-foreground" />
                          <CardTitle className="text-base">{section.heading}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select defaultValue={section.columns.toString()}>
                            <SelectTrigger className="w-[120px] h-8">
                              <SelectValue placeholder="Columns" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 Column</SelectItem>
                              <SelectItem value="2">2 Columns</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3">
                        <div className={`grid ${section.columns === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
                          {Array.from({ length: section.columns }).map((_, columnIndex) => (
                            <div
                              key={`${section.id}-col-${columnIndex}`}
                              className="border border-dashed rounded-md p-2 min-h-[100px]"
                            >
                              {section.layoutItems[columnIndex]?.map((item, itemIndex) => (
                                <div
                                  key={`${section.id}-col-${columnIndex}-item-${itemIndex}`}
                                  className={cn(
                                    "flex items-center justify-between mb-1 p-2 rounded cursor-move bg-card hover:bg-accent",
                                    draggedOver === `${section.id}-${columnIndex}-${itemIndex}` && "border-2 border-primary"
                                  )}
                                  draggable
                                  onDragStart={() => handleDragStart(item.fieldApiName)}
                                  onDragOver={(e) => handleDragOver(e, section.id, columnIndex, itemIndex)}
                                  onDrop={(e) => handleDrop(e, section.id, columnIndex, itemIndex)}
                                >
                                  <div className="flex items-center">
                                    <Grip className="h-3 w-3 mr-2 text-muted-foreground" />
                                    <span>{getFieldLabel(item.fieldApiName)}</span>
                                  </div>
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-5 w-5 opacity-0 group-hover:opacity-100"
                                    onClick={() => handleRemoveField(section.id, columnIndex, itemIndex)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                              <div
                                className={cn(
                                  "border border-dashed rounded p-2 text-center text-xs text-muted-foreground",
                                  draggedOver === `${section.id}-${columnIndex}-${section.layoutItems[columnIndex]?.length || 0}` && "border-2 border-primary"
                                )}
                                onDragOver={(e) => handleDragOver(e, section.id, columnIndex, section.layoutItems[columnIndex]?.length || 0)}
                                onDrop={(e) => handleDrop(e, section.id, columnIndex, section.layoutItems[columnIndex]?.length || 0)}
                              >
                                Drop field here
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-dashed" 
                    onClick={() => setShowSectionDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Section
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="related-lists" className="border rounded-md mt-2 p-4 min-h-[600px]">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Related Lists</h3>
                  
                  <div className="grid gap-4">
                    {layout.relatedLists.map((relatedList, index) => (
                      <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between py-3">
                          <CardTitle className="text-base">{relatedList.objectApiName}</CardTitle>
                          <Button size="icon" variant="ghost">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4">
                            <div>
                              <Label>Fields to Display</Label>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {relatedList.fields.map((field, i) => (
                                  <div key={i} className="bg-muted py-1 px-2 rounded text-sm flex items-center gap-1">
                                    {field}
                                    <Button size="icon" variant="ghost" className="h-4 w-4 ml-1">
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                                <Button variant="outline" size="sm">
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add
                                </Button>
                              </div>
                            </div>
                            <div>
                              <Label>Buttons</Label>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {relatedList.buttons.map((button, i) => (
                                  <div key={i} className="bg-muted py-1 px-2 rounded text-sm flex items-center gap-1">
                                    {button}
                                    <Button size="icon" variant="ghost" className="h-4 w-4 ml-1">
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                                <Button variant="outline" size="sm">
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Related List
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="buttons" className="border rounded-md mt-2 p-4 min-h-[600px]">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Button Customization</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Top Buttons</CardTitle>
                        <CardDescription>Buttons displayed at the top of the record</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {layout.buttons
                            .filter(b => b.position === 'Top')
                            .map((button, i) => (
                              <div key={i} className="flex items-center justify-between border rounded p-2">
                                <span>{button.label}</span>
                                <div>
                                  <Button variant="ghost" size="sm">
                                    <Grip className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          <Button variant="outline" size="sm" className="w-full">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Button
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Bottom Buttons</CardTitle>
                        <CardDescription>Buttons displayed at the bottom of the record</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {layout.buttons
                            .filter(b => b.position === 'Bottom')
                            .map((button, i) => (
                              <div key={i} className="flex items-center justify-between border rounded p-2">
                                <span>{button.label}</span>
                                <div>
                                  <Button variant="ghost" size="sm">
                                    <Grip className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          <Button variant="outline" size="sm" className="w-full">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Button
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="mobile" className="border rounded-md mt-2 p-4 min-h-[600px]">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="max-w-md">
                    <h3 className="text-lg font-medium">Mobile Layout Configuration</h3>
                    <p className="text-muted-foreground mt-2">
                      Configure how this layout appears on mobile devices. You can select which fields
                      are visible and their order on mobile screens.
                    </p>
                    <Button className="mt-4">Configure Mobile Layout</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Available Fields</CardTitle>
                <CardDescription>Drag fields to the layout</CardDescription>
                <Input
                  placeholder="Search fields..."
                  className="mt-2"
                />
              </CardHeader>
              <CardContent className="max-h-[500px] overflow-y-auto">
                <div className="space-y-1">
                  {availableFields.map(field => (
                    <div
                      key={field.id}
                      className={cn(
                        "flex items-center justify-between p-2 rounded-md cursor-move hover:bg-accent",
                        getFieldInLayout(field.apiName) && "opacity-50"
                      )}
                      draggable={!getFieldInLayout(field.apiName)}
                      onDragStart={() => handleDragStart(field.apiName)}
                    >
                      <div className="flex items-center">
                        <Grip className="h-3 w-3 mr-2 text-muted-foreground" />
                        <span>{field.label}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{field.type}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showSectionDialog} onOpenChange={setShowSectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Section</DialogTitle>
            <DialogDescription>
              Create a new section in the page layout
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="section-name" className="text-right">
                Section Name
              </Label>
              <Input
                id="section-name"
                placeholder="Enter section name"
                className="col-span-3"
                defaultValue="New Section"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="section-columns" className="text-right">
                Number of Columns
              </Label>
              <Select defaultValue="2">
                <SelectTrigger id="section-columns" className="col-span-3">
                  <SelectValue placeholder="Select columns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Column</SelectItem>
                  <SelectItem value="2">2 Columns</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSectionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSection}>Add Section</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}