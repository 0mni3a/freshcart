"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import AuthLayout from "@/components/AuthLayout";
import FormField from "@/components/FormField";

const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must be at most 20 characters")
    .required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^01[0125][0-9]{8}$/, "Enter a valid Egyptian phone number")
    .required("Phone is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  rePassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords don't match")
    .required("Please confirm your password"),
});

const fields = [
  { name: "name", label: "Name", type: "text", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  {
    name: "password",
    label: "Password",
    type: "password",
    autoComplete: "new-password",
  },
  {
    name: "rePassword",
    label: "Confirm Password",
    type: "password",
    autoComplete: "new-password",
  },
] as const;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      rePassword: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError("");
      try {
        await api("/auth/signup", {
          method: "POST",
          body: JSON.stringify(values),
        });
        router.push("/login");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join FreshCart and start shopping"
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-green-700 hover:underline"
          >
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4">
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

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
        >
          {formik.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {formik.isSubmitting ? "Creating account..." : "Register"}
        </button>
      </form>
    </AuthLayout>
  );
}