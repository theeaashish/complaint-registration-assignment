"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { complaintStatuses } from "@/lib/zodSchemas";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

type ComplaintItem = {
  _id: string;
  title: string;
  category: string;
  priority: string;
  status: (typeof complaintStatuses)[number];
  dateSubmitted?: string;
  createdAt?: string;
};

interface AdminDashboardProps {
  complaints: ComplaintItem[];
}

export default function AdminDashboard({
  complaints: initial,
}: AdminDashboardProps) {
  const [complaints, setComplaints] = useState<ComplaintItem[]>(initial);

  async function updateStatus(
    id: string,
    status: (typeof complaintStatuses)[number]
  ) {
    const res = await fetch(`/api/complaints/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      setComplaints((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status } : c))
      );
    } else {
      console.error("[updateStatus] failed", await res.text());
    }
  }

  async function deleteComplaint(id: string) {
    const res = await fetch(`/api/complaints/${id}`, { method: "DELETE" });
    if (res.ok) {
      setComplaints((prev) => prev.filter((c) => c._id !== id));
      toast.success("Complaint deleted successfully! Try refreshing to see the changes.");
    } else {
      console.error("[deleteComplaint] failed", await res.text());
      toast.error("Failed to delete complaint. Please try again.");
    }
  }

  if (!complaints.length) {
    return <p className="text-muted-foreground">No complaints found.</p>;
  }

  return (
    <div className="overflow-auto rounded-lg border">
      <table className="min-w-full divide-y divide-border text-sm">
        <thead className="bg-muted/40">
          <tr>
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Priority</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {complaints.map((item) => (
            <tr key={item._id} className="whitespace-nowrap">
              <td
                className="px-4 py-2 text-left max-w-[200px] truncate"
                title={item.title}
              >
                {item.title}
              </td>
              <td className="px-4 py-2 text-center">{item.category}</td>
              <td className="px-4 py-2 text-center">{item.priority}</td>
              <td className="px-4 py-2 text-center">
                {(() => {
                  const dateStr = item.dateSubmitted ?? item.createdAt;
                  return dateStr ? new Date(dateStr).toLocaleDateString() : "-";
                })()}
              </td>
              <td className="px-4 py-2 text-center">
                <Select
                  value={item.status}
                  onValueChange={(value: typeof complaintStatuses[number]) =>
                    updateStatus(item._id, value)
                  }
                >
                  <SelectTrigger className="w-[120px] text-xs border-input dark:bg-input/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {complaintStatuses.map((status) => (
                      <SelectItem
                        key={status}
                        value={status}
                        className="text-xs"
                      >
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
              <td className="px-4 py-2 text-center">
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => deleteComplaint(item._id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
