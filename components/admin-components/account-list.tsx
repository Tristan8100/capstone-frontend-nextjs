"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Eye, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { api2 } from "@/lib/api"
import { toast } from "sonner"

interface Alumni {
  id: string
  firstName: string
  lastName: string
  course: string
  institute: string
  middleName?: string
}

interface AlumniResponse {
  data: Alumni[]
  total: number
  current_page: number
  last_page: number
}

interface Institute {
  id: string
  name: string
}

interface Course {
  id: string
  name: string
  institute_id: string
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

export function AccountTable() {
  const [alumni, setAlumni] = useState<Alumni[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const [selectedInstituteId, setSelectedInstituteId] = useState<string | null>(null)
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [totalItems, setTotalItems] = useState(0)
  const [lastPage, setLastPage] = useState(1)

  const [institutes, setInstitutes] = useState<Institute[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [editLoading, setEditLoading] = useState(false)

  // Edit dialog states
  const [editOpen, setEditOpen] = useState(false)
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
  })

  // Fetch Institutes
  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const response = await api2.get<Institute[]>("/api/institutes")
        setInstitutes(response.data)
      } catch (err) {
        console.error("Error fetching institutes:", err)
        setError("Failed to load institutes.")
      }
    }
    fetchInstitutes()
  }, [])

  // Fetch Courses
  useEffect(() => {
    const fetchCourses = async () => {
      setCourses([])
      if (selectedInstituteId) {
        try {
          const response = await api2.get<Course[]>(`/api/courses?institute_id=${selectedInstituteId}`)
          setCourses(response.data)
        } catch (err) {
          console.error("Error fetching courses:", err)
          setError("Failed to load courses.")
        }
      } else {
        try {
          const response = await api2.get<Course[]>("/api/courses")
          setCourses(response.data)
        } catch (err) {
          console.error("Error fetching all courses:", err)
          setError("Failed to load all courses.")
        }
      }
    }
    fetchCourses()
  }, [selectedInstituteId])

  // Fetch Alumni
  const fetchAlumni = useCallback(async () => {
    setLoading(true)
    setAlumni([])
    setError(null)
    try {
      const params = {
        page: currentPage,
        per_page: itemsPerPage,
        search: debouncedSearchTerm,
        institute: selectedInstituteId ? institutes.find((inst) => inst.id === selectedInstituteId)?.name : null,
        course: selectedCourseId ? courses.find((c) => c.id === selectedCourseId)?.name : null,
      }
      const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value))

      const response = await api2.get<AlumniResponse>("/api/alumni", { params: filteredParams })

      setAlumni(response.data.data)
      setTotalItems(response.data.total)
      setLastPage(response.data.last_page)
    } catch (err: any) {
      console.error("Error fetching alumni:", err.response?.data || err)
      setError(err.response?.data?.message || "Failed to load alumni data.")
    } finally {
      setLoading(false)
    }
  }, [currentPage, itemsPerPage, debouncedSearchTerm, selectedInstituteId, selectedCourseId, institutes, courses])

  useEffect(() => {
    fetchAlumni()
  }, [fetchAlumni])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm, selectedInstituteId, selectedCourseId])

  const handleInstituteChange = (value: string) => {
    setSelectedInstituteId(value === "all" ? null : value)
    setSelectedCourseId(null)
  }

  const handleCourseChange = (value: string) => {
    setSelectedCourseId(value === "all" ? null : value)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  // Open edit dialog
  const openEditDialog = (alumnus: Alumni) => {
    setSelectedAlumni(alumnus)
    setFormData({
      firstName: alumnus.firstName,
      middleName: alumnus.middleName || "",
      lastName: alumnus.lastName,
    })
    setEditOpen(true)
  }

  // Submit edit form
  const handleEditSubmit = async () => {
    if (!selectedAlumni) return
    setEditLoading(true)
    try {
      await api2.post(`/api/alumni-update/${selectedAlumni.id}`, {
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
      })
      setEditOpen(false)
      toast.success("Alumni updated successfully!")
      fetchAlumni() // Refresh table
    } catch (err) {
      console.error("Error updating alumni:", err)
      toast.error("Failed to update alumni.")
    } finally {
      setEditLoading(false)
    }
  }


  return (
    <div className="space-y-4">
      {/* Filters */}
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
              <SelectValue placeholder="Select Institute" />
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

          <Select onValueChange={handleCourseChange} value={selectedCourseId || "all"}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Course" />
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

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Student ID</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Middle Name</TableHead>
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
                  <TableCell>{alumnus.middleName}</TableCell>
                  <TableCell>{alumnus.lastName}</TableCell>
                  <TableCell>{alumnus.course}</TableCell>
                  <TableCell>{alumnus.institute}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/admin/view/${alumnus.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View alumni details</span>
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(alumnus)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit alumni</span>
                    </Button>
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

      {/* Pagination */}
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

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Alumni</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            <Input
              placeholder="Middle Name"
              value={formData.middleName}
              onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
            />
            <Input
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={editLoading}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} disabled={editLoading}>
              {editLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
