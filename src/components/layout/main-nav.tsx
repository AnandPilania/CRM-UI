import * as React from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function MainNav({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link to="/" className="flex items-center space-x-2 mr-6">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          <span className="hidden font-bold sm:inline-block text-xl">Nucleus</span>
        </Link>
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Setup</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 w-[400px] md:w-[500px] lg:w-[600px] grid-cols-2">
                  <li className="row-span-4">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-rose-500 to-indigo-700 p-6 no-underline outline-none focus:shadow-md"
                        to="/setup"
                      >
                        <div className="mt-4 mb-2 text-lg font-medium text-white">
                          Setup Home
                        </div>
                        <p className="text-sm leading-tight text-white/90">
                          Configure and customize your CRM platform
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <ListItem to="/setup/objects" title="Objects">
                    Manage standard and custom objects
                  </ListItem>
                  <ListItem to="/setup/users" title="Users">
                    Manage users, roles and profiles
                  </ListItem>
                  <ListItem to="/setup/security" title="Security">
                    Configure permissions and access controls
                  </ListItem>
                  <ListItem to="/setup/automation" title="Automation">
                    Workflows, processes and approvals
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Objects</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <ListItem to="/objects/accounts" title="Accounts">
                    Manage company accounts
                  </ListItem>
                  <ListItem to="/objects/contacts" title="Contacts">
                    Manage individual contacts
                  </ListItem>
                  <ListItem to="/objects/leads" title="Leads">
                    Track potential opportunities
                  </ListItem>
                  <ListItem to="/objects/opportunities" title="Opportunities">
                    Manage potential deals
                  </ListItem>
                  <ListItem to="/objects/cases" title="Cases">
                    Customer service cases
                  </ListItem>
                  <ListItem to="/objects/custom" title="Custom Objects">
                    View all custom objects
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Reports</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <ListItem to="/reports/recent" title="Recent Reports">
                    Recently viewed reports
                  </ListItem>
                  <ListItem to="/reports/create" title="Report Builder">
                    Create custom reports
                  </ListItem>
                  <ListItem to="/reports/dashboards" title="Dashboards">
                    Interactive data visualizations
                  </ListItem>
                  <ListItem to="/reports/scheduled" title="Scheduled Reports">
                    Automated report delivery
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/audit" className={navigationMenuTriggerStyle()}>
                Audit
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto flex items-center space-x-4">
          <div className="relative w-full max-w-sm lg:max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Global Search..."
              className="pl-8 w-full md:w-[300px] rounded-md bg-background"
            />
          </div>
          <ModeToggle />
          <Button variant="outline" size="icon" className="rounded-full">
            <img
              src="/images/UserAvatar.jpg"
              alt="User"
              className="rounded-full"
              width="32"
              height="32"
            />
            <span className="sr-only">User menu</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { to: string }
>(({ className, title, children, to, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={to}
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
