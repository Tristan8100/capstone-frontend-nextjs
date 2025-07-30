import { useState, ChangeEvent, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { api2 } from "@/lib/api";
import Link from "next/link"; // Add this import
import Image from "next/image";


interface Alumni {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  course?: string;
  batch?: number;
  profile_path?: string;
  institute?: string;
}

export function SearchAlumni({ isAdmin }: { isAdmin: boolean }) {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Alumni[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length > 2) {
        fetchAlumni();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchAlumni = async () => {
    setIsLoading(true);
    try {
      const response = await api2.get<any>('/api/alumni', {
        params: {
          search: searchQuery,
          per_page: 5
        }
      });
      setSearchResults(response.data.data);
    } catch (error) {
      console.error('Error fetching alumni:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = (): void => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchOpen(false);
  };

  return (
    <div className="relative w-full max-w-[300px]">
      {/* Search Input */}
      <div className="flex gap-2 w-full">
        <div className={`relative w-full ${isSearchOpen ? "block" : "hidden"} md:block`}>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search alumni..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-7 w-7"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        >
          {isSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>

      {/* Results Overlay */}
      {searchQuery && (
        <div className="absolute left-0 right-0 mt-1 bg-background border shadow-lg rounded-md p-2 max-h-[60vh] overflow-y-auto z-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-sm">Search Results</h3>
            <Button variant="ghost" size="sm" className="h-7" onClick={clearSearch}>
              <X className="h-3 w-3" />
            </Button>
          </div>

          {isLoading ? (
            <p className="text-muted-foreground text-sm text-center py-2">Loading...</p>
          ) : searchResults.length > 0 ? (
            <div className="space-y-2">
              {searchResults.map((user) => (
                <Link
                  key={user.id}
                  href={isAdmin ? `/admin/view/${user.id}` : `/alumni/view/${user.id}`}
                  className="block"
                >
                  <div className="flex items-center gap-3 p-2 hover:bg-accent rounded-lg cursor-pointer">
                    <Avatar className="h-8 w-8">
                      {user.profile_path ? (
                        <Image
                          src={user.profile_path}
                          alt={`${user.firstName} ${user.lastName}`}
                          width={32}
                          height={32}
                          className="h-full w-full object-cover"
                          unoptimized={true} // Remove this if you want Next.js to optimize the image
                        />
                      ) : (
                        <AvatarFallback>
                          {`${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {`${user.firstName} ${user.lastName}`}
                      </p>
                      {user.email && (
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-2">
              {searchQuery.length > 2 ? "No results found" : "Type at least 3 characters..."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}