// components/InstitutesTable.tsx
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddInstitute } from "./add-institute";

const instituteData = [
  { id: "1", name: "Massachusetts Institute of Technology", location: "Cambridge, MA", established: "1861" },
  { id: "2", name: "Harvard University", location: "Cambridge, MA", established: "1636" },
  { id: "3", name: "Stanford University", location: "Stanford, CA", established: "1885" },
  { id: "4", name: "University of Oxford", location: "Oxford, UK", established: "1096" },
  { id: "5", name: "California Institute of Technology", location: "Pasadena, CA", established: "1891" },
];

interface Institute {
  id: string;
  name: string;
  location: string;
  established: string;
}

export function InstitutesTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [selectedInstitute, setSelectedInstitute] = useState<Institute | null>(null);

  // Get unique locations for filter
  const locations = ["All", ...new Set(instituteData.map(item => item.location))];

  // Filter data based on search and location selection
  const filteredData = instituteData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === "All" || item.location === locationFilter;
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="w-full p-4">
      {/* Search and Filter Controls */}
      <AddInstitute />
      <div className="flex gap-4 mb-4 mt-4">
        <Input
          placeholder="Search institutes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        
        <select 
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          {locations.map(location => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Institute Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Established</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.location}</TableCell>
              <TableCell>{item.established}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedInstitute(item)}
                    >
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Edit Institute Information</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="id" className="text-right">
                          Institute ID
                        </label>
                        <Input
                          id="id"
                          defaultValue={item.id}
                          className="col-span-3"
                          readOnly
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="name" className="text-right">
                          Name
                        </label>
                        <Input
                          id="name"
                          defaultValue={item.name}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="location" className="text-right">
                          Location
                        </label>
                        <Input
                          id="location"
                          defaultValue={item.location}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="established" className="text-right">
                          Established
                        </label>
                        <Input
                          id="established"
                          defaultValue={item.established}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filteredData.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No institutes found
        </div>
      )}
    </div>
  );
}