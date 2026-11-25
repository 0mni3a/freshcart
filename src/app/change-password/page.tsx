"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { api } from "@/lip/api";
import { useAuth } from "@/context/AuthContext";

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
  { name: "currentPassword", label: "Current Password" },
  { name: "password", label: "New Password" },
  { name: "rePassword", label: "Confirm New Password" },
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
    <main className="mx-auto max-w-md p-8">
      <h1 className="mb-6 text-2xl font-bold">Change Password</h1>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {fields.map((f) => (
          <div key={f.name}>
            <label htmlFor={f.name} className="mb-1 block text-sm font-medium">
              {f.label}
            </label>
            <input
              id={f.name}
              name={f.name}
              type="password"
              value={formik.values[f.name]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded border p-2 focus:border-green-600 focus:outline-none"
            />
            {formik.touched[f.name] && formik.errors[f.name] && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors[f.name]}
              </p>
            )}
          </div>
        ))}

        {error && (
          <p className="rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>
        )}
        {success && (
          <p className="rounded bg-green-50 p-2 text-sm text-green-700">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full rounded bg-green-600 p-2 text-white hover:bg-green-700 disabled:opacity-50"
        >
          {formik.isSubmitting ? "Saving..." : "Change password"}
        </button>
      </form>
    </main>
  );
}