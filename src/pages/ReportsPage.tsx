import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  PieChart,
  BarChart2,
  LineChart,
  PencilIcon,
  ArrowUpDown,
  MoreHorizontal,
  Plus,
  FileText,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ReportEditor } from "@/components/reports/report-editor";

const standardReports = [
  {
    id: "1",
    name: "All Accounts",
    folder: "Accounts",
    type: "Tabular",
    lastRun: "2023-10-15",
    createdBy: "System Administrator",
    icon: <FileText className="h-4 w-4 mr-2" />,
  },
  {
    id: "2",
    name: "Contacts by Account",
    folder: "Contacts",
    type: "Summary",
    lastRun: "2023-10-10",
    createdBy: "System Administrator",
    icon: <BarChart className="h-4 w-4 mr-2" />,
  },
  {
    id: "3",
    name: "Opportunity Pipeline",
    folder: "Opportunities",
    type: "Matrix",
    lastRun: "2023-10-20",
    createdBy: "System Administrator",
    icon: <BarChart2 className="h-4 w-4 mr-2" />,
  },
];

const customReports = [
  {
    id: "4",
    name: "Projects by Status",
    folder: "Projects",
    type: "Summary",
    lastRun: "2023-10-18",
    createdBy: "John Doe",
    icon: <BarChart className="h-4 w-4 mr-2" />,
  },
  {
    id: "5",
    name: "Task Completion Trends",
    folder: "Tasks",
    type: "Line Chart",
    lastRun: "2023-10-05",
    createdBy: "Jane Smith",
    icon: <LineChart className="h-4 w-4 mr-2" />,
  },
  {
    id: "6",
    name: "Priority Distribution",
    folder: "Projects",
    type: "Pie Chart",
    lastRun: "2023-10-12",
    createdBy: "John Doe",
    icon: <PieChart className="h-4 w-4 mr-2" />,
  },
];

export default function ReportsPage() {
  const navigate = useNavigate();
  const { reportId, reportType } = useParams<{
    reportId: string;
    reportType: string;
  }>();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const isViewReport = location.pathname.includes('/reports/view/');
  const isEditReport = location.pathname.includes('/reports/edit/');
  const isNewReport = location.pathname.includes('/reports/new');

  // If we're viewing, editing, or creating a report, show the report editor
  if (isViewReport || isEditReport || isNewReport) {
    return <ReportEditor reportId={reportId} />;
  }

  const filteredStandard = standardReports.filter(report =>
    report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.folder.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCustom = customReports.filter(report =>
    report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.folder.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Determine which reports to show based on the reportType param
  const getReportsToShow = () => {
    if (reportType === 'standard') return filteredStandard;
    if (reportType === 'custom') return filteredCustom;
    return [...filteredStandard, ...filteredCustom];
  };

  const reportsToShow = getReportsToShow();

  const handleCloneReport = (report) => {
    alert(`Clone report '${report.name}' coming soon!`);
  };
  const handleRunReport = (report) => {
    alert(`Run report '${report.name}' coming soon!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            View and analyze data with customizable reports
          </p>
        </div>
        <Button onClick={() => navigate("/reports/new")}>
          <Plus className="h-4 w-4 mr-2" /> New Report
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" value={reportType || "all"}>
        <TabsList>
          <TabsTrigger value="all" onClick={() => navigate("/reports")}>All</TabsTrigger>
          <TabsTrigger value="standard" onClick={() => navigate("/reports/standard")}>Standard Reports</TabsTrigger>
          <TabsTrigger value="custom" onClick={() => navigate("/reports/custom")}>Custom Reports</TabsTrigger>
          <TabsTrigger value="dashboard" onClick={() => navigate("/reports/dashboard")}>Dashboard</TabsTrigger>
          <TabsTrigger value="recent">Recently Viewed</TabsTrigger>
        </TabsList>

        <TabsContent value={reportType || "all"} className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">
                      <div className="flex items-center space-x-1">
                        <span>Report Name</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Folder</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Last Run</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportsToShow.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          {report.icon}
                          <span className="cursor-pointer hover:underline" onClick={() => navigate(`/reports/view/${report.id}`)}>
                            {report.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{report.folder}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{report.type}</Badge>
                      </TableCell>
                      <TableCell>{report.lastRun}</TableCell>
                      <TableCell>{report.createdBy}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleRunReport(report)}>
                              Run Report
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/reports/edit/${report.id}`)}>
                              <PencilIcon className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCloneReport(report)}>
                              Clone
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard</CardTitle>
              <CardDescription>Visualize your key metrics and reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-muted-foreground mb-4">Dashboard feature coming soon...</p>
                <Button variant="outline" disabled>New Dashboard</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
