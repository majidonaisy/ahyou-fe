"use client";

import { useState } from "react";
import { useEffect } from "react";
import { Menu } from "lucide-react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOrgOwner, setIsOrgOwner] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw);
        setIsOrgOwner(!!u.isOrganizationOwner || u.role === "organizer");
      }
    } catch {
      // ignore
    }
    // we only want to run this on mount to hydrate UI from localStorage
  }, []);

  const baseMenu = [{ ar: "الفعاليات", en: "Events", href: "/events" }];

  const menuItems = isOrgOwner
    ? [
        ...baseMenu.slice(0, 1),
        { ar: "أضف فعالية", en: "Add Event", href: "/events/add" },
        ...baseMenu.slice(1),
      ]
    : baseMenu;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="relative flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="font-semibold text-lg">أحيوا</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center space-x-6 rtl:space-x-reverse">
              {menuItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="justify-start text-right font-tajawal"
                  asChild
                >
                  <Link href={item.href}>{item.ar}</Link>
                </Button>
              ))}
            </div>

            {/* Theme toggle on far left for desktop */}
            <div className="hidden md:flex absolute left-6 items-center">
              <ThemeToggle />
            </div>
            {/* Mobile Menu */}
            <div className="md:hidden flex items-center space-x-2 rtl:space-x-reverse">
              <ThemeToggle />
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
                      <Button
                        key={index}
                        variant="ghost"
                        className="justify-start text-right font-tajawal"
                        asChild
                      >
                        <a
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                        >
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
      {isOrgOwner && (
        <Link
          href="/events/add"
          className="fixed bottom-6 left-6 md:left-auto md:right-6 z-50 bg-[#B81D24] text-white rounded-full p-4 shadow-lg hover:bg-red-600 transition-colors"
          aria-label="Create event"
        >
          <Plus className="h-5 w-5" />
        </Link>
      )}
    </>
  );
}
