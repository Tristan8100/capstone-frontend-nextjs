'use client'

import UserProfilePage from "@/components/alumni-profile"
import { api2 } from "@/lib/api"
import { useEffect, useState } from "react"
import PostComponentsAlumni from "@/components/alumni-components/alumni-post-components"
import { useParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function ViewAlumni() {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<any[]>([]);
    const [error, setError] = useState<any>(null);
    const params = useParams();
    const userId = params.id as string;

    useEffect(() => {
        setLoading(true);
        setError(null);
        
        api2.get<any>(`/api/posts/user/${userId}`)
            .then((res) => {
                setUserData(res.data.user);
                setPosts(res.data.posts || []);
            })
            .catch((err) => {
                console.error('Error:', err);
                setError('Failed to load user data');
            })
            setLoading(false);
    }, [userId]);

    if (loading) return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-lg" />
                ))}
            </div>
        </div>
    );

    if (error) return (
        <div className="max-w-4xl mx-auto p-4">
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        </div>
    );

    if (!userData) return (
        <div className="max-w-4xl mx-auto p-4">
            <Alert>
                <AlertDescription>No user data available</AlertDescription>
            </Alert>
        </div>
    );

    return (
    <>
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            {/* Profile Section */}
            <UserProfilePage userData={userData} />
            
            {/* Posts Section with Title */}
            <div className="space-y-4">
                <div className="space-y-2 max-w-3xl mx-auto"> {/* Constrained and centered */}
                    <h2 className="text-2xl font-bold tracking-tight">
                        {posts.length > 0 ? 'Recent Posts' : 'No Posts Yet'}
                    </h2>
                    <Separator className="w-full" />
                </div>
                
                {posts.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground max-w-3xl mx-auto"> {/* Same width */}
                        This user hasn't posted anything yet.
                    </div>
                )}
            </div>
        </div>

        {/* Posts Grid */}
        <div className="space-y-6 mx-auto"> {/* Same width constraint as title */}
            {posts.map((post) => (
                <PostComponentsAlumni 
                    key={post.id}
                    status={'accepted'} 
                    is_liked={post.is_liked} 
                    isAdmin={false} 
                    post={post}
                />
            ))}
        </div>
    </>
    );
}