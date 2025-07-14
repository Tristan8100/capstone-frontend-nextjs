"use client"

import { useState, useEffect } from "react"
import { Search, Building2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { api2 } from "@/lib/api"

interface Institute {
  id: string
  name: string
  description?: string | null
  image_path?: string | null
  created_at?: string
  updated_at?: string
}

export default function InstitutesList() {
  const [institutes, setInstitutes] = useState<Institute[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchInstitutes = async (search = "") => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (search) params.append("search", search)

      const response = await api2.get(`/api/institutes?${params.toString()}`)

      // Your API returns a direct array
      const data = Array.isArray(response.data) ? response.data as Institute[] : []

      setInstitutes(data)
    } catch (err: any) {
      console.error("API Error:", err)
      setError(err.response?.data?.message || err.message || "Failed to fetch institutes")
      setInstitutes([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInstitutes()
  }, [])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    fetchInstitutes(value)
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Institutes</h1>
          <p className="text-muted-foreground">
            {institutes.length > 0
              ? `Found ${institutes.length} institute${institutes.length === 1 ? "" : "s"}`
              : "No institutes found"}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search institutes..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Institutes Grid */}
      {!loading && institutes.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {institutes.map((institute) => (
            <Card key={institute.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{institute.name}</CardTitle>
                  </div>
                  {institute.created_at && (
                    <Badge variant="secondary" className="text-xs">
                      {new Date(institute.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Badge>
                  )}
                </div>
                {institute.description && (
                  <CardDescription className="line-clamp-2">{institute.description}</CardDescription>
                )}
              </CardHeader>

              {institute.image_path && (
                <CardContent>
                  <div className="aspect-video relative overflow-hidden rounded-md bg-muted">
                    <img
                      src={`http://127.0.0.1:8000/${institute.image_path}`}
                      alt={institute.name}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                      }}
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && institutes.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No institutes found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? `No institutes match "${searchTerm}"` : "No institutes available at the moment"}
          </p>
        </div>
      )}
    </div>
  )
}
