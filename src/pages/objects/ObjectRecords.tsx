import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMetadata } from "@/contexts/metadata-context";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, MoreHorizontal, FileEdit, Trash2, Eye, Database } from "lucide-react";
import { Input } from "@/components/ui/input";

// Temporary in-memory records store (per session)
const recordsStore: Record<string, any[]> = {};

export default function ObjectRecords() {
  const { objectApiName } = useParams<{ objectApiName: string }>();
  const { getObjectByApiName, getFieldsByObjectApiName, isLoading } = useMetadata();
  const object = getObjectByApiName(objectApiName || "");
  const fields = getFieldsByObjectApiName(objectApiName || "");
  const [records, setRecords] = useState<any[]>(recordsStore[objectApiName!] || []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>({});
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Contextual sidebar content
  const contextualSidebarContent = object ? (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">Object Info</h3>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">Label:</span> {object.label}</p>
          <p><span className="font-medium">API Name:</span> {object.apiName}</p>
          <p><span className="font-medium">Fields:</span> {object.fields.length}</p>
          <p><span className="font-medium">Records:</span> {object.recordCount || 0}</p>
        </div>
      </div>
      <div>
        <h3 className="font-medium mb-2">Quick Actions</h3>
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Record
          </Button>
        </div>
      </div>
    </div>
  ) : null;

  if (!object && !isLoading) {
    return (
      <MainLayout breadcrumbs={[{ label: "Objects", href: "/objects" }, { label: objectApiName || "Unknown" }, { label: "Records" }]}>
        <div className="text-center py-12 text-muted-foreground">Object not found.</div>
      </MainLayout>
    );
  }

  const handleAdd = () => {
    setForm({});
    setEditIndex(null);
    setShowForm(true);
  };

  const handleEdit = (idx: number) => {
    setForm(records[idx]);
    setEditIndex(idx);
    setShowForm(true);
  };

  const handleDelete = (idx: number) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      const newRecords = records.filter((_, i) => i !== idx);
      setRecords(newRecords);
      recordsStore[objectApiName!] = newRecords;
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newRecords;
    if (editIndex !== null) {
      newRecords = records.map((rec, i) => (i === editIndex ? form : rec));
    } else {
      newRecords = [...records, form];
    }
    setRecords(newRecords);
    recordsStore[objectApiName!] = newRecords;
    setShowForm(false);
    setEditIndex(null);
    setForm({});
  };

  const filteredRecords = records.filter(rec =>
    fields.some(field =>
      (rec[field.apiName] || "").toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <MainLayout breadcrumbs={[{ label: "Objects", href: "/objects" }, { label: object?.label || objectApiName }, { label: "Records" }]} contextualSidebarContent={contextualSidebarContent}>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Records for {object?.label}</h1>
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Record
          </Button>
        </div>
        <div className="flex items-center gap-4 mb-2">
          <Input
            placeholder="Search records..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <span className="text-muted-foreground text-xs">{filteredRecords.length} found</span>
        </div>
        {showForm && (
          <form onSubmit={handleFormSubmit} className="max-w-xl mx-auto mb-8">
            <Card>
              <CardHeader>
                <CardTitle>{editIndex !== null ? "Edit Record" : "Add Record"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map(field => (
                  <div key={field.apiName}>
                    <label className="block font-medium mb-1">{field.label}</label>
                    <Input
                      name={field.apiName}
                      value={form[field.apiName] || ""}
                      onChange={handleFormChange}
                      required={field.required}
                    />
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button type="submit">{editIndex !== null ? "Save" : "Add"}</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </CardFooter>
            </Card>
          </form>
        )}
        <div className="overflow-x-auto rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                {fields.map(field => (
                  <TableHead key={field.apiName}>{field.label}</TableHead>
                ))}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-5" /></TableCell>
                    {fields.map((_, j) => <TableCell key={j}><Skeleton className="h-5 w-16" /></TableCell>)}
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={fields.length + 2} className="h-24 text-center">
                    <p className="text-muted-foreground">No records found.</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((rec, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{idx + 1}</TableCell>
                    {fields.map(field => (
                      <TableCell key={field.apiName}>
                        {rec[field.apiName] || <span className="text-muted-foreground">-</span>}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEdit(idx)} className="flex cursor-pointer items-center">
                            <FileEdit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(idx)} className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
} 