import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface ObjectCreateDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ObjectCreateDialog({ open, onClose }: ObjectCreateDialogProps) {
  const [label, setLabel] = useState("");
  const [pluralLabel, setPluralLabel] = useState("");
  const [apiName, setApiName] = useState("");
  const [description, setDescription] = useState("");
  const [allowReports, setAllowReports] = useState(true);
  const [allowActivities, setAllowActivities] = useState(true);
  const [allowSharing, setAllowSharing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLabelChange = (value: string) => {
    setLabel(value);
    // Auto-generate API name and plural label
    if (value) {
      const suggestedApiName = value.replace(/\s+/g, "_") + "__c";
      setApiName(suggestedApiName);

      // Simple pluralization - just add 's' if not already ending with 's'
      const suggestedPluralLabel = value.endsWith("s") ? value : value + "s";
      setPluralLabel(suggestedPluralLabel);
    }
  };

  const handleSubmit = () => {
    if (!label || !apiName || !pluralLabel) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success(`Custom Object "${label}" created successfully`);
      setIsSubmitting(false);
      resetForm();
      onClose();
    }, 1000);
  };

  const resetForm = () => {
    setLabel("");
    setPluralLabel("");
    setApiName("");
    setDescription("");
    setAllowReports(true);
    setAllowActivities(true);
    setAllowSharing(true);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Custom Object</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="label">Label<span className="text-red-500">*</span></Label>
            <Input
              id="label"
              placeholder="e.g., Project"
              value={label}
              onChange={(e) => handleLabelChange(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              This label appears in the user interface
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="plural-label">Plural Label<span className="text-red-500">*</span></Label>
            <Input
              id="plural-label"
              placeholder="e.g., Projects"
              value={pluralLabel}
              onChange={(e) => setPluralLabel(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="api-name">API Name<span className="text-red-500">*</span></Label>
            <Input
              id="api-name"
              placeholder="e.g., Project__c"
              value={apiName}
              onChange={(e) => setApiName(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Used in API calls and formulas
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the purpose of this object"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid gap-4">
            <Label>Features</Label>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Allow Reports</p>
                <p className="text-sm text-muted-foreground">Enable reporting on this object</p>
              </div>
              <Switch
                checked={allowReports}
                onCheckedChange={setAllowReports}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Allow Activities</p>
                <p className="text-sm text-muted-foreground">Associate tasks and events with this object</p>
              </div>
              <Switch
                checked={allowActivities}
                onCheckedChange={setAllowActivities}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Allow Sharing</p>
                <p className="text-sm text-muted-foreground">Enable record sharing for this object</p>
              </div>
              <Switch
                checked={allowSharing}
                onCheckedChange={setAllowSharing}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Object"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
