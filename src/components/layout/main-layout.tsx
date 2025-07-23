import { useState } from "react";
import { MainNav } from "./main-nav";
import { MainSidebar } from "./main-sidebar";
import { ContextualSidebar } from "./contextual-sidebar";
import { UserNav } from "./user-nav";
import { GlobalSearch } from "../global-search";
import { ScrollArea } from "../ui/scroll-area";
import { Breadcrumb } from "../../types";

interface MainLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
  showContextualSidebar?: boolean;
  contextualSidebarContent?: React.ReactNode;
}

export function MainLayout({ 
  children, 
  breadcrumbs = [],
  showContextualSidebar = true,
  contextualSidebarContent
}: MainLayoutProps) {
  const [mainSidebarOpen, setMainSidebarOpen] = useState(true);
  const [contextualSidebarOpen, setContextualSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Main sidebar */}
      <MainSidebar 
        isOpen={mainSidebarOpen}
        onToggle={() => setMainSidebarOpen(!mainSidebarOpen)} 
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-6">
          <div className="flex flex-1 items-center gap-4">
            <GlobalSearch />
            <nav className="hidden md:flex items-center space-x-2">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && <span className="mx-2 text-muted-foreground">/</span>}
                  {crumb.href ? (
                    <a 
                      href={crumb.href} 
                      className="text-sm font-medium hover:text-primary"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-sm font-medium text-muted-foreground">
                      {crumb.label}
                    </span>
                  )}
                </div>
              ))}
            </nav>
          </div>
          <MainNav />
          <UserNav />
        </header>

        {/* Main content with optional contextual sidebar */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-auto">
            <ScrollArea className="h-full">
              <main className="flex-1 p-6">
                {children}
              </main>
            </ScrollArea>
          </div>

          {/* Contextual sidebar */}
          {showContextualSidebar && contextualSidebarContent && (
            <ContextualSidebar 
              isOpen={contextualSidebarOpen}
              onToggle={() => setContextualSidebarOpen(!contextualSidebarOpen)}
            >
              {contextualSidebarContent}
            </ContextualSidebar>
          )}
        </div>
      </div>
    </div>
  );
}