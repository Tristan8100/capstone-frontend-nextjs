"use client"

import { useState, useEffect } from "react"
import { Pencil } from "lucide-react"
import { api2 } from "@/lib/api"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type Alumni = {
  id: number
  student_id: string
  first_name: string
  last_name: string
  middle_name?: string | null
  course: string
  batch: number
  status?: 'active' | 'inactive'
}

type PaginatedResponse<T> = {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export function AlumniTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [alumni, setAlumni] = useState<Alumni[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 5

  //Form state for editing
  const [editForm, setEditForm] = useState<Omit<Alumni, 'id'> & { id?: number }>({
    student_id: '',
    first_name: '',
    last_name: '',
    middle_name: '',
    course: '',
    batch: 0,
    status: 'active'
  })

  // Fetch alumni data
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        setIsLoading(true)
        const response = await api2.get<PaginatedResponse<Alumni>>('/api/alumni-list', {
          params: {
            search: searchTerm,
            page: currentPage,
            per_page: itemsPerPage
          }
        })
        setAlumni(response.data.data)
        setTotalPages(response.data.meta.last_page)
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to fetch alumni data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAlumni()
  }, [searchTerm, currentPage])

  // Handle search with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setCurrentPage(1)
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  const handleRowClick = async (alumniId: number) => {
    try {
      const response = await api2.get<Alumni >(`/api/alumni-list/${alumniId}`)
      const alumniData = response.data
      
      // Pre-fill the form with the selected alumni's data
      setEditForm({
        id: alumniData.id,
        student_id: alumniData.student_id,
        first_name: alumniData.first_name,
        last_name: alumniData.last_name,
        middle_name: alumniData.middle_name || '',
        course: alumniData.course,
        batch: alumniData.batch,
        status: alumniData.status || 'active'
      })
      
      setIsDialogOpen(true)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch alumni details")
    }
  }

  const handleFormChange = (field: keyof typeof editForm, value: string | number) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveChanges = async () => {
    if (!editForm.id) return

    try {
      await api2.put(`/api/alumni-list/${editForm.id}`, {
        student_id: editForm.student_id,
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        middle_name: editForm.middle_name,
        course: editForm.course,
        batch: editForm.batch,
        status: editForm.status
      })

      toast.success("Alumni updated successfully")

      // Refresh the list
      const response = await api2.get<PaginatedResponse<Alumni>>('/api/alumni-list', {
        params: {
          page: currentPage,
          per_page: itemsPerPage
        }
      })
      setAlumni(response.data.data)
      setIsDialogOpen(false)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update alumni")
    }
  }


  return (
    <div className="space-y-4">
      <div className="flex">
        <Input
          placeholder="Search by name or student ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Student ID</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : alumni.length > 0 ? (
              alumni.map((alumni) => (
                <TableRow key={alumni.id}>
                  <TableCell className="font-medium">{alumni.student_id}</TableCell>
                  <TableCell>{alumni.first_name}</TableCell>
                  <TableCell>{alumni.last_name}</TableCell>
                  <TableCell>{alumni.course}</TableCell>
                  <TableCell>{alumni.batch}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      alumni.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {alumni.status || 'active'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRowClick(alumni.id)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">View alumni details</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
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
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Button>
        ))}
        <Button 
          variant="outline" 
          size="sm" 
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>

      {/* Edit Modal with properly pre-filled forms */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Alumni Information</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="student_id" className="text-right">
                Student ID
              </label>
              <Input
                id="student_id"
                value={editForm.student_id}
                onChange={(e) => handleFormChange('student_id', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="first_name" className="text-right">
                First Name
              </label>
              <Input
                id="first_name"
                value={editForm.first_name}
                onChange={(e) => handleFormChange('first_name', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="middle_name" className="text-right">
                Middle Name
              </label>
              <Input
                id="middle_name"
                value={editForm.middle_name || ''}
                onChange={(e) => handleFormChange('middle_name', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="last_name" className="text-right">
                Last Name
              </label>
              <Input
                id="last_name"
                value={editForm.last_name}
                onChange={(e) => handleFormChange('last_name', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="course" className="text-right">
                Course
              </label>
              <Input
                id="course"
                value={editForm.course}
                onChange={(e) => handleFormChange('course', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="batch" className="text-right">
                Batch
              </label>
              <Input
                id="batch"
                type="number"
                value={editForm.batch}
                onChange={(e) => handleFormChange('batch', parseInt(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="status" className="text-right">
                Status
              </label>
              <select 
                id="status"
                value={editForm.status}
                onChange={(e) => handleFormChange('status', e.target.value as 'active' | 'inactive')}
                className="col-span-3 border rounded-md p-2"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}