'use client';

import { useState } from 'react';
import { api2 } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function PostCreatorAlumni() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!title.trim() || !content.trim()) {
    toast.error('Title and content are required.');
    return;
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('content', content);

  images.forEach((image) => {
    formData.append('images[]', image);
  });

  try {
    await toast.promise(
    Promise.resolve(
      api2.post('/api/posts', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).then((res) => {
      // ✅ only runs if successful
      setTitle('');
      setContent('');
      setImages([]);
      router.push('/alumni/my-posts');
      return res;
    }),
    {
      loading: 'Creating announcement...',
      success: 'Post created!',
      error: (err) =>
        err?.response?.data?.message || 'Failed to create announcement.',
    }
  );
  } catch (error: any) {
    console.error(error);
    const message = error.response?.data?.message || 'Failed to create announcement.';
    toast.error(message);
  }
};


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border rounded p-2 w-full"
        required
      />
      <textarea
        name="content"
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border rounded p-2 w-full"
        required
      />
      <input
        type="file"
        name="images[]"
        accept="image/*"
        multiple
        onChange={(e) => setImages(Array.from(e.target.files || []))}
        className="block"
      />
      <Button type="submit">Create Post</Button>
    </form>
  );
}
