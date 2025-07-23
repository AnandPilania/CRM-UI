import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

const relationshipTypes = [
  { value: "Lookup", label: "Lookup Relationship" },
  { value: "Master-Detail", label: "Master-Detail Relationship" },
];

const mockObjects = [
  { value: "1", label: "Account" },
  { value: "2", label: "Contact" },
  { value: "3", label: "Opportunity" },
  { value: "4", label: "Project_c" },
  { value: "5", label: "Task_c" },
];

const formSchema = z.object({
  label: z.string().min(1, "Field Label is required"),
  name: z.string().min(1, "Field Name is required")
    .regex(/^[a-zA-Z0-9_]+$/, "Field API Name must contain only alphanumeric characters and underscores"),
  relationType: z.string().min(1, "Relationship Type is required"),
  relatedToObject: z.string().min(1, "Related Object is required"),
  helpText: z.string().optional(),
  isRequired: z.boolean().default(false),
  allowMultiple: z.boolean().default(false),
  cascadeDelete: z.boolean().default(false),
});

export function RelationshipForm({ objectId, relationshipId, isEdit = false }: { objectId?: string, relationshipId?: string, isEdit?: boolean }) {
  const navigate = useNavigate();

  // In a real app, you'd fetch the relationship data if in edit mode
  const defaultValues = isEdit ? {
    label: "Project Owner",
    name: "ProjectOwner__c",
    relationType: "Lookup",
    relatedToObject: "2", // Contact
    helpText: "The contact who owns this project",
    isRequired: true,
    allowMultiple: false,
    cascadeDelete: false,
  } : {
    label: "",
    name: "",
    relationType: "",
    relatedToObject: "",
    helpText: "",
    isRequired: false,
    allowMultiple: false,
    cascadeDelete: false,
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    // In a real app, you'd save the relationship to your backend
    navigate(`/objects/view/${objectId}`);
  };

  const selectedType = form.watch("relationType");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{isEdit ? "Edit Relationship" : "New Relationship"}</h1>
        <p className="text-muted-foreground">
          {isEdit
            ? "Modify the properties of this relationship"
            : "Create a new relationship between objects"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Relationship Properties</CardTitle>
          <CardDescription>Configure how this object relates to others</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="relationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {relationshipTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {selectedType === "Master-Detail"
                          ? "Master-Detail relationships create a tight dependency between objects"
                          : "Lookup relationships create a link between objects without making them dependent"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="relatedToObject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Related To</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an object" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockObjects.map((obj) => (
                            <SelectItem key={obj.value} value={obj.value}>
                              {obj.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The object this relationship connects to
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="label"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field Label</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Account" {...field} />
                        </FormControl>
                        <FormDescription>
                          How this relationship appears on page layouts
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Account__c" {...field} />
                        </FormControl>
                        <FormDescription>
                          The API name used in formulas and code
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="helpText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Help Text</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter help text for users working with this relationship"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This text displays in a tooltip when users hover over the field
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="isRequired"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Required
                        </FormLabel>
                        <FormDescription>
                          Make this relationship required for all records
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {selectedType === "Master-Detail" && (
                  <FormField
                    control={form.control}
                    name="cascadeDelete"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Cascade Delete
                          </FormLabel>
                          <FormDescription>
                            Delete child records when parent is deleted
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}

                {selectedType === "Lookup" && (
                  <FormField
                    control={form.control}
                    name="allowMultiple"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Allow Multiple
                          </FormLabel>
                          <FormDescription>
                            Allow multiple selections in this lookup
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => navigate(`/objects/view/${objectId}`)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isEdit ? "Save Changes" : "Create Relationship"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
