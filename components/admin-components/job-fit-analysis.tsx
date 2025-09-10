"use client"

import { useEffect, useState, useCallback } from "react"
import { api2 } from "@/lib/api"
import { toast } from "sonner"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Clock, Target, Award, BookOpen, AlertTriangle, Calendar, Building, Briefcase } from "lucide-react"

type JobFitData = {
  total_careers: number
  overall: {
    fit_distribution: { related: number; not_related: number }
    skills_gap: Record<string, number>
    related_skills: Record<string, number>
    top_recommended_roles: Record<string, number>
    top_titles: Record<string, number>
    top_companies: Record<string, number>
    avg_time_to_first_job_months: Record<string, string>
    avg_time_to_first_job_years: Record<string, number>
    analysis_fit_distribution: string
    analysis_skills_gap: string
    analysis_related_skills: string
    analysis_top_recommended_roles: string
    analysis_top_titles: string
    analysis_top_companies: string
    analysis_time_to_first_job: Record<string, string>
  }
  per_course: Record<
    string,
    {
      course_name: string
      fit_distribution: { related: number; not_related: number }
      effectiveness_score: number
      insight_sentence: string
      analysis_fit: string
    }
  >
  per_institute: Record<
    string,
    {
      institute_name: string
      fit_distribution: { related: number; not_related: number }
      effectiveness_score: number
      insight_sentence: string
      analysis_fit: string
    }
  >
}

type Course = { id: string; name: string; institute_id?: string }
type Institute = { id: string; name: string }

const COLORS = ["#22c55e", "#ef4444"]

const SkillBar = ({ skill, count, maxCount }: { skill: string; count: number; maxCount: number }) => {
  const percentage = (count / maxCount) * 100
  return (
    <div className="flex items-center justify-between py-3 px-4 bg-muted/20 rounded-lg">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground capitalize truncate">{skill}</span>
          <Badge variant="secondary" className="text-xs ml-2 shrink-0">
            {count}
          </Badge>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}

const AnalysisCard = ({ title, analysis }: { title: string; analysis: string }) => (
  <div className="mt-4 p-6 bg-muted/50 border border-border rounded-lg">
    <h4 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
      <div className="w-2 h-2 bg-primary rounded-full"></div>
      {title}
    </h4>
    <p className="text-base text-muted-foreground leading-relaxed">{analysis}</p>
  </div>
)

const MetricCard = ({
  title,
  value,
  icon: Icon,
  description,
  variant = "default",
}: {
  title: string
  value: string | number
  icon: any
  description?: string
  variant?: "default" | "success" | "warning" | "danger"
}) => {
  const variantStyles = {
    default: "border-border bg-card",
    success: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950",
    warning: "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950",
    danger: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950",
  }

  const iconStyles = {
    default: "text-primary",
    success: "text-green-600 dark:text-green-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    danger: "text-red-600 dark:text-red-400",
  }

  return (
    <Card className={`${variantStyles[variant]} shadow-sm hover:shadow-md transition-all duration-200`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          <div className="p-2 rounded-lg bg-background/50">
            <Icon className={`h-5 w-5 ${iconStyles[variant]}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function JobFitAnalysis() {
  const [data, setData] = useState<JobFitData | null>(null)
  const [loading, setLoading] = useState(true)
  const [metricsLoading, setMetricsLoading] = useState(false)
  const [skillsLoading, setSkillsLoading] = useState(false)
  const [timelineLoading, setTimelineLoading] = useState(false)
  const [institutes, setInstitutes] = useState<Institute[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedInstituteId, setSelectedInstituteId] = useState<string | null>(null)
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [referenceDate, setReferenceDate] = useState<string>("06-01")
  const [appliedReferenceDate, setAppliedReferenceDate] = useState<string>("06-01")

  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const res = await api2.get<Institute[]>("/api/institutes")
        setInstitutes(res.data)
      } catch (err) {
        toast.error("Failed to load institutes")
      }
    }
    fetchInstitutes()
  }, [])

  useEffect(() => {
    const fetchCourses = async () => {
      setCourses([]) // clear while loading
      try {
        if (selectedInstituteId) {
          const res = await api2.get<Course[]>(`/api/courses?institute_id=${selectedInstituteId}`)
          setCourses(res.data)
        } else {
          const res = await api2.get<Course[]>("/api/courses")
          setCourses(res.data)
        }
      } catch (err) {
        toast.error("Failed to load courses")
      }
    }
    fetchCourses()
  }, [selectedInstituteId])

  const fetchJobFit = useCallback(async () => {
    if (!data) {
      setLoading(true)
    } else {
      setMetricsLoading(true)
      setSkillsLoading(true)
      setTimelineLoading(true)
    }

    try {
      const params: Record<string, string> = {}
      if (selectedCourseId) params.course_id = selectedCourseId
      else if (selectedInstituteId) params.institute_id = selectedInstituteId
      if (selectedYear) params.year = selectedYear
      if (appliedReferenceDate) params.reference_date = appliedReferenceDate

      const res = await api2.get<JobFitData>("/api/jobfit", { params })
      setData(res.data)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to fetch job fit analysis")
    } finally {
      setLoading(false)
      setMetricsLoading(false)
      setSkillsLoading(false)
      setTimelineLoading(false)
    }
  }, [selectedCourseId, selectedInstituteId, selectedYear, appliedReferenceDate]) // Removed data dependency to prevent infinite loops

  useEffect(() => {
    fetchJobFit()
  }, [fetchJobFit])

  const applyReferenceDate = () => {
    setAppliedReferenceDate(referenceDate)
  }

  const MetricsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="border-border/50">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-20 animate-pulse" />
              <div className="h-8 bg-muted rounded w-16 animate-pulse" />
              <div className="h-3 bg-muted rounded w-24 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const SkillsSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {Array.from({ length: 2 }).map((_, i) => (
        <Card key={i} className="border-border/50">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-32 animate-pulse" />
            <div className="h-4 bg-muted rounded w-48 animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="h-12 bg-muted rounded animate-pulse" />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const TimelineSkeleton = () => (
    <Card className="border-border/50">
      <CardHeader>
        <div className="h-6 bg-muted rounded w-40 animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </CardContent>
    </Card>
  )

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border/50 bg-muted/20">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="text-center space-y-4">
              <div className="h-10 bg-muted rounded w-64 mx-auto animate-pulse" />
              <div className="h-6 bg-muted rounded w-96 mx-auto animate-pulse" />
              <div className="h-8 bg-muted rounded w-48 mx-auto animate-pulse" />
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-16 animate-pulse" />
                    <div className="h-10 bg-muted rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-border/50">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                    <div className="h-8 bg-muted rounded animate-pulse" />
                    <div className="h-3 bg-muted rounded w-24 animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="border-border/50">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-32 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-48 animate-pulse" />
                </CardHeader>
                <CardContent className="space-y-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div key={j} className="h-12 bg-muted rounded animate-pulse" />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-border/50">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-40 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-20 bg-muted rounded animate-pulse" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Target className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">No data available</p>
        </div>
      </div>
    )
  }

  const notRelatedRatio = data.overall.fit_distribution.not_related
  const relatedRatio = data.overall.fit_distribution.related

  const skillsGapEntries = Object.entries(data.overall.skills_gap)
  const relatedSkillsEntries = Object.entries(data.overall.related_skills)
  const recommendedRolesEntries = Object.entries(data.overall.top_recommended_roles)
  const topTitlesEntries = Object.entries(data.overall.top_titles || {})
  const topCompaniesEntries = Object.entries(data.overall.top_companies || {})

  const maxSkillGapCount = Math.max(...skillsGapEntries.map(([, count]) => count), 1)
  const maxRelatedSkillCount = Math.max(...relatedSkillsEntries.map(([, count]) => count), 1)
  const maxRoleCount = Math.max(...recommendedRolesEntries.map(([, count]) => count), 1)
  const maxTitleCount = Math.max(...topTitlesEntries.map(([, count]) => count), 1)
  const maxCompanyCount = Math.max(...topCompaniesEntries.map(([, count]) => count), 1)

  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: currentYear - 2019 }, (_, i) => currentYear - i)

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-muted/20">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Job Fit Analysis</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive analysis of career outcomes and course effectiveness
            </p>
            <Badge variant="outline" className="text-sm">
              <Users className="h-4 w-4 mr-2" />
              {data.total_careers} Career Records Analyzed
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground mb-2 block">Institute</label>
                <Select
                  onValueChange={(val) => {
                    setSelectedInstituteId(val === "all" ? null : val)
                    setSelectedCourseId(null)
                  }}
                  value={selectedInstituteId || "all"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Institutes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Institutes</SelectItem>
                    {institutes.map((inst) => (
                      <SelectItem key={inst.id} value={inst.id}>
                        {inst.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium text-foreground mb-2 block">Course</label>
                <Select
                  onValueChange={(val) => setSelectedCourseId(val === "all" ? null : val)}
                  value={selectedCourseId || "all"}
                  disabled={courses.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Courses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium text-foreground mb-2 block">Batch Year</label>
                <Select
                  onValueChange={(val) => setSelectedYear(val === "all" ? null : val)}
                  value={selectedYear || "all"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <AnalysisCard title="Job Fit Analysis" analysis={data.overall.analysis_fit_distribution} />

        {metricsLoading ? (
          <MetricsSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Careers"
              value={data.total_careers}
              icon={Users}
              description="Career records tracked"
              variant="default"
            />
            <MetricCard
              title="Job Match Rate"
              value={`${relatedRatio}%`}
              icon={Target}
              description="Jobs matching course field"
              variant="success"
            />
            <MetricCard
              title="Mismatch Rate"
              value={`${notRelatedRatio}%`}
              icon={AlertTriangle}
              description="Jobs not matching course field"
              variant="warning"
            />
            <MetricCard
              title="Avg. Time to Job"
              value={`${Object.values(data.overall.avg_time_to_first_job_years)[0] || 0} yrs`}
              icon={Clock}
              description="Years to first employment"
              variant="default"
            />
          </div>
        )}

        {skillsLoading ? (
          <SkillsSkeleton />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {skillsGapEntries.length > 0 && (
              <Card className="border-border/50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-red-100 dark:bg-red-950 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    Skills Gap
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Skills used in jobs not related to course field</p>
                </CardHeader>
                <CardContent className="max-h-96 overflow-y-auto space-y-3">
                  {skillsGapEntries.map(([skill, count]) => (
                    <SkillBar key={skill} skill={skill} count={count} maxCount={maxSkillGapCount} />
                  ))}
                </CardContent>
                <AnalysisCard title="Skills Gap Insights" analysis={data.overall.analysis_skills_gap} />
              </Card>
            )}

            {relatedSkillsEntries.length > 0 && (
              <Card className="border-border/50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
                      <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    Relevant Skills
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Skills successfully used in course-related jobs</p>
                </CardHeader>
                <CardContent className="max-h-96 overflow-y-auto space-y-3">
                  {relatedSkillsEntries.map(([skill, count]) => (
                    <SkillBar key={skill} skill={skill} count={count} maxCount={maxRelatedSkillCount} />
                  ))}
                </CardContent>
                <AnalysisCard title="Related Skills Insights" analysis={data.overall.analysis_related_skills} />
              </Card>
            )}
          </div>
        )}

        {recommendedRolesEntries.length > 0 && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                Top Career Recommendations
              </CardTitle>
              <p className="text-sm text-muted-foreground">Most frequently recommended job roles for graduates</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recommendedRolesEntries.slice(0, 8).map(([role, count]) => (
                  <SkillBar key={role} skill={role} count={count} maxCount={maxRoleCount} />
                ))}
              </div>
            </CardContent>
            <AnalysisCard
              title="Career Recommendations Insights"
              analysis={data.overall.analysis_top_recommended_roles}
            />
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {topTitlesEntries.length > 0 && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded-lg">
                    <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  Top Job Titles
                </CardTitle>
                <p className="text-sm text-muted-foreground">Most common job titles among graduates</p>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto space-y-3">
                {topTitlesEntries.map(([title, count]) => (
                  <SkillBar key={title} skill={title} count={count} maxCount={maxTitleCount} />
                ))}
              </CardContent>
              <AnalysisCard title="Job Titles Analysis" analysis={data.overall.analysis_top_titles} />
            </Card>
          )}

          {topCompaniesEntries.length > 0 && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-orange-100 dark:bg-orange-950 rounded-lg">
                    <Building className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  Top Companies
                </CardTitle>
                <p className="text-sm text-muted-foreground">Most popular employers among graduates</p>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto space-y-3">
                {topCompaniesEntries.map(([company, count]) => (
                  <SkillBar key={company} skill={company} count={count} maxCount={maxCompanyCount} />
                ))}
              </CardContent>
              <AnalysisCard title="Top Companies Analysis" analysis={data.overall.analysis_top_companies} />
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {Object.keys(data.per_course).length > 0 && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-xl">Course Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(data.per_course).map(([courseId, courseData]) => (
                  <div key={courseId} className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground">{courseData.course_name}</h4>
                    </div>
                    <div className="flex gap-6 text-sm mb-3">
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        ✓ {courseData.fit_distribution.related}% Match
                      </span>
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        ✗ {courseData.fit_distribution.not_related}% Mismatch
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{courseData.insight_sentence}</p>
                    <p className="text-xs text-muted-foreground italic">{courseData.analysis_fit}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {Object.keys(data.per_institute).length > 0 && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-xl">Institute Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(data.per_institute).map(([instituteId, instituteData]) => (
                  <div key={instituteId} className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground">{instituteData.institute_name}</h4>
                    </div>
                    <div className="flex gap-6 text-sm mb-3">
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        ✓ {instituteData.fit_distribution.related}% Match
                      </span>
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        ✗ {instituteData.fit_distribution.not_related}% Mismatch
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{instituteData.insight_sentence}</p>
                    <p className="text-xs text-muted-foreground italic">{instituteData.analysis_fit}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {Object.keys(data.overall.avg_time_to_first_job_months).length > 0 && (
          <>
            {timelineLoading ? (
              <TimelineSkeleton />
            ) : (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded-lg">
                      <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    Employment Timeline by Batch
                  </CardTitle>
                  <div className="flex flex-col sm:flex-row sm:items-end gap-3 mt-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-foreground mb-2 block">Reference Date</label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="flex gap-2 flex-1 sm:flex-initial">
                          <Select
                            value={referenceDate.split("-")[0]}
                            onValueChange={(month) => {
                              const day = referenceDate.split("-")[1]
                              setReferenceDate(`${month}-${day}`)
                            }}
                          >
                            <SelectTrigger className="w-full sm:w-24">
                              <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="01">Jan</SelectItem>
                              <SelectItem value="02">Feb</SelectItem>
                              <SelectItem value="03">Mar</SelectItem>
                              <SelectItem value="04">Apr</SelectItem>
                              <SelectItem value="05">May</SelectItem>
                              <SelectItem value="06">Jun</SelectItem>
                              <SelectItem value="07">Jul</SelectItem>
                              <SelectItem value="08">Aug</SelectItem>
                              <SelectItem value="09">Sep</SelectItem>
                              <SelectItem value="10">Oct</SelectItem>
                              <SelectItem value="11">Nov</SelectItem>
                              <SelectItem value="12">Dec</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select
                            value={referenceDate.split("-")[1]}
                            onValueChange={(day) => {
                              const month = referenceDate.split("-")[0]
                              setReferenceDate(`${month}-${day}`)
                            }}
                          >
                            <SelectTrigger className="w-full sm:w-20">
                              <SelectValue placeholder="Day" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                <SelectItem key={day} value={String(day).padStart(2, "0")}>
                                  {day}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Reference date for calculating employment timeline (currently: {referenceDate})
                      </p>
                    </div>
                    <Button onClick={applyReferenceDate} className="w-full sm:w-auto sm:mb-6">
                      Apply Date
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(data.overall.avg_time_to_first_job_months).map(([batch, months]) => (
                      <div key={batch} className="p-4 bg-muted/30 rounded-lg text-center">
                        <div className="space-y-2">
                          <div className="text-2xl font-bold text-foreground">{months} months</div>
                          <div className="text-lg font-semibold text-muted-foreground">
                            ({data.overall.avg_time_to_first_job_years[batch]} years)
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-2 font-medium">Batch {batch}</div>
                        {data.overall.analysis_time_to_first_job[batch] && (
                          <p className="text-xs text-muted-foreground mt-2 italic">
                            {data.overall.analysis_time_to_first_job[batch]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
