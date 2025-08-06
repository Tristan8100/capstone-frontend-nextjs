'use client'

import { useState, useEffect } from "react"
import { api2 } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Survey {
  id: number
  title: string
  description: string | null
  course_id: string | null
  created_at: string
  course: Course | null
}

interface Course {
  id: string
  name: string
  full_name: string
  institute_id: string
}

interface AddSurveyProps {
  onSuccess: (newSurvey: Survey) => void
}

export default function AddSurvey({ onSuccess }: AddSurveyProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [courseId, setCourseId] = useState<string | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api2.get<Course[]>("/api/get-courses-general")
        setCourses(response.data)
      } catch (error) {
        console.error("Failed to fetch courses:", error)
      }
    }

    if (open) {
      fetchCourses()
    }
  }, [open])

  const createSurvey = async () => {
    if (!title.trim()) {
      setError("Title is required")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await api2.post<Survey>("/api/surveys", {
        title: title.trim(),
        description: description.trim() || null,
        course_id: courseId, // null is acceptable for general surveys
      })
      onSuccess(response.data)
      setOpen(false)
      setTitle("")
      setDescription("")
      setCourseId(null)
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to create survey")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="flex items-center space-x-2">
        Create Form
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Survey</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter survey title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <Label>Course (optional)</Label>
              <Select 
                value={courseId || undefined}
                onValueChange={(value) => setCourseId(value || null)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a course (leave blank for general survey)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Survey (All Courses)</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.full_name} ({course.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {error && <p className="text-red-600">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={createSurvey} disabled={loading} className="ml-2">
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}