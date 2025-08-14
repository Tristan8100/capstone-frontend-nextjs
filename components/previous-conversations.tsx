'use client';
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api2 } from "@/lib/api";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";

export default function PreviousConversations() {
  const [conversations, setConversations] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
    const params = useParams();

  const fetchConversations = async () => {
    try {
      const response = await api2.get<any>(`/api/get-conversations/admin?search=${search}&page=${page}`);
      setConversations(response.data.data);
      setTotalPages(response.data.last_page);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [search, page]);

  const truncateMessage = (message: string, maxLength: number = 40) => {
    if (!message) return "";
    return message.length > maxLength 
      ? `${message.substring(0, maxLength)}...` 
      : message;
  };

  return (
    <div className="flex flex-col border h-full border-r">
      {/* Header with search */}
      <div className="p-3 border-b">
        <h1 className="text-lg font-semibold pb-2">Conversations</h1>
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="h-8 text-sm"
        />
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`p-3 hover:bg-accent cursor-pointer border-b ${
                params.id === conv.id ? 'bg-accent' : ''
            }`}
            onClick={() => router.push(`/admin/chat/${conv.id}`)}
          >
            <div className="flex items-start gap-3">
              <div className="relative h-10 w-10 flex-shrink-0">
                <Image
                  src={conv.user.profile_path || '/default-profile.png'}
                  alt={`${conv.user.first_name} ${conv.user.last_name}`}
                  fill
                  className="rounded-full object-cover"
                  sizes="40px"
                />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="text-sm font-medium leading-tight">
                      {conv.user.first_name} {conv.user.last_name}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">
                        Batch {conv.user.batch}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground truncate">
                        {conv.user.email}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(conv.updated_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                
                {conv.last_message && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {truncateMessage(conv.last_message)}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center p-2 border-t">
        <div className="text-xs text-muted-foreground px-2">
          Page {page} of {totalPages}
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
            className="h-7 px-2 text-xs"
          >
            Previous
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
            className="h-7 px-2 text-xs"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}