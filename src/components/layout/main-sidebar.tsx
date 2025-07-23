import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { 
  ChevronLeft, ChevronRight, 
  LayoutDashboard, Database, 
  SquareStack, PieChart, Shield, 
  Users, History, Settings, 
  ChevronDown, ChevronUp 
} from "lucide-react";

interface MainSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MainSidebar({ isOpen, onToggle }: MainSidebarProps) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    objects: true,
  });

  const toggleExpand = (key: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const navItems = [
    { 
      id: "dashboard", 
      label: "Dashboard", 
      icon: <LayoutDashboard className="h-5 w-5" />, 
      href: "/dashboard" 
    },
    { 
      id: "objects", 
      label: "Objects", 
      icon: <Database className="h-5 w-5" />, 
      href: "/objects",
      expandable: true,
      children: [
        { id: "standard-objects", label: "Standard Objects", href: "/objects/standard" },
        { id: "custom-objects", label: "Custom Objects", href: "/objects/custom" },
        { id: "object-manager", label: "Object Manager", href: "/objects/manager" },
      ]
    },
    { 
      id: "layouts", 
      label: "Layouts", 
      icon: <SquareStack className="h-5 w-5" />, 
      href: "/layouts" 
    },
    { 
      id: "reports", 
      label: "Reports", 
      icon: <PieChart className="h-5 w-5" />, 
      href: "/reports",
      expandable: true,
      children: [
        { id: "all-reports", label: "All Reports", href: "/reports/all" },
        { id: "report-builder", label: "Report Builder", href: "/reports/builder" },
        { id: "report-folders", label: "Folders", href: "/reports/folders" },
      ]
    },
    { 
      id: "permissions", 
      label: "Permissions", 
      icon: <Shield className="h-5 w-5" />, 
      href: "/permissions",
      expandable: true,
      children: [
        { id: "roles", label: "Roles", href: "/permissions/roles" },
        { id: "profiles", label: "Profiles", href: "/permissions/profiles" },
        { id: "permission-sets", label: "Permission Sets", href: "/permissions/sets" },
        { id: "sharing-rules", label: "Sharing Rules", href: "/permissions/sharing" },
      ]
    },
    { 
      id: "users", 
      label: "Users", 
      icon: <Users className="h-5 w-5" />, 
      href: "/users" 
    },
    { 
      id: "audit", 
      label: "Audit Logs", 
      icon: <History className="h-5 w-5" />, 
      href: "/audit" 
    },
    { 
      id: "settings", 
      label: "Settings", 
      icon: <Settings className="h-5 w-5" />, 
      href: "/settings" 
    },
  ];

  return (
    <div className={cn(
      "flex flex-col border-r bg-background transition-all duration-300",
      isOpen ? "w-64" : "w-16"
    )}>
      <div className="flex h-16 items-center justify-between border-b px-4">
        <div className={cn(
          "flex items-center gap-2 font-semibold transition-all duration-300",
          isOpen ? "opacity-100" : "opacity-0 invisible"
        )}>
          <span className="text-primary text-xl">MetaForce</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggle}
          className="h-8 w-8"
        >
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-2">
          {navItems.map((item) => (
            <div key={item.id} className="flex flex-col">
              <Link
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
                  location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50",
                  !isOpen && "justify-center"
                )}
              >
                {item.icon}
                {isOpen && (
                  <div className="flex flex-1 items-center justify-between">
                    <span>{item.label}</span>
                    {item.expandable && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleExpand(item.id);
                        }}
                      >
                        {expandedItems[item.id] ? 
                          <ChevronUp className="h-3 w-3" /> : 
                          <ChevronDown className="h-3 w-3" />
                        }
                      </Button>
                    )}
                  </div>
                )}
              </Link>

              {/* Submenu items */}
              {isOpen && item.expandable && expandedItems[item.id] && item.children && (
                <div className="ml-6 mt-1 flex flex-col gap-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.id}
                      to={child.href}
                      className={cn(
                        "flex items-center rounded-md px-3 py-1.5 text-sm transition-all",
                        location.pathname === child.href
                          ? "bg-accent/50 text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent/30 hover:text-accent-foreground"
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}