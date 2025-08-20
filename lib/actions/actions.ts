"use server";

import Complaint from "@/models/complaint";
import { ComplaintSchemaType } from "../zodSchemas";
import { notifyNewComplaint, notifyStatusUpdate } from "../email";
import { login, register } from "../auth";
import { connectToDB } from "../db";
import { complaintStatuses } from "../zodSchemas";

export async function loginAction(formData: FormData) {
  return login(formData);
}

export async function registerAction(formData: FormData) {
  return register(formData);
}

// ----- Complaint CRUD Server Actions -----

export async function createComplaintAction(data: ComplaintSchemaType) {
  "use server";
  try {
    await connectToDB();
    const complaint = await Complaint.create({
      ...data,
      status: "Pending",
      dateSubmitted: new Date(),
    });
    // send email
    notifyNewComplaint(data).catch((e) => console.error("[email] new complaint", e));
    return JSON.parse(JSON.stringify(complaint));
  } catch (error) {
    console.error("[createComplaintAction]", error);
    throw new Error("Failed to create complaint");
  }
}

export async function updateComplaintStatusAction(
  id: string,
  status: (typeof complaintStatuses)[number]
) {
  "use server";
  try {
    await connectToDB();
    const complaint = await Complaint.findById(id);
    if (!complaint) throw new Error("Complaint not found");
    complaint.status = status;
    await complaint.save();
    notifyStatusUpdate({ title: complaint.title, status, updatedAt: new Date() }).catch((e) =>
      console.error("[email] status update", e)
    );
    return JSON.parse(JSON.stringify(complaint));
  } catch (error) {
    console.error("[updateComplaintStatusAction]", error);
    throw error;
  }
}

export async function deleteComplaintAction(id: string) {
  "use server";
  try {
    await connectToDB();
    await Complaint.findByIdAndDelete(id);
  } catch (error) {
    console.error("[deleteComplaintAction]", error);
    throw error;
  }
}

export async function getComplaints(
  filters: { status?: (typeof complaintStatuses)[number]; priority?: string } = {}
) {
  try {
    await connectToDB();
    const query: Record<string, unknown> = {};
    if (filters.status && complaintStatuses.includes(filters.status)) {
      query.status = filters.status;
    }
    if (filters.priority) {
      query.priority = filters.priority;
    }
    const complaints = await Complaint.find(query)
      .sort({ dateSubmitted: -1 })
      .lean();
    return JSON.parse(JSON.stringify(complaints));
  } catch (error) {
    console.error("Failed to fetch complaints:", error);
    return [];
  }
}
