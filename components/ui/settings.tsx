'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { api2 } from '@/lib/api'

type response = {
  message: string
  success: boolean
  profile_path: string
}

export function UserSettings() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  const [profile, setprofile] = useState(user.profile_path)
  

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0]
    if (!file) return toast.error('Please select a photo.')

    const formData = new FormData()
    formData.append('photo', file)

    setLoading(true)
    try {
      const res = await api2.post<response>('/api/profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      toast.success(res.data.message || 'Photo uploaded successfully.')
      setprofile(res.data.profile_path)
      // reload or update preview
      setPreview(null)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Upload failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleThemeChange = (value: 'light' | 'dark' | 'system') => {
    setTheme(value)
  }

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      <div className="space-y-0.5">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings, preferences, and more.</p>
      </div>

      <Separator className="my-6" />

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>This is how others will see you on the site.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Label htmlFor="profile-photo">Profile Photo</Label>
            <div className="flex flex-col items-center gap-4">
              <Image
                src={
                  preview
                    ? preview
                    : user?.profile_path
                    ? baseUrl + profile
                    : '/static/user.png'
                }
                alt="Profile"
                width={96}
                height={96}
                className="rounded-full object-cover border border-gray-200"
              />
              <Input
                ref={fileInputRef}
                id="profile-photo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full max-w-sm"
              />
              <p className="text-sm text-muted-foreground text-center">
                Upload a new profile picture. Max file size 20MB.
              </p>
              <Button type="button" onClick={handleUpload} disabled={loading}>
                {loading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" value={user.name} disabled />
          </div>

          <div className="grid gap-2 mt-4">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={user.email} disabled />
            <p className="text-sm text-muted-foreground">
              You cannot change your email address from here. Please contact support if needed.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the appearance of the application.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 max-w-xs">
            <Label htmlFor="theme-select">Theme</Label>
            {mounted ? (
              <Select onValueChange={handleThemeChange} defaultValue={theme as string}>
                <SelectTrigger id="theme-select">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="h-10 w-[180px] rounded-md border px-3 py-2 text-sm text-muted-foreground flex items-center justify-between">
                <span>Loading theme...</span>
              </div>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              Select the visual theme for your application.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => console.log('Update Password clicked')}>Update Password</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
