import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useMetadata } from "@/contexts/metadata-context";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Eye, FileEdit, Database, Info } from "lucide-react";

const FIELD_TYPES = [
  "Text", "Number", "Date", "DateTime", "Checkbox", "Picklist", "Lookup", "Currency", "Percent", "Phone", "Email", "URL", "TextArea", "Formula", "AutoNumber"
];

export default function FieldDetail() {
  const { objectApiName, fieldId } = useParams<{ objectApiName: string; fieldId: string }>();
  const { getFieldsByObjectApiName, updateField } = useMetadata();
  const navigate = useNavigate();
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fields = getFieldsByObjectApiName(objectApiName || "");
    const field = fields.find(f => f.id === fieldId);
    if (field) setForm(field);
  }, [objectApiName, fieldId, getFieldsByObjectApiName]);

  // Contextual sidebar content
  const contextualSidebarContent = form ? (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">Field Info</h3>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">Label:</span> {form.label}</p>
          <p><span className="font-medium">API Name:</span> {form.apiName}</p>
          <p><span className="font-medium">Type:</span> {form.type}</p>
          <p><span className="font-medium">Required:</span> {form.required ? "Yes" : "No"}</p>
          <p><span className="font-medium">Unique:</span> {form.unique ? "Yes" : "No"}</p>
        </div>
      </div>
      <div>
        <h3 className="font-medium mb-2">Quick Links</h3>
        <div className="space-y-2">
          <Link to={`/objects/${objectApiName}/fields`}>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Database className="mr-2 h-4 w-4" />
              Fields List
            </Button>
          </Link>
        </div>
      </div>
    </div>
  ) : null;

  if (!form) {
    return (
      <MainLayout breadcrumbs={[{ label: "Objects", href: "/objects" }, { label: objectApiName }, { label: "Fields", href: `/objects/${objectApiName}/fields` }, { label: "Detail" }]}>
        <div className="text-center py-12 text-muted-foreground">Field not found.</div>
      </MainLayout>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((prev: any) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    if (!form.label.trim()) return "Label is required.";
    if (!form.apiName.trim()) return "API Name is required.";
    if (!/^([A-Za-z_][A-Za-z0-9_]*)$/.test(form.apiName)) return "API Name must start with a letter or underscore and contain only letters, numbers, and underscores.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await updateField(objectApiName!, fieldId!, { ...form, type: form.type as any });
      navigate(`/objects/${objectApiName}/fields`);
    } catch (err) {
      setError("Failed to update field.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout breadcrumbs={[{ label: "Objects", href: "/objects" }, { label: objectApiName }, { label: "Fields", href: `/objects/${objectApiName}/fields` }, { label: form.label }]} contextualSidebarContent={contextualSidebarContent}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 mb-1">
              <FileEdit className="h-7 w-7 text-muted-foreground" />
              Edit Field
            </h1>
            <p className="text-muted-foreground">Edit the details of this field. Changes will affect all records.</p>
          </div>
          <Link to={`/objects/${objectApiName}/fields`}><Button variant="outline">Back to Fields</Button></Link>
        </div>
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Field Details <Badge variant="secondary" className="ml-2">Required</Badge></CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Label</label>
                <Input name="label" value={form.label} onChange={handleChange} required maxLength={50} />
              </div>
              <div>
                <label className="block font-medium mb-1">API Name</label>
                <Input name="apiName" value={form.apiName} onChange={handleChange} required maxLength={50} />
                <div className="text-xs text-muted-foreground mt-1">Must be unique, start with a letter or underscore, and contain only letters, numbers, and underscores.</div>
              </div>
              <div>
                <label className="block font-medium mb-1">Type</label>
                <select name="type" value={form.type} onChange={handleChange} className="w-full border rounded p-2">
                  {FIELD_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="required" checked={form.required} onChange={handleChange} />
                  Required
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="unique" checked={form.unique} onChange={handleChange} />
                  Unique
                </label>
              </div>
              <div>
                <label className="block font-medium mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded p-2 min-h-[40px]" maxLength={200} />
              </div>
              <div>
                <label className="block font-medium mb-1">Help Text</label>
                <textarea name="helpText" value={form.helpText} onChange={handleChange} className="w-full border rounded p-2 min-h-[40px]" maxLength={200} />
              </div>
              {error && <div className="text-destructive text-sm">{error}</div>}
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </MainLayout>
  );
} 