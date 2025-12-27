"use client";
import { Rocket } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export default function ComingSoon({ error }: { error?: string }) {
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        toast.error("Invalid token");
      }, 0);
    }
  }, [error]);

  return (
    <div className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div className="space-y-6 text-center">
        <div className="bg-background ring-primary/20 mx-auto flex w-fit items-center justify-center rounded-full p-4 ring-1">
          <Rocket className="text-primary h-12 w-12" />
        </div>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Coming Soon</h1>
        <p className="text-muted-foreground text-lg">
          {"We're building something amazing."} <br />
          Stay tuned!
        </p>
      </div>
    </div>
  );
}
