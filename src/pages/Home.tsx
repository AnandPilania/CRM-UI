import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/main-layout";
import { BarChart3, Building2, FileText, LayoutDashboard, Users } from "lucide-react";

export default function Home() {
  const stats = [
    {
      title: "Total Accounts",
      value: "1,259",
      change: "+12.5%",
      description: "from last month",
    },
    {
      title: "Active Leads",
      value: "342",
      change: "+8.2%",
      description: "from last month",
    },
    {
      title: "Open Opportunities",
      value: "$4.2M",
      change: "+23.1%",
      description: "from last month",
    },
    {
      title: "Conversion Rate",
      value: "24.3%",
      change: "+2.4%",
      description: "from last month",
    },
  ];

  const quickLinks = [
    {
      title: "Accounts",
      description: "Manage company accounts",
      icon: <Building2 className="h-6 w-6" />,
      href: "/objects/accounts",
    },
    {
      title: "Reports",
      description: "View and create reports",
      icon: <BarChart3 className="h-6 w-6" />,
      href: "/reports/recent",
    },
    {
      title: "Objects & Fields",
      description: "Configure data model",
      icon: <FileText className="h-6 w-6" />,
      href: "/setup/objects/manager",
    },
    {
      title: "User Management",
      description: "Manage users and permissions",
      icon: <Users className="h-6 w-6" />,
      href: "/setup/security/users",
    },
    {
      title: "Page Layouts",
      description: "Design record layouts",
      icon: <LayoutDashboard className="h-6 w-6" />,
      href: "/setup/layouts/assignments",
    },
  ];

  return (
    <MainLayout hideSidebar>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Welcome to Nucleus</h1>
          <Button>View Setup Guide</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">
                  <span className={stat.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}>
                    {stat.change}
                  </span>{" "}
                  {stat.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="text-2xl font-bold">Quick Links</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  {link.icon}
                  <CardTitle>{link.title}</CardTitle>
                </div>
                <CardDescription>{link.description}</CardDescription>
              </CardHeader>
              <CardFooter className="pb-4 pt-2">
                <Button variant="secondary" className="w-full" asChild>
                  <a href={link.href}>Go to {link.title}</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Items</CardTitle>
              <CardDescription>
                Recently viewed records
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0 divide-y">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4">
                    <div>
                      <div className="font-medium">Acme Inc.</div>
                      <div className="text-sm text-muted-foreground">Account</div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Viewed 2h ago
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>
                Recently viewed reports
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0 divide-y">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4">
                    <div>
                      <div className="font-medium">Q2 Sales Analysis</div>
                      <div className="text-sm text-muted-foreground">Report</div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Viewed 3h ago
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
