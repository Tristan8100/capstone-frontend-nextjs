"use client"

import { useState, useEffect, type KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Building2, Briefcase, Clock } from "lucide-react"
import { toast } from "sonner"
import { api2 } from "@/lib/api"
import InfiniteScroll from "@/components/infinite-scroll"

type Career = {
  id: string
  title: string
  company: string
  description?: string
  skills_used?: string[]
  start_date: string
  end_date?: string
  fit_category?: string
  recommended_jobs?: string[] | string
  analysis_notes?: string
}

type PaginatedResponse = {
  status: string
  data: Career[]
  pagination: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    has_more: boolean
  }
}

const getCurrentYear = () => new Date().getFullYear()
const getCurrentMonth = () => new Date().getMonth() + 1

const formatDateForDisplay = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

const createDateFromYearMonth = (year: number, month: number) => {
  return `${year}-${month.toString().padStart(2, "0")}-01`
}

export default function CareerTracking() {
  const [careers, setCareers] = useState<Career[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingCareer, setEditingCareer] = useState<Career | null>(null)

  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    skills_used: "",
    start_date: "",
    end_date: "",
    isFreelancer: false,
    isCurrent: false,
    dateInputType: "full" as "full" | "yearMonth",
    startYear: getCurrentYear(),
    startMonth: getCurrentMonth(),
    endYear: getCurrentYear(),
    endMonth: getCurrentMonth(),
  })

  const [skillTags, setSkillTags] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchCareers()
  }, [])

  useEffect(() => {
    if (form.isFreelancer) {
      setForm((prev) => ({ ...prev, company: "Freelancer" }))
    } else if (form.company === "Freelancer") {
      setForm((prev) => ({ ...prev, company: "" }))
    }
  }, [form.isFreelancer])

  const normalizeCareer = (career: Career) => ({
    ...career,
    recommended_jobs: Array.isArray(career.recommended_jobs)
      ? career.recommended_jobs
      : typeof career.recommended_jobs === "string"
        ? career.recommended_jobs.split(",").map((s) => s.trim())
        : [],
  })

  const fetchCareers = async (page = 1, append = false) => {
    if (page === 1) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }

    try {
      const res = await api2.get<PaginatedResponse>(`/api/career-paginated?page=${page}`)
      const normalizedCareers = res.data.data.map(normalizeCareer)

      if (append) {
        setCareers((prev) => [...prev, ...normalizedCareers])
      } else {
        setCareers(normalizedCareers)
      }

      setCurrentPage(res.data.pagination.current_page)
      setHasMore(res.data.pagination.has_more)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to fetch careers")
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchCareers(currentPage + 1, true)
    }
  }

  const openAddDialog = () => {
    setEditingCareer(null)
    setForm({
      title: "",
      company: "",
      description: "",
      skills_used: "",
      start_date: "",
      end_date: "",
      isFreelancer: false,
      isCurrent: false,
      dateInputType: "yearMonth",
      startYear: getCurrentYear(),
      startMonth: getCurrentMonth(),
      endYear: getCurrentYear(),
      endMonth: getCurrentMonth(),
    })
    setSkillTags([])
    setSkillInput("")
    setOpenDialog(true)
  }

  const openEditDialog = (career: Career) => {
    setEditingCareer(career)
    const startDate = new Date(career.start_date)
    const endDate = career.end_date ? new Date(career.end_date) : null

    setForm({
      title: career.title,
      company: career.company,
      description: career.description || "",
      skills_used: career.skills_used?.join(", ") || "",
      start_date: career.start_date,
      end_date: career.end_date || "",
      isFreelancer: career.company === "Freelancer",
      isCurrent: !career.end_date,
      dateInputType: "full",
      startYear: startDate.getFullYear(),
      startMonth: startDate.getMonth() + 1,
      endYear: endDate ? endDate.getFullYear() : getCurrentYear(),
      endMonth: endDate ? endDate.getMonth() + 1 : getCurrentMonth(),
    })
    setSkillTags(career.skills_used || [])
    setSkillInput("")
    setOpenDialog(true)
  }

  const addSkillTag = (skill: string) => {
    const trimmedSkill = skill.trim()
    if (trimmedSkill && !skillTags.includes(trimmedSkill)) {
      setSkillTags([...skillTags, trimmedSkill])
    }
  }

  const removeSkillTag = (skillToRemove: string) => {
    setSkillTags(skillTags.filter((skill) => skill !== skillToRemove))
  }

  const handleSkillInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      if (skillInput.trim()) {
        addSkillTag(skillInput)
        setSkillInput("")
      }
    } else if (e.key === "Backspace" && !skillInput && skillTags.length > 0) {
      // Remove last
      setSkillTags(skillTags.slice(0, -1))
    }
  }

  const handleSkillInputChange = (value: string) => {
    // Handle comma
    if (value.includes(",")) {
      const parts = value.split(",")
      const newSkills = parts
        .slice(0, -1)
        .map((s) => s.trim())
        .filter((s) => s)
      newSkills.forEach((skill) => addSkillTag(skill))
      setSkillInput(parts[parts.length - 1])
    } else {
      setSkillInput(value)
    }
  }

  const handleSave = async () => {
    setSaving(true)

    let startDate = form.start_date
    let endDate = form.end_date

    if (form.dateInputType === "yearMonth") {
      startDate = createDateFromYearMonth(form.startYear, form.startMonth)
      if (!form.isCurrent) {
        endDate = createDateFromYearMonth(form.endYear, form.endMonth)
      }
    }

    const payload = {
      title: form.title,
      company: form.company,
      description: form.description,
      skills_used: skillTags,
      start_date: startDate,
      end_date: form.isCurrent ? undefined : endDate,
    }

    try {
      if (editingCareer) {
        const res = await api2.put<{ data: Career }>(`/api/career/${editingCareer.id}`, payload)
        setCareers(careers.map((c) => (c.id === editingCareer.id ? normalizeCareer(res.data.data) : c)))
        toast.success("Career updated successfully")
      } else {
        const res = await api2.post<{ data: Career }>("/api/career", payload)
        setCareers([normalizeCareer(res.data.data), ...careers])
        toast.success("Career added successfully")
      }
      setOpenDialog(false)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save career")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (careerId: string) => {
    if (!confirm("Are you sure you want to delete this career?")) return
    try {
      await api2.delete(`/api/career/${careerId}`)
      setCareers(careers.filter((c) => c.id !== careerId))
      toast.success("Career deleted successfully")
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete career")
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Career Tracking</h1>
          <p className="text-muted-foreground mt-1">Manage your professional journey and experiences</p>
        </div>
        <Button onClick={openAddDialog} className="gap-2">
          <Briefcase className="h-4 w-4" />
          Add Career
        </Button>
      </div>

      <Separator />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : careers.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No careers yet</h3>
          <p className="text-muted-foreground mb-4">Start tracking your professional journey</p>
          <Button onClick={openAddDialog}>Add Your First Career</Button>
        </div>
      ) : (
        <>
        <div className="grid gap-6">
          <div className="grid gap-6">
            {careers.map((career) => {
              const recommendedJobs = Array.isArray(career.recommended_jobs)
                ? career.recommended_jobs
                : typeof career.recommended_jobs === "string"
                  ? career.recommended_jobs.split(",").map((s) => s.trim())
                  : []

              const isCurrentJob = !career.end_date

              return (
                <Card key={career.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-xl">{career.title}</CardTitle>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Building2 className="h-4 w-4" />
                          <span>{career.company}</span>
                          {isCurrentJob && (
                            <Badge variant="secondary" className="gap-1">
                              <Clock className="h-3 w-3" />
                              Current
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {career.description && (
                      <div>
                        <h4 className="font-medium mb-1">Description</h4>
                        <p className="text-sm text-muted-foreground">{career.description}</p>
                      </div>
                    )}

                    {career.skills_used && career.skills_used.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Skills Used</h4>
                        <div className="flex flex-wrap gap-1">
                          {career.skills_used.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        <span>{formatDateForDisplay(career.start_date)}</span>
                      </div>
                      <span>→</span>
                      <span>{career.end_date ? formatDateForDisplay(career.end_date) : "Present"}</span>
                    </div>

                    {(career.fit_category || recommendedJobs.length > 0 || career.analysis_notes) && (
                      <>
                        <Separator />
                        <div className="space-y-3">
                          {career.fit_category && (
                            <div>
                              <h4 className="font-medium mb-1">Fit Category</h4>
                              <Badge variant="secondary">{career.fit_category}</Badge>
                            </div>
                          )}

                          {recommendedJobs.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Recommended Jobs</h4>
                              <div className="flex flex-wrap gap-1">
                                {recommendedJobs.map((job, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {job}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {career.analysis_notes && (
                            <div>
                              <h4 className="font-medium mb-1">Analysis Notes</h4>
                              <p className="text-sm text-muted-foreground">{career.analysis_notes}</p>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </CardContent>
                  <CardFooter className="flex gap-2 pt-3">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(career)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(career.id)}>
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>

        <InfiniteScroll
          isLoading={loadingMore}
          hasMore={hasMore}
          next={loadMore}
          threshold={0.8}
        >
          {hasMore && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-2 text-sm text-muted-foreground">Loading more careers...</span>
            </div>
          )}
        </InfiniteScroll>
          </>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{editingCareer ? "Edit Career" : "Add New Career"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Job Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Job Title *
              </Label>
              <Input
                id="title"
                placeholder="e.g. Senior Software Engineer"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            {/* Company with Freelancer Toggle */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="company" className="text-sm font-medium">
                  Company *
                </Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="freelancer"
                    checked={form.isFreelancer}
                    onCheckedChange={(checked) => setForm({ ...form, isFreelancer: checked })}
                  />
                  <Label htmlFor="freelancer" className="text-sm">
                    Freelancer
                  </Label>
                </div>
              </div>
              <Input
                id="company"
                placeholder="e.g. Google, Microsoft"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                disabled={form.isFreelancer}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Input
                id="description"
                placeholder="Brief description of your role and responsibilities"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label htmlFor="skills_used" className="text-sm font-medium">
                Skills Used
              </Label>
              <div className="space-y-2">
                {/* Display existing skill tags */}
                {skillTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 p-2 border rounded-md bg-muted/50">
                    {skillTags.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        onClick={() => removeSkillTag(skill)}
                      >
                        {skill} ×
                      </Badge>
                    ))}
                  </div>
                )}
                {/* Input for adding new skills */}
                <Input
                  id="skills_used"
                  placeholder="Type skills and press Enter or comma to add (e.g. React, TypeScript, Node.js)"
                  value={skillInput}
                  onChange={(e) => handleSkillInputChange(e.target.value)}
                  onKeyDown={handleSkillInputKeyDown}
                />
                <p className="text-xs text-muted-foreground">
                  Press Enter or comma to add skills. Click on tags to remove them.
                </p>
              </div>
            </div>

            {/* Date Input Type Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Date Input Method</Label>
              <Select
                value={form.dateInputType}
                onValueChange={(value: "full" | "yearMonth") => setForm({ ...form, dateInputType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yearMonth">Year & Month (1st of month)</SelectItem>
                  <SelectItem value="full">Exact Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Start Date *</Label>
              {form.dateInputType === "yearMonth" ? (
                <div className="grid grid-cols-2 gap-3">
                  <Select
                    value={form.startMonth.toString()}
                    onValueChange={(value) => setForm({ ...form, startMonth: Number.parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {new Date(2024, i).toLocaleDateString("en-US", { month: "long" })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={form.startYear.toString()}
                    onValueChange={(value) => setForm({ ...form, startYear: Number.parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 50 }, (_, i) => getCurrentYear() - i).map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <Input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                />
              )}
            </div>

            {/* Current Job Toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                id="current"
                checked={form.isCurrent}
                onCheckedChange={(checked) => setForm({ ...form, isCurrent: checked })}
              />
              <Label htmlFor="current" className="text-sm font-medium">
                This is my current job
              </Label>
            </div>

            {/* End Date (only if not current) */}
            {!form.isCurrent && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">End Date *</Label>
                {form.dateInputType === "yearMonth" ? (
                  <div className="grid grid-cols-2 gap-3">
                    <Select
                      value={form.endMonth.toString()}
                      onValueChange={(value) => setForm({ ...form, endMonth: Number.parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {new Date(2024, i).toLocaleDateString("en-US", { month: "long" })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={form.endYear.toString()}
                      onValueChange={(value) => setForm({ ...form, endYear: Number.parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 50 }, (_, i) => getCurrentYear() - i).map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <Input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                  />
                )}
              </div>
            )}
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-3">
            <Button onClick={() => setOpenDialog(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || !form.title || !form.company}>
              {saving ? "Saving..." : editingCareer ? "Update Career" : "Add Career"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
