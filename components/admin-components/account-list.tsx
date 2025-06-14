"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for demonstration
const mockAlumni = [
  {
    id: "ST001",
    firstName: "John",
    lastName: "Doe",
    course: "Computer Science",
    institute: "College of Engineering",
  },
  {
    id: "ST002",
    firstName: "Jane",
    lastName: "Smith",
    course: "Information Technology",
    institute: "College of Engineering",
  },
  {
    id: "ST003",
    firstName: "Michael",
    lastName: "Johnson",
    course: "Business Administration",
    institute: "College of Business",
  },
  {
    id: "ST004",
    firstName: "Emily",
    lastName: "Williams",
    course: "Marketing",
    institute: "College of Business",
  },
  {
    id: "ST005",
    firstName: "David",
    lastName: "Brown",
    course: "Electrical Engineering",
    institute: "College of Engineering",
  },
  {
    id: "ST006",
    firstName: "Sarah",
    lastName: "Miller",
    course: "Psychology",
    institute: "College of Arts and Sciences",
  },
  {
    id: "ST007",
    firstName: "Robert",
    lastName: "Wilson",
    course: "Biology",
    institute: "College of Arts and Sciences",
  },
]

// Get unique institutes from mock data
const institutes = [...new Set(mockAlumni.map((alumni) => alumni.institute))]

// Get courses by institute
const getCoursesByInstitute = (institute: string | null) => {
  if (!institute) return [...new Set(mockAlumni.map((alumni) => alumni.course))]
  return [...new Set(mockAlumni.filter((alumni) => alumni.institute === institute).map((alumni) => alumni.course))]
}

export function AccountTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedInstitute, setSelectedInstitute] = useState<string | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  // Available courses based on selected institute
  const availableCourses = getCoursesByInstitute(selectedInstitute)

  // Filter alumni based on search term, institute, and course
  const filteredAlumni = mockAlumni.filter((alumni) => {
    const matchesSearch =
      alumni.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumni.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumni.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesInstitute = !selectedInstitute || alumni.institute === selectedInstitute
    const matchesCourse = !selectedCourse || alumni.course === selectedCourse

    return matchesSearch && matchesInstitute && matchesCourse
  })

  // Handle institute change
  const handleInstituteChange = (value: string) => {
    setSelectedInstitute(value === "all" ? null : value)
    setSelectedCourse(null) // Reset course when institute changes
  }

  // Add a handleCourseChange function:
  const handleCourseChange = (value: string) => {
    setSelectedCourse(value === "all" ? null : value)
  }

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredAlumni.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredAlumni.length / itemsPerPage)

  // Add this pagination handler function:
  const handlePageChange = (pageNumber: number) => {
    console.log(`Navigating to page ${pageNumber}`)
    setCurrentPage(pageNumber)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by name or student ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select onValueChange={handleInstituteChange} value={selectedInstitute || ""}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Institute" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Institutes</SelectItem>
              {institutes.map((institute) => (
                <SelectItem key={institute} value={institute}>
                  {institute}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={handleCourseChange}
            value={selectedCourse || ""}
            disabled={availableCourses.length === 0}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {availableCourses.map((course) => (
                <SelectItem key={course} value={course}>
                  {course}
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
            {currentItems.length > 0 ? (
              currentItems.map((alumni) => (
                <TableRow key={alumni.id}>
                  <TableCell className="font-medium">{alumni.id}</TableCell>
                  <TableCell>{alumni.firstName}</TableCell>
                  <TableCell>{alumni.lastName}</TableCell>
                  <TableCell>{alumni.course}</TableCell>
                  <TableCell>{alumni.institute}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/alumni/${alumni.id}`}>
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
          onClick={() => {
            console.log("Previous page")
            if (currentPage > 1) handlePageChange(currentPage - 1)
          }}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(page)}
          >
            {page}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            console.log("Next page")
            if (currentPage < totalPages) handlePageChange(currentPage + 1)
          }}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
