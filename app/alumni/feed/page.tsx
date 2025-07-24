'use client'

import PostComponents from "@/components/alumni-components/posts-components"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import CreatePost from "@/components/alumni-components/create-post"
import PostComponentsAlumni from "@/components/alumni-components/alumni-post-components";
import { api2 } from "@/lib/api";
import { useEffect, useState } from "react";

export default function Page() {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("accepted");

  useEffect(() => {
    fetchposts();
  },[]);

  const fetchposts = async () => {
    try {
      const response = await api2.get<any>(`/api/posts/status/${status}`);
      setPosts(response.data);
      console.log(response.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

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

      {posts.map((post) => (
        <PostComponentsAlumni status={status} isAdmin={false} key={post.id} post={post} />
      ))}
      
    </>
  );
}
