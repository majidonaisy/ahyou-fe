"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "./theme-toggle"
import { LanguageToggle } from "./language-toggle"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuItems = [
    { ar: "الفعاليات", en: "Events", href: "/events" },
    { ar: "أضف فعالية", en: "Add Event", href: "/add-event" },
    { ar: "من نحن", en: "About", href: "/about" },
    { ar: "اتصل بنا", en: "Contact", href: "/contact" },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="font-semibold text-lg">أحيوا</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
            <ThemeToggle />
            <LanguageToggle />
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2 rtl:space-x-reverse">
            <ThemeToggle />
            <LanguageToggle />
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-6">
                  <div className="px-2">
                    <h2 className="text-lg font-semibold mb-2">أحيوا</h2>
                    <Separator />
                  </div>
                  {menuItems.map((item, index) => (
                    <Button key={index} variant="ghost" className="justify-start text-right font-tajawal" asChild>
                      <a href={item.href} onClick={() => setIsMenuOpen(false)}>
                        {item.ar}
                      </a>
                    </Button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
