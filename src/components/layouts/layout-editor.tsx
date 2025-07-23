import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GripVertical, Plus, Settings, Trash2, MoreHorizontal } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Mock data for fields
const mockFields = [
  { id: "1", label: "Project Name", type: "Text", required: true },
  { id: "2", label: "Status", type: "Picklist", required: true },
  { id: "3", label: "Due Date", type: "Date", required: false },
  { id: "4", label: "Priority", type: "Picklist", required: false },
  { id: "5", label: "Description", type: "Long Text Area", required: false },
];

const initialSections = [
  {
    id: "1",
    title: "Information",
    columns: 2,
    fields: ["1", "2", "3"],
  },
  {
    id: "2",
    title: "Details",
    columns: 1,
    fields: ["4", "5"],
  },
];

export function LayoutEditor({ layoutId, objectId }: { layoutId?: string, objectId?: string }) {
  const navigate = useNavigate();
  const [layoutName, setLayoutName] = useState("Project Layout");
  const [sections, setSections] = useState(initialSections);
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [showAddFieldDialog, setShowAddFieldDialog] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [layoutType, setLayoutType] = useState("record");

  // Stub drag-and-drop handlers
  const handleSectionDrag = () => {
    // TODO: Implement drag-and-drop for sections
    alert("Drag-and-drop for sections is not yet implemented.");
  };
  const handleFieldDrag = () => {
    // TODO: Implement drag-and-drop for fields
    alert("Drag-and-drop for fields is not yet implemented.");
  };

  // Add field to section
  const handleAddField = (fieldId: string) => {
    if (!selectedSectionId) return;
    setSections(sections.map(section =>
      section.id === selectedSectionId && !section.fields.includes(fieldId)
        ? { ...section, fields: [...section.fields, fieldId] }
        : section
    ));
    setShowAddFieldDialog(false);
    setSelectedSectionId(null);
  };

  // Function to handle adding a new section
  const addSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      title: "New Section",
      columns: 2,
      fields: [],
    };
    setSections([...sections, newSection]);
  };

  // Function to handle removing a section
  const removeSection = (sectionId: string) => {
    const updatedSections = sections.filter(section => section.id !== sectionId);
    setSections(updatedSections);
  };

  // Function to update section properties
  const updateSection = (sectionId: string, key: string, value: string | number) => {
    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        return { ...section, [key]: value };
      }
      return section;
    });
    setSections(updatedSections);
  };

  // Function to handle saving the layout
  const saveLayout = () => {
    console.log({
      name: layoutName,
      objectId,
      sections,
    });

    // In a real app, you'd save to your backend
    navigate(`/layouts`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {layoutId ? "Edit Page Layout" : "New Page Layout"}
        </h1>
        <p className="text-muted-foreground">
          {layoutId
            ? "Modify how fields are displayed on records"
            : "Design how fields are displayed on records"}
        </p>
      </div>

      {/* Layout Properties */}
      <Card>
        <CardHeader>
          <CardTitle>Layout Properties</CardTitle>
          <CardDescription>Configure basic layout settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="layout-name">Layout Name</Label>
                <Input
                  id="layout-name"
                  value={layoutName}
                  onChange={(e) => setLayoutName(e.target.value)}
                  placeholder="e.g. Project Layout"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="layout-type">Layout Type</Label>
                <Select defaultValue="record">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="record">Record Page</SelectItem>
                    <SelectItem value="list">List View</SelectItem>
                    <SelectItem value="detail">Detail View</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Layout Builder */}
      <Card>
        <CardHeader>
          <CardTitle>Layout Builder</CardTitle>
          <CardDescription>Drag and drop fields to customize the layout</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div key={section.id} className="border rounded-md p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" onClick={handleSectionDrag} />
                    <Input
                      value={section.title}
                      onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                      className="w-48"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select
                      value={section.columns.toString()}
                      onValueChange={(value) => updateSection(section.id, 'columns', parseInt(value))}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Column</SelectItem>
                        <SelectItem value="2">2 Columns</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeSection(section.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {/* Fields in this section */}
                {section.fields.map((fieldId) => {
                  const field = mockFields.find((f) => f.id === fieldId);
                  if (!field) return null;
                  return (
                    <div key={field.id} className="border rounded-lg p-3 bg-muted/20 flex justify-between items-center">
                      <div className="flex items-center">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move mr-2" onClick={handleFieldDrag} />
                        <div>
                          <p className="font-medium">{field.label}</p>
                          <p className="text-sm text-muted-foreground">{field.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {field.required && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Required</span>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => alert('Field settings coming soon!')}>Field Settings</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => alert('Remove from layout coming soon!')}>Remove from Layout</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
                {/* Add field placeholder */}
                <Button variant="ghost" className="h-full w-full flex items-center justify-center" onClick={() => { setShowAddFieldDialog(true); setSelectedSectionId(section.id); }}>
                  <Plus className="h-4 w-4 mr-2" /> Add Field
                </Button>
              </div>
            ))}
            {/* Add section button */}
            <Button
              variant="outline"
              onClick={addSection}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Section
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Add Field Dialog */}
      <Dialog open={showAddFieldDialog} onOpenChange={setShowAddFieldDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select a Field to Add</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {mockFields.map(field => (
              <Button key={field.id} variant="outline" className="w-full justify-start" onClick={() => handleAddField(field.id)}>
                {field.label} <span className="ml-2 text-xs text-muted-foreground">{field.type}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      {/* Buttons */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => navigate('/layouts')}>
          Cancel
        </Button>
        <Button onClick={saveLayout}>
          Save Layout
        </Button>
      </div>
      {/* Conditional rendering for layout types */}
      {layoutType === "compact" && (
        <div className="mt-6 p-4 border rounded bg-muted/30">
          <h2 className="text-lg font-bold mb-2">Compact Layout Preview</h2>
          <p className="text-muted-foreground">Only a subset of fields will be shown in compact layouts.</p>
        </div>
      )}
      {layoutType === "record" && (
        <div className="mt-6 p-4 border rounded bg-muted/30">
          <h2 className="text-lg font-bold mb-2">Record Layout Preview</h2>
          <p className="text-muted-foreground">Full record details are shown here.</p>
        </div>
      )}
      {layoutType === "detail" && (
        <div className="mt-6 p-4 border rounded bg-muted/30">
          <h2 className="text-lg font-bold mb-2">Detail Layout Preview</h2>
          <p className="text-muted-foreground">Detailed view for a single record.</p>
        </div>
      )}
    </div>
  );
}
