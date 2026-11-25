"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lip/api";
import { useAuth } from "@/context/AuthContext";

type Step = "email" | "code" | "reset";

const inputClass =
  "w-full rounded border p-2 focus:border-green-600 focus:outline-none";
const buttonClass =
  "w-full rounded bg-green-600 p-2 text-white hover:bg-green-700 disabled:opacity-50";

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

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="mb-6 text-2xl font-bold">Forgot Password</h1>

      {message && (
        <p className="mb-4 rounded bg-green-50 p-2 text-sm text-green-700">
          {message}
        </p>
      )}
      {error && (
        <p className="mb-4 rounded bg-red-50 p-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {step === "email" && (
        <form onSubmit={sendEmail} className="space-y-4">
          <label htmlFor="email" className="block text-sm font-medium">
            Enter your email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
          <button type="submit" disabled={loading} className={buttonClass}>
            {loading ? "Sending..." : "Send code"}
          </button>
        </form>
      )}

      {step === "code" && (
        <form onSubmit={verifyCode} className="space-y-4">
          <label htmlFor="code" className="block text-sm font-medium">
            Enter the code sent to {email}
          </label>
          <input
            id="code"
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={inputClass}
          />
          <button type="submit" disabled={loading} className={buttonClass}>
            {loading ? "Verifying..." : "Verify code"}
          </button>
        </form>
      )}

      {step === "reset" && (
        <form onSubmit={resetPassword} className="space-y-4">
          <label htmlFor="newPassword" className="block text-sm font-medium">
            New password
          </label>
          <input
            id="newPassword"
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={inputClass}
          />
          <button type="submit" disabled={loading} className={buttonClass}>
            {loading ? "Saving..." : "Reset password"}
          </button>
        </form>
      )}
    </main>
  );
}