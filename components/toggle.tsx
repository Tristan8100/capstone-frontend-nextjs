import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"
import { useEffect, useState } from "react"

export function ModeToggle() {
  const { setTheme } = useTheme()

    function handleThemeChange(e: React.MouseEvent<HTMLButtonElement>) {
        if(!localStorage.getItem('vite-ui-theme')) {
            return setTheme('dark');
        }
        localStorage.getItem('vite-ui-theme') === 'dark' ? setTheme('light') : setTheme('dark')
    }

  return (
    <Button onClick={handleThemeChange} variant="outline" size="icon">
        {localStorage.getItem('vite-ui-theme') ? (
            localStorage.getItem('vite-ui-theme') === 'dark' ? <Moon/> : <Sun/>
        ) : (
            <Sun/>
        )}
    </Button>
  )
}