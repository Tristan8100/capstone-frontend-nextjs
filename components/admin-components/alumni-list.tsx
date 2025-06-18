"use client"

import { useState } from "react"
import { Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Mock data for demonstration
const mockAlumni = [
  {
    id: "ST001",
    firstName: "John",
    lastName: "Doe",
    course: "Computer Science",
    status: "active",
  },
  {
    id: "ST002",
    firstName: "Jane",
    lastName: "Smith",
    course: "Information Technology",
    status: "active",
  },
  {
    id: "ST003",
    firstName: "Michael",
    lastName: "Johnson",
    course: "Business Administration",
    status: "inactive",
  },
  {
    id: "ST004",
    firstName: "Emily",
    lastName: "Williams",
    course: "Marketing",
    status: "active",
  },
  {
    id: "ST005",
    firstName: "David",
    lastName: "Brown",
    course: "Electrical Engineering",
    status: "inactive",
  },
]

type Alumni = {
  id: string
  firstName: string
  lastName: string
  course: string
  status: string
}

export function AlumniTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null)
  const itemsPerPage = 5

  // Filter alumni based on search term only
  const filteredAlumni = mockAlumni.filter((alumni) => {
    return (
      alumni.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumni.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumni.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Simplified pagination - just show first page items
  const currentItems = filteredAlumni.slice(0, itemsPerPage)
  const totalPages = Math.ceil(filteredAlumni.length / itemsPerPage)

  const handleRowClick = (alumni: Alumni) => {
    setSelectedAlumni(alumni)
    setIsDialogOpen(true)
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
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((alumni) => (
                <TableRow key={alumni.id}>
                  <TableCell className="font-medium">{alumni.id}</TableCell>
                  <TableCell>{alumni.firstName}</TableCell>
                  <TableCell>{alumni.lastName}</TableCell>
                  <TableCell>{alumni.course}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      alumni.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {alumni.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRowClick(alumni)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View alumni details</span>
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

      {/* Pagination UI (static) */}
      <div className="flex items-center justify-center space-x-2 py-4">
        <Button variant="outline" size="sm" disabled={currentPage === 1}>
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
          >
            {page}
          </Button>
        ))}
        <Button variant="outline" size="sm" disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>

      {/* Edit Modal - Fixed */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Alumni Information</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="id" className="text-right">
                Student ID
              </label>
              <Input
                id="id"
                defaultValue={selectedAlumni?.id || ''}
                className="col-span-3"
                readOnly
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="firstName" className="text-right">
                First Name
              </label>
              <Input
                id="firstName"
                defaultValue={selectedAlumni?.firstName || ''}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="lastName" className="text-right">
                Last Name
              </label>
              <Input
                id="lastName"
                defaultValue={selectedAlumni?.lastName || ''}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="course" className="text-right">
                Course
              </label>
              <Input
                id="course"
                defaultValue={selectedAlumni?.course || ''}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="status" className="text-right">
                Status
              </label>
              <select 
                id="status"
                defaultValue={selectedAlumni?.status || 'active'}
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
            <Button type="submit">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}