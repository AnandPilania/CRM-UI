import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export function MainNav() {
  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <Badge variant="destructive" className="h-5 w-5 absolute -top-1 -right-1 flex items-center justify-center p-0">3</Badge>
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </div>
  );
}