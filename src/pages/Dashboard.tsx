import React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useMetadata } from "@/contexts/metadata-context";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, BarChart, PieChart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { objects, isLoading } = useMetadata();
  
  // Calculate counts for dashboard metrics
  const standardObjectCount = objects.filter(obj => !obj.isCustom).length;
  const customObjectCount = objects.filter(obj => obj.isCustom).length;
  const totalRecordCount = objects.reduce((acc, obj) => acc + (obj.recordCount || 0), 0);
  
  const recentObjects = [...objects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);
  
  return (
    <MainLayout breadcrumbs={[{ label: "Dashboard" }]}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Link to="/objects/create">
            <Button>Create Object</Button>
          </Link>
          <Link to="/reports/create">
            <Button variant="outline">Create Report</Button>
          </Link>
        </div>
      </div>
      
      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <DashboardCard 
          title="Standard Objects" 
          value={isLoading ? null : standardObjectCount}
          description="Total standard objects" 
          href="/objects/standard"
        />
        <DashboardCard 
          title="Custom Objects" 
          value={isLoading ? null : customObjectCount}
          description="Total custom objects" 
          href="/objects/custom"
        />
        <DashboardCard 
          title="Total Records" 
          value={isLoading ? null : totalRecordCount}
          description="Across all objects" 
          href="/objects"
        />
        <DashboardCard 
          title="Reports" 
          value={isLoading ? null : 12}
          description="Available reports" 
          href="/reports"
        />
      </div>
      
      {/* Analytics section */}
      <div className="mb-8">
        <Tabs defaultValue="activity">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Analytics</h2>
            <TabsList>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                Activity
              </TabsTrigger>
              <TabsTrigger value="objects" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                Object Usage
              </TabsTrigger>
              <TabsTrigger value="distribution" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Distribution
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>System activity over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center bg-muted/20">
                <div className="text-center">
                  <p className="text-muted-foreground">Activity chart will be displayed here</p>
                  <p className="text-xs text-muted-foreground mt-1">Showing data trends over time</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="objects" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Object Usage</CardTitle>
                <CardDescription>Record count by object type</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center bg-muted/20">
                <div className="text-center">
                  <p className="text-muted-foreground">Object usage chart will be displayed here</p>
                  <p className="text-xs text-muted-foreground mt-1">Comparing record counts across objects</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="distribution" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Distribution</CardTitle>
                <CardDescription>Relative proportion of record types</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center bg-muted/20">
                <div className="text-center">
                  <p className="text-muted-foreground">Distribution chart will be displayed here</p>
                  <p className="text-xs text-muted-foreground mt-1">Showing proportional representation</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Recent objects */}
      <div>
        <h2 className="text-xl font-bold mb-4">Recently Modified Objects</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-3 w-4/5" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))
          ) : (
            recentObjects.map(obj => (
              <Card key={obj.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle>{obj.label}</CardTitle>
                  <CardDescription>
                    {obj.isCustom ? "Custom Object" : "Standard Object"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-1">
                    <span className="font-medium">API Name:</span> {obj.apiName}
                  </p>
                  <p className="text-sm mb-1">
                    <span className="font-medium">Fields:</span> {obj.fields.length}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Records:</span> {obj.recordCount || 0}
                  </p>
                </CardContent>
                <CardFooter>
                  <Link to={`/objects/${obj.apiName}`} className="w-full">
                    <Button variant="secondary" className="w-full">View Object</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}

interface DashboardCardProps {
  title: string;
  value: number | null;
  description: string;
  href?: string;
}

function DashboardCard({ title, value, description, href }: DashboardCardProps) {
  const content = (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {value === null ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <p className="text-3xl font-bold">{value}</p>
        )}
      </CardContent>
    </Card>
  );
  
  return href ? (
    <Link to={href} className="block transition-all hover:scale-[1.02] hover:shadow-md">
      {content}
    </Link>
  ) : content;
}