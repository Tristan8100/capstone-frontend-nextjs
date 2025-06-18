// components/search-alumni.tsx
"use client"

import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"


export function SearchAlumni() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")




  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    if (isSearchOpen) {
      setSearchQuery("")
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`relative ${isSearchOpen ? 'block' : 'hidden'} md:block`}>
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search alumni..."
          className="w-full pl-8 transition-all duration-300 md:w-[200px] lg:w-[250px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1 h-7 w-7 md:hidden"
          onClick={toggleSearch}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={toggleSearch}
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  )
}