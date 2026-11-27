"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { api } from "@/lip/api";
import { useAuth } from "@/context/AuthContext";
import AuthLayout from "@/components/AuthLayout";
import FormField from "@/components/FormField";

type Step = "email" | "code" | "reset";

const buttonClass =
  "flex w-full items-center justify-center gap-2 rounded-full bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60";

const steps: { key: Step; label: string }[] = [
  { key: "email", label: "Email" },
  { key: "code", label: "Code" },
  { key: "reset", label: "Password" },
];

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const currentIndex = steps.findIndex((s) => s.key === step);

  async function run(action: () => Promise<void>) {
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function sendEmail(e: React.FormEvent) {
    e.preventDefault();
    run(async () => {
      await api("/auth/forgotPasswords", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setMessage("A reset code was sent to your email");
      setStep("code");
    });
  }

  function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    run(async () => {
      await api("/auth/verifyResetCode", {
        method: "POST",
        body: JSON.stringify({ resetCode: code }),
      });
      setStep("reset");
    });
  }

  function resetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    run(async () => {
      const data = await api<{ token: string }>("/auth/resetPassword", {
        method: "PUT",
        body: JSON.stringify({ email, newPassword }),
      });
      login(data.token);
      router.push("/");
    });
  }

  const submitLabel = (idle: string, busy: string) => (
    <>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {loading ? busy : idle}
    </>
  );

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="No problem, we will help you get back in"
      footer={
        <>
          Remembered it?{" "}
          <Link
            href="/login"
            className="font-semibold text-green-700 hover:underline"
          >
            Back to login
          </Link>
        </>
      }
    >
      {/* مؤشر الخطوات */}
      <ol className="mb-6 flex items-center gap-2 text-xs font-medium">
        {steps.map((s, i) => (
          <li key={s.key} className="flex flex-1 items-center gap-2">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                i < currentIndex
                  ? "bg-green-600 text-white"
                  : i === currentIndex
                  ? "bg-green-100 text-green-800 ring-2 ring-green-600"
                  : "bg-stone-100 text-stone-400"
              }`}
            >
              {i < currentIndex ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </span>
            <span
              className={
                i <= currentIndex ? "text-stone-800" : "text-stone-400"
              }
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <span
                className={`h-px flex-1 ${
                  i < currentIndex ? "bg-green-600" : "bg-stone-200"
                }`}
              />
            )}
          </li>
        ))}
      </ol>

      {message && (
        <p className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </p>
      )}
      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {step === "email" && (
        <form onSubmit={sendEmail} className="space-y-5">
          <FormField
            id="email"
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" disabled={loading} className={buttonClass}>
            {submitLabel("Send code", "Sending...")}
          </button>
        </form>
      )}

      {step === "code" && (
        <form onSubmit={verifyCode} className="space-y-5">
          <FormField
            id="code"
            name="code"
            label={`Enter the code sent to ${email}`}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button type="submit" disabled={loading} className={buttonClass}>
            {submitLabel("Verify code", "Verifying...")}
          </button>
        </form>
      )}

      {step === "reset" && (
        <form onSubmit={resetPassword} className="space-y-5">
          <FormField
            id="newPassword"
            name="newPassword"
            label="New password"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button type="submit" disabled={loading} className={buttonClass}>
            {submitLabel("Reset password", "Saving...")}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}