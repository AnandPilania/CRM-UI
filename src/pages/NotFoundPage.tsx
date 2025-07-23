import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">404</h1>
        <h2 className="text-2xl font-medium mb-2">Page not found</h2>
        <p className="text-muted-foreground mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button onClick={() => navigate("/")}>
          <Home className="mr-2 h-4 w-4" /> Return Home
        </Button>
      </div>
    </div>
  );
}
