'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { toast } from 'sonner'
import { api2 } from '@/lib/api'

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

export default function CareerTracking() {
  const [careers, setCareers] = useState<Career[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingCareer, setEditingCareer] = useState<Career | null>(null)
  const [form, setForm] = useState({
    title: '',
    company: '',
    description: '',
    skills_used: '',
    start_date: '',
    end_date: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchCareers()
  }, [])

  const normalizeCareer = (career: Career) => ({
    ...career,
    recommended_jobs: Array.isArray(career.recommended_jobs)
      ? career.recommended_jobs
      : typeof career.recommended_jobs === 'string'
        ? career.recommended_jobs.split(',').map(s => s.trim())
        : []
  })

  const fetchCareers = async () => {
    setLoading(true)
    try {
      const res = await api2.get<{ data: Career[] }>('/api/career')
      setCareers(res.data.data.map(normalizeCareer))
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to fetch careers')
    } finally {
      setLoading(false)
    }
  }

  const openAddDialog = () => {
    setEditingCareer(null)
    setForm({ title: '', company: '', description: '', skills_used: '', start_date: '', end_date: '' })
    setOpenDialog(true)
  }

  const openEditDialog = (career: Career) => {
    setEditingCareer(career)
    setForm({
      title: career.title,
      company: career.company,
      description: career.description || '',
      skills_used: career.skills_used?.join(', ') || '',
      start_date: career.start_date,
      end_date: career.end_date || ''
    })
    setOpenDialog(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const payload = {
      ...form,
      skills_used: form.skills_used.split(',').map(s => s.trim())
    }

    try {
      if (editingCareer) {
        const res = await api2.put<{ data: Career }>(`/api/career/${editingCareer.id}`, payload)
        setCareers(careers.map(c => c.id === editingCareer.id ? normalizeCareer(res.data.data) : c))
        toast.success('Career updated successfully')
      } else {
        const res = await api2.post<{ data: Career }>('/api/career', payload)
        setCareers([normalizeCareer(res.data.data), ...careers])
        toast.success('Career added successfully')
      }
      setOpenDialog(false)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save career')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (careerId: string) => {
    if (!confirm('Are you sure you want to delete this career?')) return
    try {
      await api2.delete(`/api/career/${careerId}`)
      setCareers(careers.filter(c => c.id !== careerId))
      toast.success('Career deleted successfully')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete career')
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Career Tracking</h1>
        <Button onClick={openAddDialog}>Add Career</Button>
      </div>

      <Separator className="my-4" />

      {loading ? (
        <p>Loading...</p>
      ) : careers.length === 0 ? (
        <p>No careers yet. Click "Add Career" to get started.</p>
      ) : (
        <div className="grid gap-4">
          {careers.map(career => {
            const recommendedJobs = Array.isArray(career.recommended_jobs)
              ? career.recommended_jobs
              : typeof career.recommended_jobs === 'string'
                ? career.recommended_jobs.split(',').map(s => s.trim())
                : []

            return (
              <Card key={career.id}>
                <CardHeader>
                  <CardTitle>{career.title} @ {career.company}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Description:</strong> {career.description || '-'}</p>
                  <p><strong>Skills:</strong> {career.skills_used?.join(', ') || '-'}</p>
                  <p><strong>Start Date:</strong> {career.start_date}</p>
                  <p><strong>End Date:</strong> {career.end_date || '-'}</p>
                  <Separator />
                  <p><strong>Fit Category:</strong> {career.fit_category || '-'}</p>
                  <p><strong>Recommended Jobs:</strong> {recommendedJobs.join(', ') || '-'}</p>
                  <p><strong>Analysis Notes:</strong> {career.analysis_notes || '-'}</p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(career)}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(career.id)}>Delete</Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}

      {/* Dialog for Add/Edit */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingCareer ? 'Edit Career' : 'Add Career'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="grid gap-1">
              <Label htmlFor="title">Job Title</Label>
              <Input id="title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="company">Company</Label>
              <Input id="company" value={form.company} onChange={e => setForm({...form, company: e.target.value})} />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="description">Description</Label>
              <Input id="description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="skills_used">Skills Used (comma separated)</Label>
              <Input id="skills_used" value={form.skills_used} onChange={e => setForm({...form, skills_used: e.target.value})} />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="start_date">Start Date</Label>
              <Input id="start_date" type="date" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="end_date">End Date</Label>
              <Input id="end_date" type="date" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})} />
            </div>
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button onClick={() => setOpenDialog(false)} variant="outline">Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editingCareer ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
