import React, { useState } from "react";
import { useMetadata } from "@/contexts/metadata-context";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Info, Layers } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function ObjectCreate() {
  const { createObject } = useMetadata();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    label: "",
    apiName: "",
    pluralLabel: "",
    description: "",
    isCustom: true,
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value,
      }));
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
      const newObj = await createObject(form);
      navigate(`/objects/${newObj.apiName}`);
    } catch (err) {
      setError("Failed to create object.");
    } finally {
      setLoading(false);
    }
  };

  // Contextual sidebar content
  const contextualSidebarContent = (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">Object Creation Tips</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Info className="h-4 w-4" />
            Use clear, descriptive labels for your objects.
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Info className="h-4 w-4" />
            API Name must be unique and follow naming conventions.
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Info className="h-4 w-4" />
            You can add fields and layouts after creating the object.
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-medium mb-2">Quick Links</h3>
        <div className="space-y-2">
          <Link to="/objects/manager">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Layers className="mr-2 h-4 w-4" />
              Object Manager
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout breadcrumbs={[{ label: "Objects", href: "/objects" }, { label: "Create" }]} contextualSidebarContent={contextualSidebarContent}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 mb-1">
              <Plus className="h-7 w-7 text-muted-foreground" />
              Create Object
            </h1>
            <p className="text-muted-foreground">Define a new CRM object. You can add fields and layouts after creation.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Object Details <Badge variant="secondary" className="ml-2">Required</Badge></CardTitle>
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
                <label className="block font-medium mb-1">Plural Label</label>
                <Input name="pluralLabel" value={form.pluralLabel} onChange={handleChange} maxLength={50} />
              </div>
              <div>
                <label className="block font-medium mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded p-2 min-h-[60px]" maxLength={200} />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="isCustom" checked={form.isCustom} onChange={handleChange} />
                  Custom Object
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
                  Active
                </label>
              </div>
              {error && <div className="text-destructive text-sm">{error}</div>}
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Creating..." : "Create Object"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </MainLayout>
  );
} 