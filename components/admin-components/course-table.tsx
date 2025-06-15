// components/SimpleCoursesTable.tsx
"use client";

import { useState } from "react";
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
} from "@/components/ui/dialog"

const data = [
  { id: "1", course: "Computer Science", institute: "MIT" },
  { id: "2", course: "Business Administration", institute: "Harvard" },
  { id: "3", course: "Electrical Engineering", institute: "Stanford" },
  { id: "4", course: "Medicine", institute: "Harvard" },
  { id: "5", course: "Artificial Intelligence", institute: "MIT" },
];

interface Course {
  id: string;
  course: string;
  institute: string;
}

export function CoursesTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [instituteFilter, setInstituteFilter] = useState("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState<Course | null>(null);

  // Get unique institutes for filter
  const institutes = ["All", ...new Set(data.map(item => item.institute))];

  // Handle edit button click
  const handleEditClick = (course: Course) => {
    setSelectedAlumni(course);
    setIsDialogOpen(true);
  };

  // Filter data based on search and institute selection
  const filteredData = data.filter(item => {
    const matchesSearch = item.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesInstitute = instituteFilter === "All" || item.institute === instituteFilter;
    return matchesSearch && matchesInstitute;
  });

  return (
    <div className="w-full p-4">
      {/* Search and Filter Controls */}
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        
        <select 
          value={instituteFilter}
          onChange={(e) => setInstituteFilter(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          {institutes.map(institute => (
            <option key={institute} value={institute}>
              {institute}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead>Institute</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.course}</TableCell>
              <TableCell>{item.institute}</TableCell>
              <TableCell>
                <Button onClick={() => handleEditClick(item)} variant="outline" size="sm">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filteredData.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No courses found
        </div>
      )}

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
                defaultValue={selectedAlumni?.course || ''}
                className="col-span-3"
              />
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
  );
}