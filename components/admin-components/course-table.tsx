"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { api2 } from "@/lib/api";
import { AddCourse } from "./add-course";

interface Course {
  id: string;
  name: string;
  full_name: string;
  institute: {
    id: string;
    name: string;
  };
}

interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export function CoursesTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [courses, setCourses] = useState<Course[]>([]);
  const [institutes, setInstitutes] = useState<{ id: string; name: string }[]>([]);
  const [instituteFilter, setInstituteFilter] = useState("");

  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    full_name: "",
    institute_id: "",
  });

  const fetchCourses = async (page = 1) => {
    try {
      const params: any = { page };
      if (search) params.search = search;
      if (instituteFilter) params.institute_id = instituteFilter;

      const res = await api2.get<PaginatedResponse<Course>>("/api/courses-general", { params });
      setCourses(res.data.data);
      setTotalPages(res.data.last_page);
    } catch {
      toast.error("Failed to fetch courses");
    }
  };

  useEffect(() => {
    fetchCourses(page);
  }, [page, search, instituteFilter]);

  useEffect(() => {
    api2.get<{ id: string; name: string }[]>("/api/institutes").then((res) => setInstitutes(res.data)); //might try again
  }, []);

  const handleUpdate = async () => {
    if (!editingCourse) return;
    try {
      await api2.put(`/api/courses-general/${editingCourse.id}`, formData);
      toast.success("Course updated");
      fetchCourses(page);
    } catch {
      toast.error("Failed to update course");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      await api2.delete(`/api/courses-general/${id}`);
      toast.success("Course deleted");
      fetchCourses(1);
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-sm"
          />
          <select
            value={instituteFilter}
            onChange={(e) => {
              setInstituteFilter(e.target.value);
              setPage(1);
            }}
            className="border rounded-md px-3 py-2"
          >
            <option value="">All Institutes</option>
            {institutes.map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.name}
              </option>
            ))}
          </select>
        </div>
        <AddCourse institutes={institutes} onSuccess={() => fetchCourses()} />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Institute</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length > 0 ? (
            courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.name}</TableCell>
                <TableCell>{course.full_name}</TableCell>
                <TableCell>{course.institute?.name || "-"}</TableCell>
                <TableCell className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingCourse(course);
                          setFormData({
                            name: course.name,
                            full_name: course.full_name,
                            institute_id: course.institute?.id || "",
                          });
                        }}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Program</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <Input
                          placeholder="Course Name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <Input
                          placeholder="Full Name"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        />
                        <select
                          value={formData.institute_id}
                          onChange={(e) => setFormData({ ...formData, institute_id: e.target.value })}
                          className="border rounded-md px-3 py-2 w-full"
                        >
                          {institutes.map((inst) => (
                            <option key={inst.id} value={inst.id}>
                              {inst.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button onClick={handleUpdate}>Save</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(course.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No courses found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span>Page {page} of {totalPages}</span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
