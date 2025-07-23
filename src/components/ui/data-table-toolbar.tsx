import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filterableColumns?: {
    id: keyof TData
    title: string
    options: {
      label: string
      value: string
    }[]
  }[]
  searchableColumns?: {
    id: keyof TData
    title: string
  }[]
}

export function DataTableToolbar<TData>({
  table,
  filterableColumns = [],
  searchableColumns = [],
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {searchableColumns.length > 0 && searchableColumns.map((column) => (
          <Input
            key={String(column.id)}
            placeholder={`Search by ${column.title}`}
            value={(table.getColumn(String(column.id))?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(String(column.id))?.setFilterValue(event.target.value)
            }
            className="h-9 w-[250px]"
          />
        ))}
        
        {filterableColumns.length > 0 && filterableColumns.map((column) => {
          const columnFilter = table.getColumn(String(column.id))
          return columnFilter ? (
            <DataTableFacetedFilter
              key={String(column.id)}
              column={columnFilter}
              title={column.title}
              options={column.options}
            />
          ) : null
        })}
        
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-9 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}