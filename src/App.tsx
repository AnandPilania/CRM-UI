import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ObjectManager from './pages/setup/objects/ObjectManager';
import FieldManager from './pages/setup/objects/FieldManager';
import LayoutBuilder from './pages/setup/layouts/LayoutBuilder';
import PermissionManager from './pages/setup/security/PermissionManager';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/setup/objects/manager" element={<ObjectManager />} />
          <Route path="/setup/objects/:objectApiName/fields" element={<FieldManager />} />
          <Route path="/setup/layouts/:objectApiName/:layoutId" element={<LayoutBuilder />} />
          <Route path="/setup/security/:permType" element={<PermissionManager />} />
          <Route path="/setup/security/:permType/:permId" element={<PermissionManager />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
