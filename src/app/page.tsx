"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Plus, Calendar } from "lucide-react";
import { Navigation } from "@/components/navigation";

export default function HomePage() {
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
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <main className="relative min-h-screen flex items-center justify-center px-6">
        <Card className="max-w-4xl mx-auto text-center space-y-12 bg-transparent border-none shadow-none">
          {/* Arabic Quote - Main Centerpiece */}
          <div className="fade-in">
            <h1 className="font-amiri text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-foreground mb-6">
              أحيوا أمرنا رحم اللهُ مَنْ أحيى أمرنا
            </h1>
            <Badge
              variant="secondary"
              className="font-tajawal text-sm opacity-70"
            >
              منصة الفعاليات الدينية
            </Badge>
          </div>

          {/* Call to Action Buttons */}
          <div className="slide-up flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group"
            >
              <Calendar className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="font-tajawal">تصفّح الفعاليات</span>
              <ArrowLeft className="mr-2 h-5 w-5 rtl:rotate-180 group-hover:translate-x-1 transition-transform" />
            </Button>

            {isOrgOwner && (
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group bg-transparent"
              >
                <Plus className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-tajawal">أضف فعالية</span>
                <ArrowRight className="mr-2 h-5 w-5 rtl:rotate-180 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>

          {/* Subtle Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-muted-foreground/30 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </Card>

        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20 pointer-events-none"></div>
      </main>
    </div>
  );
}
