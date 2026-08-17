"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/validations";
import Button from "@/components/ui/Button";

export default function InquiryForm({ productName }: { productName: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactInput) => {
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, subject: `Inquiry: ${productName}` }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return <p className="mt-6 rounded-button bg-green-50 p-4 text-sm text-green-700">Thanks — we received your inquiry and will be in touch shortly.</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
      <div>
        <input
          {...register("name")}
          placeholder="Full name"
          className="w-full rounded-button border border-brand-border px-4 py-3 text-sm"
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>
      <div>
        <input
          {...register("email")}
          placeholder="Email address"
          className="w-full rounded-button border border-brand-border px-4 py-3 text-sm"
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>
      <div>
        <textarea
          {...register("message")}
          rows={4}
          placeholder="What do you need?"
          className="w-full rounded-button border border-brand-border px-4 py-3 text-sm"
        />
        {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>}
      </div>
      <Button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Send Inquiry"}
      </Button>
      {status === "error" && (
        <p className="text-xs text-red-600">Something went wrong — please try again.</p>
      )}
    </form>
  );
}
