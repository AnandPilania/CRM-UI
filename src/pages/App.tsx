import { MainLayout } from "@/components/layout/main-layout";
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import HomePage from "./HomePage";
import NotFoundPage from "./NotFoundPage";
import ObjectsPage from "./ObjectsPage";
import ObjectDetailPage from "./ObjectDetailPage";
import SecurityPage from "./SecurityPage";
import ProfileDetailPage from "./ProfileDetailPage";
import LayoutsPage from "./LayoutsPage";
import ReportsPage from "./ReportsPage";
import AuditPage from "./AuditPage";
import SettingsPage from "./SettingsPage";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* Objects Routes */}
            <Route path="/objects" element={<ObjectsPage />} />
            <Route path="/objects/standard" element={<ObjectsPage />} />
            <Route path="/objects/custom" element={<ObjectsPage />} />
            <Route path="/objects/view/:objectId" element={<ObjectDetailPage />} />
            <Route path="/objects/fields/new/:objectId" element={<ObjectDetailPage />} />
            <Route path="/objects/fields/edit/:fieldId" element={<ObjectDetailPage />} />
            <Route path="/objects/relationships/new/:objectId" element={<ObjectDetailPage />} />
            <Route path="/objects/relationships/edit/:relationshipId" element={<ObjectDetailPage />} />

            {/* Security Routes */}
            <Route path="/security/profiles" element={<SecurityPage />} />
            <Route path="/security/profiles/:profileId" element={<ProfileDetailPage />} />
            <Route path="/security/profiles/new" element={<SecurityPage />} />
            <Route path="/security/permission-sets" element={<SecurityPage />} />
            <Route path="/security/permission-sets/new" element={<SecurityPage />} />
            <Route path="/security/permission-sets/edit/:permissionSetId" element={<SecurityPage />} />
            <Route path="/security/permission-set-groups" element={<SecurityPage />} />
            <Route path="/security/field-level-security" element={<SecurityPage />} />
            <Route path="/security/sharing-settings" element={<SecurityPage />} />
            <Route path="/security/sharing-rules" element={<SecurityPage />} />
            <Route path="/security/object-permissions/:objectId" element={<SecurityPage />} />

            {/* Layout Routes */}
            <Route path="/layouts" element={<LayoutsPage />} />
            <Route path="/layouts/:layoutType" element={<LayoutsPage />} />
            <Route path="/layouts/new/:objectId" element={<LayoutsPage />} />
            <Route path="/layouts/edit/:layoutId" element={<LayoutsPage />} />

            {/* Reports Routes */}
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/reports/:reportType" element={<ReportsPage />} />
            <Route path="/reports/view/:reportId" element={<ReportsPage />} />
            <Route path="/reports/edit/:reportId" element={<ReportsPage />} />
            <Route path="/reports/new" element={<ReportsPage />} />

            {/* Audit Routes */}
            <Route path="/audit" element={<AuditPage />} />
            <Route path="/audit/:auditType" element={<AuditPage />} />

            {/* Settings Routes */}
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/:settingType" element={<SettingsPage />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MainLayout>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
