import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NavItem } from "@/types";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Box,
  Building,
  ChevronDown,
  ChevronRight,
  Cog,
  Contact,
  FolderKanban,
  LayoutDashboard,
  List,
  Lock,
  LucideIcon,
  MessageSquare,
  Settings,
  ShieldCheck,
  Sparkles,
  User,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SidebarProps {
  className?: string;
  section?: string;
}

const objectsNav: NavItem[] = [
  {
    id: "accounts",
    title: "Accounts",
    href: "/objects/accounts",
    icon: "Building",
  },
  {
    id: "contacts",
    title: "Contacts",
    href: "/objects/contacts",
    icon: "Contact",
  },
  {
    id: "leads",
    title: "Leads",
    href: "/objects/leads",
    icon: "UserPlus",
  },
  {
    id: "opportunities",
    title: "Opportunities",
    href: "/objects/opportunities",
    icon: "Sparkles",
  },
  {
    id: "cases",
    title: "Cases",
    href: "/objects/cases",
    icon: "MessageSquare",
  },
  {
    id: "custom-objects",
    title: "Custom Objects",
    href: "/objects/custom",
    icon: "Box",
  },
];

const setupNav: NavItem[] = [
  {
    id: "objects-fields",
    title: "Objects & Fields",
    href: "/setup/objects",
    icon: "Box",
    children: [
      {
        id: "object-manager",
        title: "Object Manager",
        href: "/setup/objects/manager",
      },
      {
        id: "schema-builder",
        title: "Schema Builder",
        href: "/setup/objects/schema",
      },
      {
        id: "field-dependencies",
        title: "Field Dependencies",
        href: "/setup/objects/dependencies",
      },
      {
        id: "picklist-values",
        title: "Picklist Values",
        href: "/setup/objects/picklists",
      },
    ],
  },
  {
    id: "page-layouts",
    title: "Page Layouts",
    href: "/setup/layouts",
    icon: "LayoutDashboard",
    children: [
      {
        id: "layout-assignments",
        title: "Layout Assignments",
        href: "/setup/layouts/assignments",
      },
      {
        id: "compact-layouts",
        title: "Compact Layouts",
        href: "/setup/layouts/compact",
      },
      {
        id: "record-types",
        title: "Record Types",
        href: "/setup/layouts/record-types",
      },
    ],
  },
  {
    id: "users-permissions",
    title: "Users & Permissions",
    href: "/setup/security",
    icon: "Lock",
    children: [
      {
        id: "users",
        title: "Users",
        href: "/setup/security/users",
      },
      {
        id: "profiles",
        title: "Profiles",
        href: "/setup/security/profiles",
      },
      {
        id: "permission-sets",
        title: "Permission Sets",
        href: "/setup/security/permission-sets",
      },
      {
        id: "permission-set-groups",
        title: "Permission Set Groups",
        href: "/setup/security/permission-set-groups",
      },
      {
        id: "roles",
        title: "Roles",
        href: "/setup/security/roles",
      },
      {
        id: "owd-settings",
        title: "OWD Settings",
        href: "/setup/security/owd",
      },
      {
        id: "sharing-rules",
        title: "Sharing Rules",
        href: "/setup/security/sharing-rules",
      },
    ],
  },
  {
    id: "automation",
    title: "Automation",
    href: "/setup/automation",
    icon: "Sparkles",
    children: [
      {
        id: "workflow-rules",
        title: "Workflow Rules",
        href: "/setup/automation/workflows",
      },
      {
        id: "process-builder",
        title: "Process Builder",
        href: "/setup/automation/processes",
      },
      {
        id: "flows",
        title: "Flows",
        href: "/setup/automation/flows",
      },
      {
        id: "approval-processes",
        title: "Approval Processes",
        href: "/setup/automation/approvals",
      },
    ],
  },
];

const reportsNav: NavItem[] = [
  {
    id: "recent-reports",
    title: "Recent Reports",
    href: "/reports/recent",
    icon: "List",
  },
  {
    id: "report-builder",
    title: "Report Builder",
    href: "/reports/create",
    icon: "BarChart3",
  },
  {
    id: "dashboards",
    title: "Dashboards",
    href: "/reports/dashboards",
    icon: "FolderKanban",
  },
  {
    id: "scheduled-reports",
    title: "Scheduled Reports",
    href: "/reports/scheduled",
    icon: "BarChart3",
  },
];

const auditNav: NavItem[] = [
  {
    id: "login-history",
    title: "Login History",
    href: "/audit/login",
    icon: "User",
  },
  {
    id: "setup-audit-trail",
    title: "Setup Audit Trail",
    href: "/audit/setup",
    icon: "Settings",
  },
  {
    id: "field-history",
    title: "Field History",
    href: "/audit/fields",
    icon: "List",
  },
  {
    id: "security-audit-log",
    title: "Security Audit Log",
    href: "/audit/security",
    icon: "ShieldCheck",
  },
];

const getNavItems = (section?: string): NavItem[] => {
  switch (section) {
    case "objects":
      return objectsNav;
    case "setup":
      return setupNav;
    case "reports":
      return reportsNav;
    case "audit":
      return auditNav;
    default:
      return [];
  }
};

const getIcon = (iconName?: string): LucideIcon | undefined => {
  const icons: Record<string, LucideIcon> = {
    Building,
    Contact,
    UserPlus,
    Sparkles,
    MessageSquare,
    Box,
    LayoutDashboard,
    Lock,
    BarChart3,
    FolderKanban,
    List,
    User,
    Settings,
    ShieldCheck,
    Cog,
  };

  return iconName ? icons[iconName] : undefined;
};

export function Sidebar({ className, section }: SidebarProps) {
  const location = useLocation();
  const navItems = getNavItems(section);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  if (!navItems.length) return null;

  const toggleItem = (itemId: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            {section?.charAt(0).toUpperCase() + section?.slice(1)}
          </h2>
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon ? getIcon(item.icon) : null;
              const isActive = location.pathname === item.href;
              const hasChildren = item.children && item.children.length > 0;

              if (hasChildren) {
                return (
                  <Collapsible
                    key={item.id}
                    open={openItems[item.id]}
                    onOpenChange={() => toggleItem(item.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-between pl-2 font-normal",
                          isActive ? "bg-accent" : ""
                        )}
                      >
                        <span className="flex items-center">
                          {Icon && <Icon className="mr-2 h-4 w-4" />}
                          {item.title}
                        </span>
                        {openItems[item.id] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4 pt-1">
                      {item.children?.map((child) => (
                        <Button
                          key={child.id}
                          variant="ghost"
                          className={cn(
                            "w-full justify-start font-normal",
                            location.pathname === child.href ? "bg-accent" : ""
                          )}
                          asChild
                        >
                          <Link to={child.href}>{child.title}</Link>
                        </Button>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                );
              }

              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    isActive ? "bg-accent" : ""
                  )}
                  asChild
                >
                  <Link to={item.href}>
                    {Icon && <Icon className="mr-2 h-4 w-4" />}
                    {item.title}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}