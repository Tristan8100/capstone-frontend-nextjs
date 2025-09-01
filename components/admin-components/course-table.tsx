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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

  // State to track which course is being deleted
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Loading states
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInstitutesLoading, setIsInstitutesLoading] = useState(true);

  const fetchCourses = async (page = 1) => {
    setIsLoading(true);
    try {
      const params: any = { page };
      if (search) params.search = search;
      if (instituteFilter) params.institute_id = instituteFilter;

      const res = await api2.get<PaginatedResponse<Course>>("/api/courses-general", { params });
      setCourses(res.data.data);
      setTotalPages(res.data.last_page);
    } catch {
      toast.error("Failed to fetch courses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(page);
  }, [page, search, instituteFilter]);

  useEffect(() => {
    const fetchInstitutes = async () => {
      setIsInstitutesLoading(true);
      try {
        const res = await api2.get<{ id: string; name: string }[]>("/api/institutes");
        setInstitutes(res.data);
      } catch (error) {
        toast.error("Failed to fetch institutes");
      } finally {
        setIsInstitutesLoading(false);
      }
    };

    fetchInstitutes();
  }, []);
  
  const handleUpdate = async () => {
    if (!editingCourse) return;
    
    setIsUpdating(true);
    try {
      await api2.put(`/api/courses-general/${editingCourse.id}`, formData);
      toast.success("Course updated");
      fetchCourses(page);
    } catch {
      toast.error("Failed to update course");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!courseToDelete) return;
    
    setIsDeleting(true);
    try {
      await api2.delete(`/api/courses-general/${courseToDelete}`);
      toast.success("Course deleted");
      fetchCourses(1);
    } catch {
      toast.error("Delete failed");
    } finally {
      setIsDeleting(false);
      setCourseToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openDeleteDialog = (id: string) => {
    setCourseToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const openEditDialog = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      full_name: course.full_name,
      institute_id: course.institute?.id || "",
    });
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full sm:max-w-sm"
          />
          <select
            value={instituteFilter}
            onChange={(e) => {
              setInstituteFilter(e.target.value);
              setPage(1);
            }}
            className="border rounded-md px-3 py-2 w-full sm:w-auto"
            disabled={isInstitutesLoading}
          >
            <option value="">All Institutes</option>
            {isInstitutesLoading ? (
              <option value="" disabled>Loading institutes...</option>
            ) : (
              institutes.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name}
                </option>
              ))
            )}
          </select>
        </div>
        <AddCourse institutes={institutes} onSuccess={() => fetchCourses()} />
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Name</TableHead>
              <TableHead className="whitespace-nowrap">Full Name</TableHead>
              <TableHead className="whitespace-nowrap">Institute</TableHead>
              <TableHead className="whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading state
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="flex justify-center items-center">
                    <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading courses...
                  </div>
                </TableCell>
              </TableRow>
            ) : courses.length > 0 ? (
              // Data loaded with courses
              courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="whitespace-nowrap">{course.name}</TableCell>
                  <TableCell className="whitespace-nowrap">{course.full_name}</TableCell>
                  <TableCell className="whitespace-nowrap">{course.institute?.name || "-"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto"
                            onClick={() => openEditDialog(course)}
                          >
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
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
                          <div className="flex flex-col sm:flex-row justify-end gap-2">
                            <Button 
                              onClick={handleUpdate} 
                              className="w-full sm:w-auto"
                              disabled={isUpdating}
                            >
                              {isUpdating ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Saving...
                                </>
                              ) : (
                                "Save"
                              )}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <AlertDialog open={isDeleteDialogOpen && courseToDelete === course.id} onOpenChange={setIsDeleteDialogOpen}>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="w-full sm:w-auto"
                            onClick={() => openDeleteDialog(course.id)}
                            disabled={isDeleting && courseToDelete === course.id}
                          >
                            {isDeleting && courseToDelete === course.id ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Deleting...
                              </>
                            ) : (
                              "Delete"
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the course "{course.name}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel 
                              onClick={() => setIsDeleteDialogOpen(false)}
                              disabled={isDeleting}
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={handleDelete}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              disabled={isDeleting}
                            >
                              {isDeleting ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Deleting...
                                </>
                              ) : (
                                "Delete"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // No data state (loading complete but no courses found)
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  No courses found. Try adjusting your search filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Button
            variant="outline"
            disabled={page === 1 || isLoading}
            onClick={() => setPage(page - 1)}
            className="w-full sm:w-auto"
          >
            Previous
          </Button>
          <span className="text-center">Page {page} of {totalPages}</span>
          <Button
            variant="outline"
            disabled={page === totalPages || isLoading}
            onClick={() => setPage(page + 1)}
            className="w-full sm:w-auto"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}