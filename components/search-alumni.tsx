import { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SearchResult {
  id: number;
  name: string;
  role: string;
}

export function SearchAlumni() {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => {
    const query = e.target.value;
    setSearchQuery(query);

    // Mock search - replace with actual API call
    if (query.length > 2) {
      setSearchResults([
        { id: 1, name: "Jane Smith", role: "Backend Developer" },
        { id: 2, name: "John Doe", role: "UX Designer" },
      ]);
    } else {
      setSearchResults([]);
    }
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

      {/* Results Overlay - Now positioned relative to the search container */}
      {searchQuery && (
        <div className="absolute left-0 right-0 mt-1 bg-background border shadow-lg rounded-md p-2 max-h-[60vh] overflow-y-auto z-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-sm">Search Results</h3>
            <Button variant="ghost" size="sm" className="h-7" onClick={clearSearch}>
              <X className="h-3 w-3" />
            </Button>
          </div>

          {searchResults.length > 0 ? (
            <div className="space-y-2">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-2 hover:bg-accent rounded-lg cursor-pointer"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.role}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-2">
              {searchQuery.length > 2 ? "No results found" : "Keep typing..."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}