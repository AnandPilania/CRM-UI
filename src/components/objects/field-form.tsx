import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

const fieldTypes = [
  { value: "Text", label: "Text" },
  { value: "Number", label: "Number" },
  { value: "Date", label: "Date" },
  { value: "DateTime", label: "Date/Time" },
  { value: "Checkbox", label: "Checkbox" },
  { value: "Picklist", label: "Picklist" },
  { value: "Multi-Select Picklist", label: "Multi-Select Picklist" },
  { value: "Lookup", label: "Lookup Relationship" },
  { value: "Master-Detail", label: "Master-Detail Relationship" },
  { value: "Formula", label: "Formula" },
  { value: "Long Text Area", label: "Long Text Area" },
  { value: "Rich Text", label: "Rich Text" },
  { value: "URL", label: "URL" },
  { value: "Email", label: "Email" },
  { value: "Phone", label: "Phone" },
  { value: "Currency", label: "Currency" },
  { value: "Percent", label: "Percent" },
  { value: "Auto Number", label: "Auto Number" },
];

const formSchema = z.object({
  label: z.string().min(1, "Field Label is required"),
  name: z.string().min(1, "Field Name is required")
    .regex(/^[a-zA-Z0-9_]+$/, "Field API Name must contain only alphanumeric characters and underscores"),
  dataType: z.string().min(1, "Field Type is required"),
  helpText: z.string().optional(),
  isRequired: z.boolean().default(false),
  isUnique: z.boolean().default(false),
  defaultValue: z.string().optional(),
  length: z.coerce.number().positive().optional(),
  precision: z.coerce.number().positive().optional(),
  scale: z.coerce.number().positive().optional(),
  picklistValues: z.string().optional(),
});

export function FieldForm({ objectId, fieldId, isEdit = false }: { objectId?: string, fieldId?: string, isEdit?: boolean }) {
  const navigate = useNavigate();

  // In a real app, you'd fetch the field data if in edit mode
  const defaultValues = isEdit ? {
    label: "Status",
    name: "Status_c",
    dataType: "Picklist",
    helpText: "Current status of the project",
    isRequired: true,
    isUnique: false,
    defaultValue: "New",
    picklistValues: "New\nIn Progress\nOn Hold\nCompleted\nCancelled"
  } : {
    label: "",
    name: "",
    dataType: "",
    helpText: "",
    isRequired: false,
    isUnique: false,
    defaultValue: "",
    picklistValues: ""
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    // In a real app, you'd save the field to your backend
    navigate(`/objects/view/${objectId}`);
  };

  const selectedType = form.watch("dataType");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{isEdit ? "Edit Field" : "New Field"}</h1>
        <p className="text-muted-foreground">
          {isEdit
            ? "Modify the properties of this field"
            : "Create a new field on this object"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Field Properties</CardTitle>
          <CardDescription>Configure the basic properties of this field</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="label"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field Label</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Status" {...field} />
                        </FormControl>
                        <FormDescription>
                          The display name shown on page layouts
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
                          <Input placeholder="e.g. Status_c" {...field} />
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
                  name="dataType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select field type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {fieldTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The data type determines how the field is stored and displayed
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="helpText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Help Text</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter help text for users filling out this field"
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
                          Required Field
                        </FormLabel>
                        <FormDescription>
                          Make this field mandatory for all records
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

                <FormField
                  control={form.control}
                  name="isUnique"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Unique Field
                        </FormLabel>
                        <FormDescription>
                          Enforce unique values across all records
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
              </div>

              {/* Default value field */}
              <FormField
                control={form.control}
                name="defaultValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Value</FormLabel>
                    <FormControl>
                      <Input placeholder="Default value for this field" {...field} />
                    </FormControl>
                    <FormDescription>
                      Value automatically populated when creating new records
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Type-specific fields */}
              {selectedType === "Text" && (
                <FormField
                  control={form.control}
                  name="length"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Length</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Maximum number of characters (1-255)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {selectedType === "Number" && (
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="precision"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precision</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          Total number of digits
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="scale"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Scale</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          Number of decimal places
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {(selectedType === "Picklist" || selectedType === "Multi-Select Picklist") && (
                <FormField
                  control={form.control}
                  name="picklistValues"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Picklist Values</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter each value on a new line"
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter each value on a separate line
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => navigate(`/objects/view/${objectId}`)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isEdit ? "Save Changes" : "Create Field"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
