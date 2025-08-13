'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api2 } from '@/lib/api';

export default function ChatList() {
  const [conversations, setConversations] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await api2.get<any>('/api/get-conversations/admin');
        setConversations(response.data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };
    fetchConversations();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Chats</h1>
      <div className="space-y-2">
        {conversations.map((conv) => (
          <div 
            key={conv.id}
            className="p-3 border rounded hover:bg-gray-100 cursor-pointer"
            onClick={() => router.push(`/admin/chat/${conv.id}`)}
          >
            <div className="flex items-center gap-3">
              <img
                src={conv.user.profile_path || '/default-profile.png'}
                alt={conv.user.first_name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium">
                  {conv.user.first_name} {conv.user.last_name} (Batch {conv.user.batch})
                </p>
                <p className="text-sm text-gray-500">
                  Last updated: {conv.updated_at} {/* RAW DATE FROM API */}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}