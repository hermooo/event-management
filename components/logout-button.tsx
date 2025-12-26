"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";

interface LogoutButtonProps {
  userType?: "user" | "admin";
  className?: string;
}

export function LogoutButton({ userType = "user", className }: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const endpoint = userType === "admin" ? "/api/admin/auth/logout" : "/api/auth/logout";
      await fetch(endpoint, {
        method: "POST",
      });

      // Redirect to login page
      const loginPath = userType === "admin" ? "/admin/login" : "/login";
      router.push(loginPath);
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="ghost" onClick={handleLogout} disabled={loading} className={className}>
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="mr-2 h-4 w-4" />
      )}
      Logout
    </Button>
  );
}
