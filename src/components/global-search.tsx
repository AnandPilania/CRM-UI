import { useState,useEffect } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);

  // Placeholder search results
  const searchResults = {
    objects: [
      { id: "1", name: "Account", type: "Standard Object" },
      { id: "2", name: "Contact", type: "Standard Object" },
      { id: "3", name: "Opportunity", type: "Standard Object" },
      { id: "4", name: "CustomObject__c", type: "Custom Object" },
    ],
    fields: [
      { id: "1", name: "Name", objectName: "Account", type: "Text" },
      { id: "2", name: "Email", objectName: "Contact", type: "Email" },
      { id: "3", name: "Amount", objectName: "Opportunity", type: "Currency" },
    ],
    records: [
      { id: "1", name: "Acme Corp", type: "Account" },
      { id: "2", name: "John Doe", type: "Contact" },
      { id: "3", name: "Enterprise Deal", type: "Opportunity" },
    ],
    layouts: [
      { id: "1", name: "Account Layout", objectName: "Account" },
      { id: "2", name: "Contact Layout", objectName: "Contact" },
    ],
    reports: [
      { id: "1", name: "Sales Pipeline", type: "Report" },
      { id: "2", name: "Customer Contacts", type: "Report" },
    ],
  };

  // Toggle the command dialog
  const toggleSearch = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  // Handle keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleSearch();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-64 justify-start rounded-md text-sm text-muted-foreground sm:pr-12 md:w-64 lg:w-80"
        onClick={toggleSearch}
      >
        <span className="inline-flex">
          <Search className="mr-2 h-4 w-4" />
          Search...
        </span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search for objects, fields, records, reports..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {/* Objects */}
          <CommandGroup heading="Objects">
            {searchResults.objects.map((item) => (
              <CommandItem key={item.id}>
                <div className="flex items-center justify-between w-full">
                  <span>{item.name}</span>
                  <Badge variant="outline" className="ml-2">
                    {item.type}
                  </Badge>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          {/* Fields */}
          <CommandGroup heading="Fields">
            {searchResults.fields.map((item) => (
              <CommandItem key={item.id}>
                <div className="flex items-center justify-between w-full">
                  <span>{item.name} <span className="text-muted-foreground">({item.objectName})</span></span>
                  <Badge variant="outline" className="ml-2">
                    {item.type}
                  </Badge>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          {/* Records */}
          <CommandGroup heading="Records">
            {searchResults.records.map((item) => (
              <CommandItem key={item.id}>
                <div className="flex items-center justify-between w-full">
                  <span>{item.name}</span>
                  <Badge variant="outline" className="ml-2">
                    {item.type}
                  </Badge>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          {/* Layouts */}
          <CommandGroup heading="Layouts">
            {searchResults.layouts.map((item) => (
              <CommandItem key={item.id}>
                <div className="flex items-center justify-between w-full">
                  <span>{item.name} <span className="text-muted-foreground">({item.objectName})</span></span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          {/* Reports */}
          <CommandGroup heading="Reports">
            {searchResults.reports.map((item) => (
              <CommandItem key={item.id}>
                <div className="flex items-center justify-between w-full">
                  <span>{item.name}</span>
                  <Badge variant="outline" className="ml-2">
                    {item.type}
                  </Badge>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
