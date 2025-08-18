import { z } from "zod";

export const complaintCategories = ["Product", "Service", "Support"] as const;
export const complaintPriorities = ["Low", "Medium", "High"] as const;
export const complaintStatuses = [
  "Pending",
  "In Progress",
  "Resolved",
] as const;

export const complaintSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must not exceed 100 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" }),
  category: z.enum(complaintCategories, { message: "Category is required" }),
  priority: z.enum(complaintPriorities, { message: "Priority is required" }),
});

export type ComplaintSchemaType = z.infer<typeof complaintSchema>;