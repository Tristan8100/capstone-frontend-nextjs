'use client';

import { useState } from 'react';
import { api2 } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from './ui/button';

export default function PostCreator({ onSuccess }: { onSuccess?: () => void }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    images.forEach((image) => {
      formData.append('images[]', image); // <-- Important: images[] with brackets
    });

    try {
      await toast.promise(
        new Promise((resolve, reject) => {
          api2
            .post('/api/announcements', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            .then(resolve)
            .catch(reject);
        }),
        {
          loading: 'Creating announcement...',
          success: 'Announcement created!',
          error: (err) =>
            err?.response?.data?.message || 'Failed to create announcement.',
        }
      );
      setTitle('');
      setContent('');
      setImages([]);
      setLoading(false);
      onSuccess?.();
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
      <Button disabled={loading} type="submit">Create Announcement</Button>
    </form>
  );
}
