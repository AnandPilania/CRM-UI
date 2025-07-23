import React from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ContextualSidebarProps {
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  width?: number;
}

export function ContextualSidebar({ 
  children, 
  isOpen, 
  onToggle, 
  width = 320 
}: ContextualSidebarProps) {
  return (
    <div 
      className={cn(
        "border-l bg-background transition-all duration-300 flex flex-col",
        isOpen ? `w-[${width}px]` : "w-10"
      )}
      style={{ width: isOpen ? width : 40 }}
    >
      <div className="flex h-12 items-center justify-between border-b px-2">
        <div className={cn(
          "flex items-center gap-2 font-medium text-sm transition-all duration-300",
          isOpen ? "opacity-100" : "opacity-0 invisible"
        )}>
          <span>Details</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggle}
          className="h-8 w-8"
        >
          {isOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className={cn(
        "flex-1 transition-opacity duration-300", 
        isOpen ? "opacity-100" : "opacity-0"
      )}>
        <div className="p-4">
          {isOpen && children}
        </div>
      </ScrollArea>
    </div>
  );
}