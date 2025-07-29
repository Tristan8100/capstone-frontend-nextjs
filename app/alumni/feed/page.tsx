'use client';
import { useState, useEffect, useCallback } from 'react';
import InfiniteScroll from '@/components/infinite-scroll';
import { Loader2 } from 'lucide-react';
import PostComponentsAlumni from "@/components/alumni-components/alumni-post-components";
import CreatePost from "@/components/alumni-components/create-post";
import { api2 } from "@/lib/api";
import { Separator } from "@/components/ui/separator";


export default function Page() {
  const [posts, setPosts] = useState([]);
  const [status] = useState("accepted");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    if (!hasMore || loading) return;
    
    setLoading(true);
    try {
      const response = await api2.get<any>(`/api/posts/status/${status}?page=${page}`);
      const newPosts = response.data.data;
      
      setPosts(prev => [...prev, ...newPosts]);
      setHasMore(!!response.data.next_page_url);
      setPage(prev => prev + 1);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading, status]);

  // Initial load
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4">
        <div className="flex justify-between items-center max-w-screen-xl mb-4 mx-auto">
          <h1 className="text-2xl font-bold">Community Feed</h1>
        </div>
        <Separator/>
      </div>
      <CreatePost />
      <Separator className="border-border my-6" />

      <div className="space-y-4">
        {posts.map((post) => (
          <PostComponentsAlumni 
            status={status} 
            is_liked={post.is_liked} 
            isAdmin={false} 
            key={post.id} 
            post={post} 
          />
        ))}
      </div>

      <InfiniteScroll
        hasMore={hasMore}
        isLoading={loading}
        next={fetchPosts}
        threshold={0.5} // Load when 50% of last post is visible
      >
        {hasMore && (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
      </InfiniteScroll>
    </>
  );
}