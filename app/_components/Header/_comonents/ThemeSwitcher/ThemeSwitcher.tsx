"use client"

import * as React from "react"
import { Moon, MoonIcon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme()

  switch (theme) {
    case 'dark' :
      return <Button className="rounded-full" onClick={() => setTheme("light")} variant="outline" size="icon">
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 rounded-full" />
      </Button>

    default:
      return <Button className="rounded-full" onClick={() => setTheme("dark")} variant="outline" size="icon">
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 rounded-full" />
      </Button>
  }
}
