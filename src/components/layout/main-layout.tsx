import { useState } from 'react';
import { MainNav } from './main-nav';
import { SubNav } from './sub-nav';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { Tab, SubTab } from '@/types';

// Main navigation items
const mainNavItems: Tab[] = [
  {
    id: 'home',
    label: 'Home',
    icon: 'home',
    path: '/'
  },
  {
    id: 'objects',
    label: 'Objects',
    icon: 'database',
  },
  {
    id: 'layouts',
    label: 'Layouts',
    icon: 'layout',
  },
  {
    id: 'security',
    label: 'Security',
    icon: 'shield',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'bar-chart',
  },
  {
    id: 'audit',
    label: 'Audit Logs',
    icon: 'activity',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings',
  }
];

// Sub navigation items
const subNavItems: Record<string, SubTab[]> = {
  objects: [
    { id: 'all-objects', parentId: 'objects', label: 'All Objects', path: '/objects' },
    { id: 'standard-objects', parentId: 'objects', label: 'Standard Objects', path: '/objects/standard' },
    { id: 'custom-objects', parentId: 'objects', label: 'Custom Objects', path: '/objects/custom' },
    { id: 'fields', parentId: 'objects', label: 'Fields', path: '/objects/fields' },
    { id: 'relationships', parentId: 'objects', label: 'Relationships', path: '/objects/relationships' },
  ],
  layouts: [
    { id: 'page-layouts', parentId: 'layouts', label: 'Page Layouts', path: '/layouts' },
    { id: 'record-types', parentId: 'layouts', label: 'Record Types', path: '/layouts/record-types' },
    { id: 'compact-layouts', parentId: 'layouts', label: 'Compact Layouts', path: '/layouts/compact' },
  ],
  security: [
    { id: 'profiles', parentId: 'security', label: 'Profiles', path: '/security/profiles' },
    { id: 'permission-sets', parentId: 'security', label: 'Permission Sets', path: '/security/permission-sets' },
    { id: 'permission-set-groups', parentId: 'security', label: 'Permission Set Groups', path: '/security/permission-set-groups' },
    { id: 'sharing-settings', parentId: 'security', label: 'Sharing Settings', path: '/security/sharing-settings' },
    { id: 'sharing-rules', parentId: 'security', label: 'Sharing Rules', path: '/security/sharing-rules' },
    { id: 'field-level-security', parentId: 'security', label: 'Field Level Security', path: '/security/field-security' },
  ],
  reports: [
    { id: 'all-reports', parentId: 'reports', label: 'All Reports', path: '/reports' },
    { id: 'create-report', parentId: 'reports', label: 'Create Report', path: '/reports/create' },
    { id: 'dashboards', parentId: 'reports', label: 'Dashboards', path: '/reports/dashboards' },
  ],
  audit: [
    { id: 'setup-audit', parentId: 'audit', label: 'Setup Audit Trail', path: '/audit' },
    { id: 'field-history', parentId: 'audit', label: 'Field History', path: '/audit/field-history' },
    { id: 'login-history', parentId: 'audit', label: 'Login History', path: '/audit/login-history' },
  ],
  settings: [
    { id: 'company-settings', parentId: 'settings', label: 'Company Settings', path: '/settings' },
    { id: 'user-management', parentId: 'settings', label: 'User Management', path: '/settings/users' },
    { id: 'data-management', parentId: 'settings', label: 'Data Management', path: '/settings/data' },
  ],
};

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [activeTab, setActiveTab] = useState<string>('objects');
  const [isSubNavOpen, setIsSubNavOpen] = useState<boolean>(true);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setIsSubNavOpen(true);
  };

  const toggleSubNav = () => {
    setIsSubNavOpen(!isSubNavOpen);
  };

  return (
    <div className="flex h-screen bg-background">
      <MainNav
        items={mainNavItems}
        activeItem={activeTab}
        onTabChange={handleTabChange}
        onToggleSubNav={toggleSubNav}
      />

      {isSubNavOpen && subNavItems[activeTab] && (
        <SubNav items={subNavItems[activeTab]} />
      )}

      <main className={cn(
        "flex-1 overflow-auto p-6",
        isSubNavOpen ? "ml-64" : "ml-16"
      )}>
        {children}
      </main>

      <Toaster />
    </div>
  );
}
