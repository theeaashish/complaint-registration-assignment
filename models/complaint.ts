import {
  complaintCategories,
  complaintPriorities,
  complaintStatuses,
} from "@/lib/zodSchemas";
import { Document, Model, Schema, Types, model, models } from "mongoose";

export interface Complaint extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  description: string;
  category: (typeof complaintCategories)[number];
  priority: (typeof complaintPriorities)[number];
  status: (typeof complaintStatuses)[number];
}

const ComplaintSchema: Schema<Complaint> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, enum: complaintCategories, required: true },
    priority: { type: String, enum: complaintPriorities, required: true },
    status: { type: String, enum: complaintStatuses, default: "Pending" },
  },
  {
    timestamps: true,
  }
);

const Complaint: Model<Complaint> = models.Complaint || model<Complaint>('Complaint', ComplaintSchema);

export default Complaint;
