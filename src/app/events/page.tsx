"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";

// Events will be loaded from the API
type LocationObj = {
  region?: string;
  mapsLink?: string;
  addressDetail?: string;
};

type ApiEvent = {
  id: string;
  title: string;
  date: string;
  time?: string;
  location: LocationObj | string | null;
  category: string;
  posterUrl?: string | null;
};

const categoryColors = {
  عزاء: "bg-[#B81D24]/10 text-[#B81D24] border-[#B81D24]/20",
  محاضرة: "bg-gray-800/50 text-gray-300 border-gray-700",
  دعاء: "bg-gray-800/50 text-gray-300 border-gray-700",
  ندوة: "bg-gray-800/50 text-gray-300 border-gray-700",
};

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch("/api/events?limit=50")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        // data.data contains events
        setEvents((data?.data ?? []) as ApiEvent[]);
      })
      .catch((e) => console.error(e))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const formatEventDate = (iso?: string) => {
    if (!iso) return "غير محدد";
    try {
      const dt = new Date(iso);
      return new Intl.DateTimeFormat("ar", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(dt);
    } catch {
      return iso;
    }
  };

  const formatEventTime = (iso?: string) => {
    if (!iso) return "";
    try {
      const dt = new Date(iso);
      return new Intl.DateTimeFormat("ar", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(dt);
    } catch {
      return "";
    }
  };

  const mapCategoryToArabic = (cat: string) => {
    const map: Record<string, string> = {
      LECTURE: "محاضرة",
      PRAYER: "دعاء",
      MOURNING: "عزاء",
      SEMINAR: "ندوة",
      PILGRIMAGE: "زيارة",
      CELEBRATION: "مناسبة",
    };
    return map[cat] ?? cat;
  };

  const filteredEvents = selectedCategory
    ? events.filter(
        (event) => mapCategoryToArabic(event.category) === selectedCategory
      )
    : events;

  const categories = Array.from(
    new Set(events.map((event) => mapCategoryToArabic(event.category)))
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-amiri text-4xl md:text-5xl font-bold mb-6 text-white">
            الفعاليات الدينية
          </h1>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className="font-tajawal bg-[#B81D24] hover:bg-[#B81D24]/80 border-[#B81D24] text-white"
          >
            الكل
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="font-tajawal bg-transparent hover:bg-[#B81D24]/20 border-gray-700 hover:border-[#B81D24] text-gray-300 hover:text-white"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <Card
              key={event.id}
              onClick={() => router.push(`/events/${event.id}`)}
              className="bg-card border-border/50 hover:border-[#B81D24]/30 transition-all duration-300 group cursor-pointer"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  {mapCategoryToArabic(event.category) !== "عزاء" && (
                    <Badge
                      variant="outline"
                      className={`font-tajawal text-xs ${
                        categoryColors[
                          mapCategoryToArabic(
                            event.category
                          ) as keyof typeof categoryColors
                        ]
                      }`}
                    >
                      {mapCategoryToArabic(event.category)}
                    </Badge>
                  )}
                </div>
                <CardTitle className="font-amiri text-xl text-white group-hover:text-[#B81D24] transition-colors leading-relaxed">
                  {event.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center text-gray-400 text-sm">
                  <Calendar className="w-4 h-4 ml-2 text-[#B81D24]" />
                  <span className="font-tajawal">
                    {formatEventDate(event.date)}
                  </span>
                  {formatEventTime(event.date) ? (
                    <span className="text-xs text-gray-400 mr-3">
                      {formatEventTime(event.date)}
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-col gap-1 text-gray-400 text-sm">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 ml-2 text-[#B81D24]" />
                    <span className="font-tajawal">
                      {typeof event.location === "string"
                        ? event.location
                        : event.location?.region ||
                          event.location?.addressDetail ||
                          "موقع غير محدد"}
                    </span>
                  </div>
                  {typeof event.location !== "string" &&
                  event.location?.mapsLink ? (
                    <a
                      href={event.location.mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#B81D24] underline"
                    >
                      خريطة الموقع
                    </a>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <p className="font-tajawal text-gray-500 text-lg">
              لا توجد فعاليات في هذه الفئة
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
