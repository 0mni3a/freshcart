"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { api } from "@/lip/api";
import { useAuth } from "@/context/AuthContext";

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
  { name: "name", label: "Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone", type: "tel" },
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
    <main className="mx-auto max-w-md p-8">
      <h1 className="mb-6 text-2xl font-bold">My Profile</h1>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {fields.map((f) => (
          <div key={f.name}>
            <label htmlFor={f.name} className="mb-1 block text-sm font-medium">
              {f.label}
            </label>
            <input
              id={f.name}
              name={f.name}
              type={f.type}
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
          {formik.isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </form>
    </main>
  );
}