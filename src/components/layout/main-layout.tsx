import React from "react";
import { MainNav } from "./main-nav";
import { Sidebar } from "./sidebar";
import { useLocation } from "react-router-dom";

interface MainLayoutProps {
  children: React.ReactNode;
  hideSidebar?: boolean
}

export function MainLayout({ children, hideSidebar = false }: MainLayoutProps) {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const section = pathSegments.length > 0 ? pathSegments[0] : "";

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="flex flex-1">
        {!hideSidebar && (
        <div className="w-64 border-r hidden md:block">
          <Sidebar section={section} />
        </div>
        )}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
