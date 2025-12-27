import { LogoutButton } from "@/components/logout-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isAdminAuthenticated } from "@/lib/auth/requireAdminAuth";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return redirect("/admin/login");
  }

  return (
    <div className="bg-background min-h-screen p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-primary text-3xl font-bold">Admin Dashboard</h1>
          <LogoutButton userType="admin" />
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Admin Control Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You are logged in as an administrator. You have access to system settings.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
