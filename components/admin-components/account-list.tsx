"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Eye } from "lucide-react"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api2 } from "@/lib/api"


interface Alumni {
  id: string;
  firstName: string;
  lastName: string;
  course: string;
  institute: string;
  data: any;
  total: number;
  current_page: number;
  last_page: number;
}

// Define types for Institutes and Courses
interface Institute {
  id: string;
  name: string;
}

interface Course {
  id: string;
  name: string;
  institute_id: string;
}
interface AddInstituteProps {
  onSuccess: () => Promise<void>;
}
export function AccountTable() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInstituteId, setSelectedInstituteId] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);



  // 1. Fetch Institutes
  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const response = await api2.get<Institute[]>('/api/institutes');
        setInstitutes(response.data);
      } catch (err) {
        console.error("Error fetching institutes:", err);
        setError("Failed to load institutes.");
      }
    };
    fetchInstitutes();
  }, []);

  // 2. Fetch Courses based on selected institute
  useEffect(() => {
    const fetchCourses = async () => {
      setCourses([]); //Clear courses if institute changes
      if (selectedInstituteId) {
        try {
          const response = await api2.get<Course[]>(`/api/courses?institute_id=${selectedInstituteId}`);
          setCourses(response.data);
        } catch (err) {
          console.error("Error fetching courses:", err);
          setError("Failed to load courses.");
        }
      } else {
        try {
            const response = await api2.get<Course[]>(`/api/courses`); // Fetch all courses if no specific institute is chosen
            setCourses(response.data);
        } catch (err) {
            console.error("Error fetching all courses:", err);
            setError("Failed to load all courses.");
        }
      }
    };
    fetchCourses();
  }, [selectedInstituteId]);


  // 3. Fetch Alumni data
  const fetchAlumni = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        per_page: itemsPerPage,
        search: searchTerm,
        institute: selectedInstituteId ? institutes.find(inst => inst.id === selectedInstituteId)?.name : null,
        course: selectedCourseId ? courses.find(c => c.id === selectedCourseId)?.name : null,
      };
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== null && value !== "")
      );

      const response = await api2.get<Alumni>('/api/alumni', { params: filteredParams });
      setAlumni(response.data.data); 
      setTotalItems(response.data.total);
      setLastPage(response.data.last_page);
      setCurrentPage(response.data.current_page);
    } catch (err: any) {
      console.error("Error fetching alumni:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to load alumni data.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, selectedInstituteId, selectedCourseId, institutes, courses]);

  useEffect(() => {
    fetchAlumni();
  }, [fetchAlumni]);

  // Handlers
  const handleInstituteChange = (value: string) => {
    setSelectedInstituteId(value === "all" ? null : value);
    setSelectedCourseId(null); // Reset course when institute changes
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleCourseChange = (value: string) => {
    setSelectedCourseId(value === "all" ? null : value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search change
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Derived state for the UI to display selected names
  const selectedInstituteName = institutes.find(inst => inst.id === selectedInstituteId)?.name || "Select Institute";
  const selectedCourseName = courses.find(c => c.id === selectedCourseId)?.name || "Select Course";


  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by name or student ID..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="max-w-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select onValueChange={handleInstituteChange} value={selectedInstituteId || "all"}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={selectedInstituteName} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Institutes</SelectItem>
              {institutes.map((institute) => (
                <SelectItem key={institute.id} value={institute.id}>
                  {institute.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={handleCourseChange}
            value={selectedCourseId || "all"}
            disabled={courses.length === 0 && !selectedCourseId} // Disable if no courses or no course explicitly selected
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={selectedCourseName} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Student ID</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Institute</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading alumni...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-red-500">
                  {error}
                </TableCell>
              </TableRow>
            ) : alumni.length > 0 ? (
              alumni.map((alumnus) => (
                <TableRow key={alumnus.id}>
                  <TableCell className="font-medium">{alumnus.id}</TableCell>
                  <TableCell>{alumnus.firstName}</TableCell>
                  <TableCell>{alumnus.lastName}</TableCell>
                  <TableCell>{alumnus.course}</TableCell>
                  <TableCell>{alumnus.institute}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/view/${alumnus.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View alumni details</span>
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-center space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
        >
          Previous
        </Button>
        {Array.from({ length: lastPage }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(page)}
            disabled={loading}
          >
            {page}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === lastPage || loading}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
