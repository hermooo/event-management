import { validateEmail } from "@/lib/validators";
import { useRouter } from "next/navigation";
import { useState } from "react";

// hooks/useLoginForm.ts
export function useLoginForm(apiEndpoint: string, redirectPath: string) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      setLoading(false);
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned an invalid response");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      router.push(redirectPath);
    } catch (err: unknown) {
      if (!(err instanceof Error)) {
        setError("Something went wrong. Please try again");
        return;
      }

      if (err.name === "AbortError") {
        setError("Request timed out. Please try again");
        return;
      }

      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { onSubmit, loading, error };
}
