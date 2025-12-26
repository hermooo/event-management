import { LogoutButton } from "@/components/logout-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
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
