import { LogoutButton } from "@/components/logout-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isAuthenticated } from "@/lib/auth/requireAuth";
import { redirect } from "next/navigation";

export default async function UserDashboard() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    return redirect("/login");
  }

  return (
    <div className="bg-background min-h-screen p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">User Dashboard</h1>
          <LogoutButton userType="user" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome Back!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You are successfully logged in. This is your user dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
