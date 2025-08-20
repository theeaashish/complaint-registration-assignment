"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  complaintCategories,
  complaintPriorities,
  complaintSchema,
  ComplaintSchemaType,
} from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";

const ComplaintForm = () => {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ComplaintSchemaType>({
    resolver: zodResolver(complaintSchema),
  });

  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (data: ComplaintSchemaType) => {
    setServerError(null);
    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Something went wrong");
      reset();
      toast.success("Complaint registered successfully");
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      setServerError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block mb-1 font-medium">Title</label>
        <Input
          className="border placeholder:text-gray-400 text-sm border-zinc-400"
          {...register("title")}
          placeholder="Issue with product X"
        />
        {errors.title && (
          <p className="text-destructive text-sm mt-1">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          {...register("description")}
          className="w-full border-zinc-400 rounded-md p-3 text-sm dark:bg-input/30 bg-transparent border"
          rows={4}
          placeholder="Describe your issue here..."
        />
        {errors.description && (
          <p className="text-destructive text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Category</label>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full border placeholder:text-gray-400 text-sm border-zinc-400">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {complaintCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.category && (
          <p className="text-destructive text-sm mt-1">
            {errors.category.message}
          </p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Priority</label>
        <div className="flex gap-6">
          {complaintPriorities.map((prio) => (
            <label
              key={prio}
              className="flex items-center gap-1 cursor-pointer"
            >
              <input
                type="radio"
                value={prio}
                {...register("priority")}
                className="accent-primary"
              />
              {prio}
            </label>
          ))}
        </div>
        {errors.priority && (
          <p className="text-destructive text-sm mt-1">
            {errors.priority.message}
          </p>
        )}
      </div>

      {serverError && <p className="text-destructive text-sm">{serverError}</p>}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? "Submitting..." : "Submit Complaint"}
      </Button>
    </form>
  );
};

export default ComplaintForm;
