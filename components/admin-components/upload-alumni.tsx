'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api2 } from "@/lib/api";

export function ExcelUploadModal() {
  const [file, setFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error("Please select a file first!");
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file); // DON'T FORGET TO MATCH ON LARAVEL REQUEST!!!

      const response = await api2.post("/api/alumni-list/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Alumni imported successfully!");
      setIsOpen(false);
      setFile(null);
      
      // Optional: Refresh alumni list after import
      window.location.reload();
      
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(
        error.response?.data?.message || 
        "Error importing file. Please check the format and try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Import Excel/CSV</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Alumni Data</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="file">Excel/CSV File</Label>
            <Input 
              id="file" 
              type="file" 
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              required
              disabled={isUploading}
            />
            <p className="text-sm text-muted-foreground">
              Supported formats: .xlsx, .xls, .csv
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!file || isUploading}>
              {isUploading ? "Importing..." : "Import"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}