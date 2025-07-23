import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tab } from "@/types";
import { LucideIcon, Home, Database, Layout, Shield, BarChart, Activity, Settings, Menu, ChevronRight, ChevronLeft } from "lucide-react";

interface MainNavProps {
  items: Tab[];
  activeItem: string;
  onTabChange: (id: string) => void;
  onToggleSubNav: () => void;
}

export function MainNav({ items, activeItem, onTabChange, onToggleSubNav }: MainNavProps) {
  const getIcon = (iconName: string): LucideIcon | null => {
    const icons: Record<string, LucideIcon> = {
      home: Home,
      database: Database,
      layout: Layout,
      shield: Shield,
      "bar-chart": BarChart,
      activity: Activity,
      settings: Settings,
    };
    return icons[iconName] || null;
  };

  return (
    <nav className="fixed left-0 h-full w-16 bg-gray-900 text-white flex flex-col items-center py-4 z-10 transition-width duration-200 ease-in-out">
      <Button
        variant="ghost"
        size="icon"
        className="mb-6 text-white hover:bg-gray-800"
        onClick={onToggleSubNav}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex flex-col items-center space-y-2 mt-4">
        {items.map((item) => {
          const Icon = getIcon(item.icon);
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="icon"
              className={cn(
                "w-10 h-10 rounded-md flex items-center justify-center transition-colors hover:bg-gray-800",
                activeItem === item.id ? "bg-gray-800" : "bg-transparent"
              )}
              onClick={() => onTabChange(item.id)}
              title={item.label}
            >
              {Icon && <Icon className="h-5 w-5" />}
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
