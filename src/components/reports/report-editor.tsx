import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronRight, Filter, Plus, SortAsc } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const mockObjects = [
  { value: "1", label: "Account" },
  { value: "2", label: "Contact" },
  { value: "3", label: "Opportunity" },
  { value: "4", label: "Project__c" },
  { value: "5", label: "Task__c" },
];

const mockFields = {
  "1": [ // Account fields
    { id: "1_1", name: "Name", label: "Account Name", type: "Text" },
    { id: "1_2", name: "Industry", label: "Industry", type: "Picklist" },
    { id: "1_3", name: "AnnualRevenue", label: "Annual Revenue", type: "Currency" },
    { id: "1_4", name: "Type", label: "Type", type: "Picklist" },
  ],
  "2": [ // Contact fields
    { id: "2_1", name: "FirstName", label: "First Name", type: "Text" },
    { id: "2_2", name: "LastName", label: "Last Name", type: "Text" },
    { id: "2_3", name: "Email", label: "Email", type: "Email" },
    { id: "2_4", name: "Phone", label: "Phone", type: "Phone" },
  ],
  "4": [ // Project fields
    { id: "4_1", name: "Name", label: "Project Name", type: "Text" },
    { id: "4_2", name: "Status__c", label: "Status", type: "Picklist" },
    { id: "4_3", name: "Due_Date__c", label: "Due Date", type: "Date" },
    { id: "4_4", name: "Priority__c", label: "Priority", type: "Picklist" },
  ],
};

export function ReportEditor({ reportId }: { reportId?: string }) {
  const navigate = useNavigate();
  const isEdit = !!reportId;

  // For an actual implementation, you'd fetch this data for editing
  const defaultReportName = isEdit ? "Open Projects by Status" : "";
  const defaultDescription = isEdit ? "Shows all open projects grouped by status" : "";
  const defaultObjectId = isEdit ? "4" : "";

  // Stub state for selected columns
  const [selectedColumns, setSelectedColumns] = useState([
    ...(isEdit ? [
      { id: "4_1", label: "Project Name" },
      { id: "4_2", label: "Status" },
      { id: "4_3", label: "Due Date" },
      { id: "4_4", label: "Priority" },
    ] : [])
  ]);

  const handleAddColumn = () => {
    // Add a mock column for demonstration
    setSelectedColumns(cols => [...cols, { id: `mock_${cols.length + 1}`, label: `Mock Column ${cols.length + 1}` }]);
  };
  const handleDragColumn = () => {
    alert("Drag-and-drop to reorder columns is not yet implemented.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{isEdit ? "Edit Report" : "New Report"}</h1>
        <p className="text-muted-foreground">
          {isEdit
            ? "Modify an existing report"
            : "Create a custom report to analyze your data"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Properties</CardTitle>
          <CardDescription>Set up the basic properties of your report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="report-name">Report Name</Label>
                <Input
                  id="report-name"
                  placeholder="e.g. Open Projects by Status"
                  defaultValue={defaultReportName}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="report-type">Report Type</Label>
                <Select defaultValue="tabular">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tabular">Tabular Report</SelectItem>
                    <SelectItem value="summary">Summary Report</SelectItem>
                    <SelectItem value="matrix">Matrix Report</SelectItem>
                    <SelectItem value="joined">Joined Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-description">Description</Label>
              <Textarea
                id="report-description"
                placeholder="Enter a description for this report"
                defaultValue={defaultDescription}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-object">Primary Object</Label>
              <Select defaultValue={defaultObjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an object" />
                </SelectTrigger>
                <SelectContent>
                  {mockObjects.map((obj) => (
                    <SelectItem key={obj.value} value={obj.value}>
                      {obj.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="columns">
        <TabsList>
          <TabsTrigger value="columns">Columns</TabsTrigger>
          <TabsTrigger value="filters">Filters</TabsTrigger>
          <TabsTrigger value="grouping">Grouping</TabsTrigger>
          <TabsTrigger value="sorting">Sorting</TabsTrigger>
        </TabsList>

        <TabsContent value="columns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Columns</CardTitle>
              <CardDescription>Select fields to display in your report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="font-medium">Available Fields</div>
                  <div className="border rounded-md h-80 overflow-y-auto">
                    <div className="p-2">
                      <div className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md cursor-pointer">
                        <ChevronRight className="h-4 w-4" />
                        <span className="font-medium">Project</span>
                      </div>
                      {mockFields["4"].map((field) => (
                        <div
                          key={field.id}
                          className="flex items-center space-x-2 p-2 pl-6 hover:bg-muted rounded-md cursor-pointer"
                          onClick={handleAddColumn}
                        >
                          <span>{field.label}</span>
                          <span className="text-xs text-muted-foreground">({field.type})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="font-medium">Selected Columns</div>
                  <div className="border rounded-md h-80 overflow-y-auto">
                    {selectedColumns.length > 0 ? (
                      <Table>
                        <TableBody>
                          {selectedColumns.map((col, idx) => (
                            <TableRow key={col.id}>
                              <TableCell>
                                <span className="cursor-move" onClick={handleDragColumn}>{col.label}</span>
                              </TableCell>
                              <TableCell className="w-24 text-right">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                        <p className="text-muted-foreground mb-4">
                          Drag fields from the left or click to add columns to your report
                        </p>
                        <Button variant="outline" onClick={handleAddColumn}>
                          <Plus className="h-4 w-4 mr-2" /> Add Column
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="filters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Filters</CardTitle>
              <CardDescription>Define criteria to filter your report data</CardDescription>
            </CardHeader>
            <CardContent>
              {isEdit ? (
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <span>Status equals "Open"</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">Remove</Button>
                      </div>
                    </div>
                  </div>
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <span>Due Date greater than TODAY</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">Remove</Button>
                      </div>
                    </div>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" /> Add Filter
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    No filters defined yet. Add a filter to narrow down the results.
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" /> Add Filter
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grouping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Grouping</CardTitle>
              <CardDescription>Group your data for better analysis</CardDescription>
            </CardHeader>
            <CardContent>
              {isEdit ? (
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Group By:</span>
                        <span>Status</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">Remove</Button>
                      </div>
                    </div>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" /> Add Grouping
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    No grouping defined yet. Add grouping to organize your data.
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" /> Add Grouping
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sorting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Sorting</CardTitle>
              <CardDescription>Define the order of your report data</CardDescription>
            </CardHeader>
            <CardContent>
              {isEdit ? (
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <SortAsc className="h-4 w-4 text-muted-foreground" />
                        <span>Sort by Due Date (Ascending)</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">Remove</Button>
                      </div>
                    </div>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" /> Add Sorting
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    No sorting defined yet. Add sorting to organize your results.
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" /> Add Sorting
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => navigate('/reports')}>
          Cancel
        </Button>
        <Button onClick={() => navigate('/reports')}>
          {isEdit ? "Save Changes" : "Save Report"}
        </Button>
      </div>
    </div>
  );
}
