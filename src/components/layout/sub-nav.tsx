import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SubTab } from "@/types";
import { NavLink } from "react-router-dom";

interface SubNavProps {
  items: SubTab[];
}

export function SubNav({ items }: SubNavProps) {
  return (
    <div className="fixed left-16 h-full w-48 bg-gray-800 text-white py-8 z-10 overflow-y-auto">
      <div className="px-4 mb-4">
        <h2 className="text-lg font-semibold">{items[0]?.parentId.charAt(0).toUpperCase() + items[0]?.parentId.slice(1)}</h2>
      </div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <NavLink
              to={item.path}
              className={({ isActive }) => cn(
                "block px-4 py-2 text-sm hover:bg-gray-700 transition-colors",
                isActive ? "bg-gray-700 border-l-2 border-blue-500" : ""
              )}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
