import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Database, Users, Shield, BarChart2, Settings, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  // Recent items - would come from an API in a real app
  const recentItems = [
    { type: "Object", name: "Project", path: "/objects/view/4", timestamp: "Today, 10:23 AM" },
    { type: "Profile", name: "Sales Manager", path: "/security/profiles/4", timestamp: "Yesterday, 3:45 PM" },
    { type: "Layout", name: "Project Layout", path: "/layouts/edit/4", timestamp: "Jul 19, 2025" },
  ];

  // Cards for quick access
  const quickAccessCards = [
    {
      title: "Objects",
      description: "Manage standard and custom objects",
      icon: Database,
      path: "/objects",
      badge: "15 total",
    },
    {
      title: "Users & Security",
      description: "Manage profiles, permission sets, and sharing",
      icon: Shield,
      path: "/security/profiles",
      badge: "4 profiles",
    },
    {
      title: "Reports",
      description: "Build custom reports and dashboards",
      icon: BarChart2,
      path: "/reports",
      badge: "12 reports",
    },
    {
      title: "Audit Logs",
      description: "Review system changes and user activity",
      icon: Activity,
      path: "/audit",
      badge: "Last: Today",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Welcome to Flexforce CRM</h1>
        <p className="text-muted-foreground">Your Salesforce alternative platform</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Global search: objects, fields, records, users..."
          className="pl-10 h-12"
        />
      </div>

      {/* Quick access */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickAccessCards.map((card, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <card.icon className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="outline">{card.badge}</Badge>
                </div>
                <CardTitle className="mt-4">{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-2">
                <Button variant="ghost" className="w-full" onClick={() => navigate(card.path)}>
                  View
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent items */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Items</h2>
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y">
              {recentItems.map((item, i) => (
                <li key={i} className="p-4 hover:bg-muted/50 cursor-pointer" onClick={() => navigate(item.path)}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.type}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{item.timestamp}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
