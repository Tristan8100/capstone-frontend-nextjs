'use client'

import UserProfilePage from "@/components/alumni-profile"
import { api2 } from "@/lib/api"
import { useEffect, useState, useCallback } from "react"
import PostComponentsAlumni from "@/components/alumni-components/alumni-post-components"
import { useParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import InfiniteScroll from "@/components/infinite-scroll"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function ViewAlumni() {
    const [userData, setUserData] = useState<any>(null)
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState({
        profile: true,
        posts: false
    })
    const [error, setError] = useState<any>(null)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const params = useParams()
    const userId = params.id as string

    const formatDate = (date: string | null) => {
        if (!date) return "Present"
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
        })
    }

    // Fetch user profile data
    useEffect(() => {
        setLoading(prev => ({...prev, profile: true}))
        setError(null)
        
        api2.get<any>(`/api/posts/user/${userId}`)
            .then((res) => {
                setUserData(res.data.user)
            })
            .catch((err) => {
                console.error('Error loading profile:', err)
                setError('Failed to load user profile')
            })
            setLoading(prev => ({...prev, profile: false}))
    }, [userId])

    // Fetch posts with infinite scroll
    const fetchPosts = useCallback(async (reset = false) => {
        if ((!hasMore && !reset) || loading.posts) return
        
        setLoading(prev => ({...prev, posts: true}))
        try {
            const currentPage = reset ? 1 : page
            const response = await api2.get<any>(
                `/api/posts/status/accepted/${userId}?page=${currentPage}`
            )
            
            const newPosts = response.data.data || []
            setPosts(prev => reset ? newPosts : [...prev, ...newPosts])
            setPage(reset ? 2 : prev => prev + 1)
            setHasMore(!!response.data.next_page_url)
        } catch (err) {
            console.error('Error loading posts:', err)
            setError('Failed to load posts')
        } finally {
            setLoading(prev => ({...prev, posts: false}))
        }
    }, [userId, page, hasMore, loading.posts])

    useEffect(() => {
        fetchPosts(true)
    }, [userId])

    if (loading.profile) return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-lg" />
                ))}
            </div>
        </div>
    )

    if (error) return (
        <div className="max-w-4xl mx-auto p-4">
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        </div>
    )

    if (!userData) return (
        <div className="max-w-4xl mx-auto p-4">
            <Alert>
                <AlertDescription>No user data available</AlertDescription>
            </Alert>
        </div>
    )

    return (
        <div className="space-y-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Profile Section */}
                <UserProfilePage userData={userData} />

                {/* Careers in Dialog */}
                {userData.careers?.length > 0 && (
                    <div className="max-w-3xl mx-auto">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button 
                                    variant="outline" 
                                    className="w-full rounded-xl font-medium shadow-sm hover:shadow-md transition"
                                >
                                    View Career History ({userData.careers.length})
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto rounded-2xl shadow-xl p-6">
                                <DialogHeader className="border-b pb-4">
                                    <DialogTitle className="text-2xl font-bold text-gray-800">
                                        Career History
                                    </DialogTitle>
                                </DialogHeader>

                                <div className="space-y-6 mt-4">
                                    {userData.careers.map((career: any) => (
                                        <div 
                                            key={career.id} 
                                            className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition"
                                        >
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold text-lg text-gray-900">
                                                    {career.title}
                                                </h3>
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(career.start_date)} – {formatDate(career.end_date)}
                                                </span>
                                            </div>

                                            <p className="text-sm text-muted-foreground">{career.company}</p>

                                            {career.description && (
                                                <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                                                    {career.description}
                                                </p>
                                            )}

                                            {career.skills_used?.length > 0 && (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {career.skills_used.map((skill: string, i: number) => (
                                                        <span 
                                                            key={i} 
                                                            className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}

                {/* Posts Section with Title */}
                <div className="space-y-4 p-4 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold tracking-tight">
                        {posts.length > 0 ? 'Recent Posts' : 'No Posts Yet'}
                    </h2>
                    <Separator className="w-full" />
                </div>
            </div>

            {/* Posts Grid with Infinite Scroll */}
            <div className="space-y-6 mx-auto">
                {posts.map((post) => (
                    <PostComponentsAlumni 
                        key={post.id}
                        status={'accepted'} 
                        is_liked={post.is_liked} 
                        isAdmin={false} 
                        post={post}
                    />
                ))}

                <InfiniteScroll
                    hasMore={hasMore}
                    isLoading={loading.posts}
                    next={fetchPosts}
                    threshold={0.8}
                >
                    {hasMore && (
                        <div className="flex justify-center p-4">
                            <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                    )}
                </InfiniteScroll>

                {posts.length === 0 && !loading.posts && (
                    <div className="text-center py-12 text-muted-foreground">
                        This user hasn't posted anything yet.
                    </div>
                )}
            </div>
        </div>
    )
}
