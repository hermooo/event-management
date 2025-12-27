import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import AdminLoginForm from "@/components/auth/admin-login-form";

export default function AdminLoginPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Card className="border-primary/20 w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-primary flex items-center gap-2 text-2xl font-bold">
            <ShieldCheck className="h-6 w-6" /> Admin Portal
          </CardTitle>
          <CardDescription>Secure access for organization administrators</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminLoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
