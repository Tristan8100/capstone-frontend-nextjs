'use client'

import { useEffect, useState } from 'react'
import { api2 } from '@/lib/api'
import { toast } from 'sonner'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

type JobFitData = {
  total_careers: number
  overall: {
    fit_distribution: { related: number; not_related: number }
    effectiveness_score: number
    skills_gap: Record<string, number>
    top_recommended_roles: Record<string, number>
    avg_time_to_first_job_months: Record<string, number>
    avg_time_to_first_job_years: Record<string, number>
  }
  per_course: Record<string, any>
  per_institute: Record<string, any>
}

type Course = { id: string; name: string; institute: { name: string } }
type Institute = { id: string; name: string }

const COLORS = ['#4ade80', '#f87171']

export default function JobFitAnalysis() {
  const [data, setData] = useState<JobFitData | null>(null)
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<Course[]>([])
  const [institutes, setInstitutes] = useState<Institute[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [selectedInstitute, setSelectedInstitute] = useState<string | null>(null)

  useEffect(() => {
    fetchFilters()
    fetchJobFit()
  }, [])

  useEffect(() => {
    fetchJobFit()
  }, [selectedCourse, selectedInstitute])

  const fetchFilters = async () => {
    try {
      const coursesRes = await api2.get<Course[]>('/api/get-courses-general')
      setCourses(coursesRes.data)

      const institutesRes = await api2.get<Institute[]>('/api/get-institutes-general')
      setInstitutes(institutesRes.data)
    } catch (err: any) {
      toast.error('Failed to fetch filters')
    }
  }

  const fetchJobFit = async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = {}
      if (selectedCourse) params.course_id = selectedCourse
      else if (selectedInstitute) params.institute_id = selectedInstitute

      const res = await api2.get<JobFitData>('/api/jobfit', { params })
      setData(res.data)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to fetch job fit analysis')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p>Loading...</p>
  if (!data) return <p>No data available.</p>

  const fitData = [
    { name: 'Related', value: data.overall.fit_distribution.related },
    { name: 'Not Related', value: data.overall.fit_distribution.not_related }
  ]
  const skillsGapData = Object.entries(data.overall.skills_gap).map(([skill, count]) => ({ skill, count }))
  const recommendedRolesData = Object.entries(data.overall.top_recommended_roles).map(([role, count]) => ({ role, count }))

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold">Job Fit Analysis</h1>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={selectedCourse || ''} onValueChange={val => { setSelectedCourse(val || null); setSelectedInstitute(null) }}>
          <SelectTrigger className="w-60">
            <SelectValue placeholder="Filter by Course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map(course => (
              <SelectItem key={course.id} value={course.id}>{course.name} ({course.institute.name})</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedInstitute || ''} onValueChange={val => { setSelectedInstitute(val || null); setSelectedCourse(null) }}>
          <SelectTrigger className="w-60">
            <SelectValue placeholder="Filter by Institute" />
          </SelectTrigger>
          <SelectContent>
            {institutes.map(inst => (
              <SelectItem key={inst.id} value={inst.id}>{inst.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Total Careers */}
      <Card>
        <CardHeader>
          <CardTitle>Total Careers</CardTitle>
        </CardHeader>
        <CardContent>{data.total_careers}</CardContent>
      </Card>

      {/* Overall Fit Distribution (Chart) */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Fit Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={fitData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {fitData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Effectiveness Score */}
      <Card>
        <CardHeader>
          <CardTitle>Effectiveness Score</CardTitle>
        </CardHeader>
        <CardContent>{data.overall.effectiveness_score}</CardContent>
      </Card>

      {/* Skills Gap (Chart) */}
      {skillsGapData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Skills Gap Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={skillsGapData}>
                <XAxis dataKey="skill" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#f87171" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Top Recommended Roles (Chart) */}
      {recommendedRolesData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Recommended Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={recommendedRolesData}>
                <XAxis dataKey="role" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4ade80" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Avg Time to First Job (Text Only) */}
      <Card>
        <CardHeader>
          <CardTitle>Average Time to First Job (Months)</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(data.overall.avg_time_to_first_job_months).map(([batch, months]) => (
            <p key={batch}>{batch}: {months} months</p>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Time to First Job (Years)</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(data.overall.avg_time_to_first_job_years).map(([batch, years]) => (
            <p key={batch}>{batch}: {years} years</p>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
