import { NextRequest, NextResponse } from "next/server";
import { complaintStatuses } from "@/lib/zodSchemas";
import { connectToDB } from "@/lib/db";
import Complaint from "@/models/complaint";
import { notifyStatusUpdate } from "@/lib/email";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { status } = (await request.json()) as {
      status?: (typeof complaintStatuses)[number];
    };

    await connectToDB();
    const { id } = await context.params;
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return NextResponse.json({ message: "Complaint not found" }, { status: 404 });
    }

    if (status) complaint.status = status;
    await complaint.save();

    notifyStatusUpdate({
      title: complaint.title,
      status: complaint.status,
      updatedAt: new Date(),
    }).catch(err => console.error("[email] status update", err));

    return NextResponse.json(complaint);
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const { id } = await context.params;
    await Complaint.findByIdAndDelete(id);
    return NextResponse.json({ message: "Complaint deleted" });
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
