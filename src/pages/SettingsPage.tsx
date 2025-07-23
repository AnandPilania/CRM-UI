import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { Settings, Users, Database, Globe, Lock } from "lucide-react";

export default function SettingsPage() {
  const companyForm = useForm({
    defaultValues: {
      companyName: "Flexforce CRM",
      defaultLanguage: "en_US",
      defaultLocale: "United States",
      defaultTimezone: "America/Los_Angeles",
    }
  });

  const securityForm = useForm({
    defaultValues: {
      sessionTimeout: "2",
      passwordExpiration: "90",
      loginIpRanges: "",
      twoFactorAuth: true,
      lockoutAttempts: "5",
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your organization's settings and preferences</p>
      </div>

      <Tabs defaultValue="company" className="space-y-4">
        <TabsList>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Company Information
              </CardTitle>
              <CardDescription>
                Configure your organization's basic information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" value={companyForm.watch("companyName")} onChange={e => companyForm.setValue("companyName", e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="defaultLanguage">Default Language</Label>
                    <Input id="defaultLanguage" value={companyForm.watch("defaultLanguage")} onChange={e => companyForm.setValue("defaultLanguage", e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="defaultLocale">Default Locale</Label>
                    <Input id="defaultLocale" value={companyForm.watch("defaultLocale")} onChange={e => companyForm.setValue("defaultLocale", e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="defaultTimezone">Default Time Zone</Label>
                    <Input id="defaultTimezone" value={companyForm.watch("defaultTimezone")} onChange={e => companyForm.setValue("defaultTimezone", e.target.value)} />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Fiscal Year
              </CardTitle>
              <CardDescription>
                Configure your organization's fiscal year settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fiscalYearStart">Fiscal Year Start Month</Label>
                    <Input id="fiscalYearStart" value="January" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fiscalYearPattern">Fiscal Year Pattern</Label>
                    <Input id="fiscalYearPattern" value="Standard" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure your organization's security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                    <Input id="sessionTimeout" type="number" value={securityForm.watch("sessionTimeout")} onChange={e => securityForm.setValue("sessionTimeout", e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passwordExpiration">Password Expiration (days)</Label>
                    <Input id="passwordExpiration" type="number" value={securityForm.watch("passwordExpiration")} onChange={e => securityForm.setValue("passwordExpiration", e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lockoutAttempts">Failed Login Attempts Before Lockout</Label>
                    <Input id="lockoutAttempts" type="number" value={securityForm.watch("lockoutAttempts")} onChange={e => securityForm.setValue("lockoutAttempts", e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="loginIpRanges">Login IP Ranges (CIDR notation)</Label>
                    <Input id="loginIpRanges" placeholder="e.g., 192.168.1.0/24" value={securityForm.watch("loginIpRanges")} onChange={e => securityForm.setValue("loginIpRanges", e.target.value)} />
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                    <FormDescription>Require two-factor authentication for all users</FormDescription>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    checked={securityForm.watch("twoFactorAuth")}
                    onCheckedChange={value => securityForm.setValue("twoFactorAuth", value)}
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage users in your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p>User management interface would appear here.</p>
                <p className="text-muted-foreground mt-2">
                  This would include a table of users and options to add, edit, deactivate, and reset passwords.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Add User</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Data Management
              </CardTitle>
              <CardDescription>
                Manage your organization's data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Data Import</h3>
                  <p className="text-muted-foreground mb-4">Import data from CSV files</p>
                  <Button variant="outline">Import Data</Button>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium">Data Export</h3>
                  <p className="text-muted-foreground mb-4">Export data for backup or integration</p>
                  <Button variant="outline">Export Data</Button>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium">Storage Usage</h3>
                  <p className="text-muted-foreground mb-4">Current storage usage: 2.3 GB of 5 GB (46%)</p>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "46%" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
