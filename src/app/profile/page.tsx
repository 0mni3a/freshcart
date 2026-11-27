"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CheckCircle2, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import AuthLayout from "@/components/AuthLayout";
import FormField from "@/components/FormField";

const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must be at most 20 characters")
    .required("Name is required"),
  email: Yup.string().email("Invalid email"),
  phone: Yup.string().matches(
    /^01[0125][0-9]{8}$/,
    "Enter a valid Egyptian phone number"
  ),
});

const fields = [
  { name: "name", label: "Name", type: "text", autoComplete: "name" },
  { name: "email", label: "New email (optional)", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone (optional)", type: "tel", autoComplete: "tel" },
] as const;

export default function ProfilePage() {
  const router = useRouter();
  const { token, userName, isReady } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isReady && !token) router.push("/login");
  }, [isReady, token, router]);

  const formik = useFormik({
    initialValues: { name: userName ?? "", email: "", phone: "" },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError("");
      setSuccess("");
      try {
        await api("/users/updateMe/", {
          method: "PUT",
          headers: { token: token ?? "" },
          body: JSON.stringify(
            Object.fromEntries(
              Object.entries(values).filter(([, v]) => v.trim() !== "")
            )
          ),
        });
        setSuccess("Your profile was updated");
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
      title="My profile"
      subtitle="Update your personal information"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        {fields.map((f) => (
          <FormField
            key={f.name}
            id={f.name}
            name={f.name}
            label={f.label}
            type={f.type}
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
          {formik.isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </form>
    </AuthLayout>
  );
}