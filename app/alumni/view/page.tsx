'use client'

import UserProfilePage from "@/components/alumni-profile"
import { api2 } from "@/lib/api"
import { useEffect, useState } from "react"
import PostComponentsAlumni from "@/components/alumni-components/alumni-post-components"

export default function ViewAlumni() {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<any[]>([]);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        
        api2.get<any>('/api/posts/user/10003')
            .then((res) => {
                setUserData(res.data.user);
                setPosts(res.data.posts || []); // Ensure posts is always an array
                console.log('User data loaded:', res.data.user);
            })
            .catch((err) => {
                console.error('Error:', err);
                setError('Failed to load user data');
            })
            setLoading(false);
    }, []);

    if (loading) return <div>Loading user data...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!userData) return <div>No user data available</div>;

    return (
        <>
            <UserProfilePage userData={userData} />
            
            {posts.map((post) => (
                <PostComponentsAlumni 
                    key={post.id}
                    status={'accepted'} 
                    is_liked={post.is_liked} 
                    isAdmin={false} 
                    post={post}
                />
            ))}
        </>
    );
}