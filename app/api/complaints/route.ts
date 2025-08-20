import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Complaint from "@/models/complaint";
import { complaintSchema } from "@/lib/zodSchemas";
import { notifyNewComplaint } from "@/lib/email";
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    await connectToDB();
    const complaints = await Complaint.find({}).sort({ dateSubmitted: -1 });
    return NextResponse.json(complaints);
  } catch (error) {
    console.error("[GET /api/complaints]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = complaintSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    await connectToDB();

    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const newComplaint = await Complaint.create({
      userId: session.user.id,
      ...parsed.data,
      status: 'Pending',
      dateSubmitted: new Date(),
    });

    // send email
    notifyNewComplaint(parsed.data).catch((err) =>
      console.error("[email] new complaint", err)
    );

    return NextResponse.json(newComplaint, { status: 201 });
  } catch (error) {
    console.error("[POST /api/complaints]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
