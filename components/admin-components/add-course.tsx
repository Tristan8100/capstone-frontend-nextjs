
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api2 } from "@/lib/api";

interface Institute {
  id: string;
  name: string;
}

interface AddCourseProps {
  institutes: Institute[];
  onSuccess?: () => void;
}

export function AddCourse({ institutes, onSuccess }: AddCourseProps) {
  const [name, setName] = useState("");
  const [instituteId, setInstituteId] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false); // control dialog open

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading("Adding course...");

    try {
      await api2.post("/api/courses-general", {
        name,
        full_name: fullName,
        institute_id: instituteId,
      });

      toast.success("Course added successfully!", { id: toastId });
      setOpen(false); // close modal
      setName("");
      setFullName("");
      setInstituteId("");
      if (onSuccess) onSuccess(); // trigger parent refresh
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to add course";
      toast.error(message, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Course</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Course</DialogTitle>
            <DialogDescription>
              Enter the Course name and Institute. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="full_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="institute">Institute</Label>
              <select
                id="institute"
                name="institute_id"
                value={instituteId}
                onChange={(e) => setInstituteId(e.target.value)}
                className="input border rounded-md px-3 py-2"
                required
              >
                <option value="">Select Institute</option>
                {institutes.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Add Course"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
