'use client'; 
import { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api2 } from "@/lib/api";
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useParams } from "next/navigation";

export default function PreviousConversations() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await api2.get<any>(`/api/get-conversations/admin?search=${debouncedSearch}&page=${page}`);
      setConversations(response.data.data);
      setTotalPages(response.data.last_page);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search input
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  // Fetch conversations when debounced search or page changes
  useEffect(() => {
    fetchConversations();
  }, [debouncedSearch, page]);

  const truncateMessage = (message: string, maxLength: number = 40) => {
    if (!message) return "";
    return message.length > maxLength ? `${message.substring(0, maxLength)}...` : message;
  };

  return (
    <div className="flex flex-col border h-full border-r">
      {/* Header with search */}
      <div className="p-3 border-b">
        <h1 className="text-lg font-semibold pb-2">Conversations</h1>
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 text-sm"
        />
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col gap-2 p-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={`p-3 hover:bg-accent cursor-pointer border-b ${
                params.id === conv.id ? 'bg-accent' : ''
              }`}
              onClick={() => router.push(`/admin/chat/${conv.id}`)}
            >
              <div className="flex items-start gap-3">
                <Avatar className="w-12 h-12 rounded-full flex-shrink-0">
                  <AvatarImage
                    src={conv.user.profile_path || '/default-profile.png'}
                    alt={`${conv.user.first_name} ${conv.user.last_name}`}
                    width={48}
                    height={48}
                  />
                  <AvatarFallback>
                    {conv.user.first_name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>

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
          ))
        )}
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
