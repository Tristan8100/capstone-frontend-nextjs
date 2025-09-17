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
      const response = await api2.get<any>(`/api/posts-only/status/${status}?page=${page}`);
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
      <div>
        <div className="space-y-8 p-6 max-w-6xl mx-auto">
          <div className="space-y-0.5">
            <h2 className="text-3xl font-bold tracking-tight">Community Feed</h2>
            <p className="text-muted-foreground">Interact with Alumni Community Members and share your thoughts and experiences</p>
          </div>
          <Separator/>
        </div>
      </div>
      <CreatePost />

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