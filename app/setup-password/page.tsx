import { Suspense } from "react";
import SetupPasswordForm from "./setup-password-form";

export default function SetupPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<div>Loading...</div>}>
        <SetupPasswordForm />
      </Suspense>
    </div>
  );
}
