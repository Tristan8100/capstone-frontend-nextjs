"use client"

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

interface Survey {
  id: number
  title: string
  description: string | null
  course: Course | null
  limits?: {
    courses?: string[]
    institutes?: string[]
    readable?: string
  }
  created_at: string
}

interface Course {
  id: string
  name: string
  full_name: string
  institute_id: string
}

interface Institute {
  id: string
  name: string
}

interface AddSurveyProps {
  onSuccess: (newSurvey: Survey) => void
}

export default function AddSurvey({ onSuccess }: AddSurveyProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([])
  const [selectedInstituteIds, setSelectedInstituteIds] = useState<string[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [institutes, setInstitutes] = useState<Institute[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return

    const fetchData = async () => {
      try {
        const [coursesRes, institutesRes] = await Promise.all([
          api2.get<Course[]>("/api/get-courses-general"),
          api2.get<Institute[]>("/api/institutes"),
        ])
        setCourses(coursesRes.data)
        setInstitutes(institutesRes.data)
      } catch (e) {
        console.error("Failed to fetch courses or institutes", e)
      }
    }

    fetchData()
  }, [open])

  const toggleSelection = (id: string, selected: string[], setSelected: (v: string[]) => void) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id))
    } else {
      setSelected([...selected, id])
    }
  }

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
        limits: {
          courses: selectedCourseIds.length ? selectedCourseIds : undefined,
          institutes: selectedInstituteIds.length ? selectedInstituteIds : undefined,
        },
      })
      onSuccess(response.data)
      setOpen(false)
      setTitle("")
      setDescription("")
      setSelectedCourseIds([])
      setSelectedInstituteIds([])
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
              <Label>Institutes (optional)</Label>
              <div className="flex flex-col space-y-1 max-h-40 overflow-y-auto border rounded p-2">
                {institutes.map((inst) => (
                  <label key={inst.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={inst.id}
                      checked={selectedInstituteIds.includes(inst.id)}
                      onChange={() => toggleSelection(inst.id, selectedInstituteIds, setSelectedInstituteIds)}
                      disabled={loading}
                    />
                    <span>{inst.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label>Courses (optional)</Label>
              <div className="flex flex-col space-y-1 max-h-40 overflow-y-auto border rounded p-2">
                {courses.map((course) => (
                  <label key={course.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={course.id}
                      checked={selectedCourseIds.includes(course.id)}
                      onChange={() => toggleSelection(course.id, selectedCourseIds, setSelectedCourseIds)}
                      disabled={loading}
                    />
                    <span>{course.full_name} ({course.name})</span>
                  </label>
                ))}
              </div>
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
