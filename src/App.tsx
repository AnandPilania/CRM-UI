import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MetadataProvider } from './contexts/metadata-context';
import { LayoutProvider } from './contexts/layout-context';

// Pages
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// Objects
import ObjectsList from './pages/objects/ObjectsList';
import ObjectDetail from './pages/objects/ObjectDetail';
// import ObjectManager from './pages/objects/ObjectManager';
// import ObjectRecords from './pages/objects/ObjectRecords';
// import ObjectCreate from './pages/objects/ObjectCreate';
// import FieldsList from './pages/objects/FieldsList';
// import FieldDetail from './pages/objects/FieldDetail';
// import FieldCreate from './pages/objects/FieldCreate';

// Layouts
// import LayoutsList from './pages/layouts/LayoutsList';
// import LayoutDetail from './pages/layouts/LayoutDetail';
// import LayoutCreate from './pages/layouts/LayoutCreate';
// import LayoutBuilder from './pages/layouts/LayoutBuilder';

// Reports
// import ReportsList from './pages/reports/ReportsList';
// import ReportDetail from './pages/reports/ReportDetail';
// import ReportCreate from './pages/reports/ReportCreate';
// import ReportBuilder from './pages/reports/ReportBuilder';

// Permissions
// import PermissionsHome from './pages/permissions/PermissionsHome';
// import RolesList from './pages/permissions/RolesList';
// import RoleDetail from './pages/permissions/RoleDetail';
// import ProfilesList from './pages/permissions/ProfilesList';
// import ProfileDetail from './pages/permissions/ProfileDetail';
// import PermissionSetsList from './pages/permissions/PermissionSetsList';
// import PermissionSetDetail from './pages/permissions/PermissionSetDetail';

// Audit
// import AuditLogs from './pages/audit/AuditLogs';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <MetadataProvider>
        <LayoutProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Objects routes */}
              <Route path="/objects" element={<Navigate to="/objects/all" replace />} />
              <Route path="/objects/all" element={<ObjectsList />} />
              <Route path="/objects/standard" element={<ObjectsList standardOnly />} />
              <Route path="/objects/custom" element={<ObjectsList customOnly />} />
              {/* <Route path="/objects/manager" element={<ObjectManager />} />
              <Route path="/objects/create" element={<ObjectCreate />} /> */}
              <Route path="/objects/:objectApiName" element={<ObjectDetail />} />
              {/* <Route path="/objects/:objectApiName/fields" element={<FieldsList />} />
              <Route path="/objects/:objectApiName/fields/create" element={<FieldCreate />} />
              <Route path="/objects/:objectApiName/fields/:fieldId" element={<FieldDetail />} />
              <Route path="/objects/:objectApiName/records" element={<ObjectRecords />} /> */}

              {/* Layouts routes */}
              {/* <Route path="/layouts" element={<LayoutsList />} />
              <Route path="/layouts/create" element={<LayoutCreate />} />
              <Route path="/layouts/:layoutId" element={<LayoutDetail />} />
              <Route path="/layouts/:layoutId/builder" element={<LayoutBuilder />} /> */}

              {/* Reports routes */}
              <Route path="/reports" element={<Navigate to="/reports/all" replace />} />
              {/* <Route path="/reports/all" element={<ReportsList />} />
              <Route path="/reports/create" element={<ReportCreate />} />
              <Route path="/reports/:reportId" element={<ReportDetail />} />
              <Route path="/reports/builder" element={<ReportBuilder />} />
              <Route path="/reports/:reportId/builder" element={<ReportBuilder />} /> */}

              {/* Permissions routes */}
              {/* <Route path="/permissions" element={<PermissionsHome />} />
              <Route path="/permissions/roles" element={<RolesList />} />
              <Route path="/permissions/roles/:roleId" element={<RoleDetail />} />
              <Route path="/permissions/profiles" element={<ProfilesList />} />
              <Route path="/permissions/profiles/:profileId" element={<ProfileDetail />} />
              <Route path="/permissions/sets" element={<PermissionSetsList />} />
              <Route path="/permissions/sets/:setId" element={<PermissionSetDetail />} /> */}

              {/* Audit routes */}
              {/* <Route path="/audit" element={<AuditLogs />} /> */}

              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LayoutProvider>
      </MetadataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
