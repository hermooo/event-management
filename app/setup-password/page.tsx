import { Suspense } from "react";
import SetupPasswordForm from "./setup-password-form";
import { redirect } from "next/navigation";

export default async function SetupPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return redirect("/?error=invalid_token");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<div>Loading...</div>}>
        <SetupPasswordForm token={token} />
      </Suspense>
    </div>
  );
}
