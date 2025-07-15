"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { api2 } from "@/lib/api"; // Using your axios instance
import Image from 'next/image';
import { AddInstitute } from "./add-institute";

type Institute = {
  id: string;
  name: string;
  description?: string;
  image_path?: string;
  courses_count?: number;
};

type InstitutesResponse = {
  data: Institute[];
  meta: {
    current_page: number;
    last_page: number;
  };
};

export function InstitutesTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch institutes with pagination and search
  const fetchInstitutes = async (page: number = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await api2.get<InstitutesResponse>(`/api/institutes-general?${params.toString()}`);
      const { data, meta } = response.data;

      setInstitutes(data);
      setTotalPages(meta.last_page);
      setCurrentPage(meta.current_page);
    } catch (error) {
      toast.error("Failed to fetch institutes");
      setInstitutes([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle institute updates
const handleUpdate = async (id: string, e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const toastId = toast.loading('Updating institute...');
  
  const formData = new FormData(e.currentTarget);
  formData.append('_method', 'PUT'); //need to put _method: 'PUT' in the request body
  
  try {
    await api2.post(`/api/institutes-general/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    toast.success('Institute updated successfully!', { id: toastId });
    fetchInstitutes(currentPage);
  } catch (error) {
    const message = (error as any).response?.data?.message || 'Update failed';
    toast.error(message, { id: toastId });
    console.error('Update error:', error);
  }
};

// Handle institute deletion
const handleDelete = async (id: string) => {
  const toastId = toast.loading('Deleting...');
  
  try {
    await api2.delete(`/api/institutes-general/${id}`);
    toast.success('Institute deleted!', { id: toastId });
    fetchInstitutes(1); // Reset to page 1 after deletion
  } catch (error) {
    const message = (error as any).response?.data?.message || 'Failed to delete';
    toast.error(message, { id: toastId });
    console.error('Delete error:', error);
  }
};

  // Search debounce effect
  useEffect(() => {
    const timer = setTimeout(() => fetchInstitutes(1), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Pagination effect
  useEffect(() => {
    fetchInstitutes(currentPage);
  }, [currentPage]);

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search institutes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <AddInstitute onSuccess={() => fetchInstitutes(currentPage)} />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Courses</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">Loading...</TableCell>
            </TableRow>
          ) : institutes.length > 0 ? (
            institutes.map((institute) => (
              <TableRow key={institute.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    {institute.image_path && (
                      <Image
                        src={`${api2.defaults.baseURL}/${institute.image_path}`}
                        alt={institute.name}
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                        priority={false} // Set to true if above-the-fold
                      />
                    )}
                    {institute.name}
                  </div>
                </TableCell>
                <TableCell>{institute.description || '-'}</TableCell>
                <TableCell>{institute.courses_count || 0}</TableCell>
                <TableCell className="flex gap-2">
                  <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">Edit</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Institute</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={(e) => handleUpdate(institute.id, e)}>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="name" className="text-right">
                            Name
                          </label>
                          <Input
                            name="name"
                            defaultValue={institute.name}
                            className="col-span-3"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="description" className="text-right">
                            Description
                          </label>
                          <Input
                            name="description"
                            defaultValue={institute.description || ''}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="image" className="text-right">
                            Logo
                          </label>
                          <div className="col-span-3 space-y-2">
                            {institute.image_path && (
                              <Image
                                src={`${api2.defaults.baseURL}/${institute.image_path}`}
                                alt="Current logo"
                                width={80}
                                height={80}
                                className="rounded-md mb-2"
                              />
                            )}
                            <Input
                              id="image"
                              name="image"
                              type="file"
                              accept="image/*"
                            />
                            <p className="text-xs text-muted-foreground">
                              Leave empty to keep current image
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="submit">Save</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDelete(institute.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">No institutes found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          <span>Page {currentPage} of {totalPages}</span>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}