"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function LanguageToggle() {
  const [isArabic, setIsArabic] = useState(true)

  const toggleLanguage = () => {
    setIsArabic(!isArabic)
    // In a real app, this would update the app's language context
    document.documentElement.lang = isArabic ? "en" : "ar"
    document.documentElement.dir = isArabic ? "ltr" : "rtl"
  }

  return (
    <Button
      variant="ghost"
      onClick={toggleLanguage}
      className="h-10 px-4 hover:bg-accent/20 transition-colors font-medium"
    >
      {isArabic ? "EN" : "عر"}
    </Button>
  )
}
