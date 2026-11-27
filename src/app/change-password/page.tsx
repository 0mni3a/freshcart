"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CheckCircle2, Loader2 } from "lucide-react";
import { api } from "@/lip/api";
import { useAuth } from "@/context/AuthContext";
import AuthLayout from "@/components/AuthLayout";
import FormField from "@/components/FormField";

const validationSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  rePassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords don't match")
    .required("Please confirm your new password"),
});

const fields = [
  {
    name: "currentPassword",
    label: "Current Password",
    autoComplete: "current-password",
  },
  { name: "password", label: "New Password", autoComplete: "new-password" },
  {
    name: "rePassword",
    label: "Confirm New Password",
    autoComplete: "new-password",
  },
] as const;

export default function ChangePasswordPage() {
  const router = useRouter();
  const { token, isReady, login } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isReady && !token) router.push("/login");
  }, [isReady, token, router]);

  const formik = useFormik({
    initialValues: { currentPassword: "", password: "", rePassword: "" },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setError("");
      setSuccess("");
      try {
        const data = await api<{ token: string }>("/users/changeMyPassword", {
          method: "PUT",
          headers: { token: token ?? "" },
          body: JSON.stringify(values),
        });
        login(data.token);
        setSuccess("Password changed successfully");
        resetForm();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (!isReady || !token) return null;

  return (
    <AuthLayout
      title="Change password"
      subtitle="Choose a new password for your account"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        {fields.map((f) => (
          <FormField
            key={f.name}
            id={f.name}
            name={f.name}
            label={f.label}
            type="password"
            autoComplete={f.autoComplete}
            value={formik.values[f.name]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched[f.name] && formik.errors[f.name]}
          />
        ))}

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}
        {success && (
          <p className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
        >
          {formik.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {formik.isSubmitting ? "Saving..." : "Change password"}
        </button>
      </form>
    </AuthLayout>
  );
}