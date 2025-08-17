"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Share2,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
// import router not needed here

type LocationObj = {
  region?: string;
  addressDetail?: string;
  mapsLink?: string;
};
type EventDetail = {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  location: LocationObj | string;
  category: string;
  speaker?: string;
  speakers?: string[] | string | null;
  posterUrl?: string | null;
  Organization?: { id: number; name: string } | null;
  contact?: string | null;
  features?: string[];
};

export default function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [eventData, setEventData] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch(`/api/events/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setEventData(data.event);
      })
      .catch((e) => console.error(e))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [params.id]);

  const handleShare = async () => {
    if (navigator.share && eventData) {
      await navigator.share({
        title: eventData.title,
        text: eventData.description,
        url: window.location.href,
      });
    }
  };

  if (loading) return <div className="min-h-screen" />;

  if (!eventData)
    return (
      <div className="min-h-screen text-foreground flex items-center justify-center">
        حدث خطأ أو لم يتم العثور على الفعالية
      </div>
    );

  // normalize speakers from the returned event object
  const speakersList: string[] = (() => {
    const s = eventData.speakers;
    if (!s) return [];
    if (Array.isArray(s)) return s as string[];
    if (typeof s === "string") {
      try {
        const parsed = JSON.parse(s);
        return Array.isArray(parsed) ? parsed : [String(s)];
      } catch {
        return [s as string];
      }
    }
    return [];
  })();

  // format the event date/time (use date property which is ISO string)
  let formattedDate = "";
  let formattedTime = "";
  try {
    const dt = new Date(eventData.date);
    // full localized date e.g. 'الثلاثاء، 17 يوليو 2024'
    formattedDate = new Intl.DateTimeFormat("ar", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(dt);

    // time in HH:mm (24h) localized
    formattedTime = new Intl.DateTimeFormat("ar", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(dt);
  } catch {
    // fallbacks
    formattedDate = String(eventData.date ?? "");
    formattedTime = String(eventData.time ?? "");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/events">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:text-accent hover:bg-card/90"
              >
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة للفعاليات
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className={`hover:bg-card/90 ${
                  isLiked ? "text-[#B81D24]" : "text-foreground"
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-foreground hover:text-accent hover:bg-card/90"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Event Poster - Prominent placement */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border overflow-hidden sticky top-24">
              <div className="aspect-[3/4] relative">
                {eventData.posterUrl ? (
                  <>
                    <img
                      src={eventData.posterUrl}
                      alt={eventData.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </>
                ) : (
                  <div className="w-full h-full rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
                    لا توجد صورة للفعالية
                  </div>
                )}
                {!(
                  eventData.category === "MOURNING" ||
                  eventData.category === "عزاء"
                ) && (
                  <Badge className="absolute top-4 right-4 bg-[#B81D24] hover:bg-[#B81D24]/90 text-white border-none">
                    {eventData.category}
                  </Badge>
                )}
              </div>
            </Card>
          </div>

          {/* Event Details */}
          <div className="lg:col-span-3 space-y-6">
            {/* Title Section */}
            <div className="space-y-3">
              <h1 className="font-amiri text-4xl md:text-5xl font-bold leading-tight">
                {eventData.title}
              </h1>
            </div>

            {/* Key Info Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-card border-border p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#B81D24]" />
                  <div className="font-tajawal">
                    <p className="text-sm text-foreground/70">التاريخ</p>
                    <p className="font-medium">{formattedDate || "غير محدد"}</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-card border-border p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#B81D24]" />
                  <div className="font-tajawal">
                    <p className="text-sm text-foreground/70">الوقت</p>
                    <p className="font-medium">
                      {formattedTime || eventData.time || "غير محدد"}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-card border-border p-4 md:col-span-2">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#B81D24]" />
                  <div className="font-tajawal">
                    <p className="text-sm text-foreground/70">المكان</p>
                    <p className="font-medium">
                      {typeof eventData.location === "string"
                        ? eventData.location
                        : eventData.location?.region ||
                          eventData.location?.addressDetail ||
                          "موقع غير محدد"}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="font-amiri text-2xl font-bold">وصف الفعالية</h2>
              <p className="font-tajawal text-foreground/80 leading-relaxed text-lg">
                {eventData.description}
              </p>
            </div>

            <Separator className="bg-border/50" />

            {/* Location Info (separate from organizer) */}
            <div className="space-y-4">
              <h2 className="font-amiri text-2xl font-bold">معلومات المكان</h2>
              <Card className="bg-card border-border p-4">
                <div className="font-tajawal space-y-2">
                  <p className="font-medium text-lg">
                    {typeof eventData.location === "string"
                      ? eventData.location
                      : eventData.location?.region ?? "موقع غير محدد"}
                  </p>

                  {typeof eventData.location !== "string" && (
                    <>
                      <p className="text-foreground/70">
                        {eventData.location?.addressDetail ??
                          "تفاصيل العنوان غير متوفرة"}
                      </p>

                      {eventData.location?.mapsLink && (
                        <a
                          href={eventData.location.mapsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#B81D24] hover:underline"
                        >
                          فتح الخريطة
                        </a>
                      )}
                    </>
                  )}
                </div>
              </Card>
            </div>

            {/* Organizer Info */}
            <div className="space-y-4">
              <h2 className="font-amiri text-2xl font-bold">الجهة المنظمة</h2>
              <Card className="bg-card border-border p-4">
                <div className="font-tajawal space-y-2">
                  <p className="font-medium text-lg">
                    {eventData.Organization?.name ?? "جهة منظمة"}
                  </p>
                  {eventData.contact ? (
                    <p className="text-foreground/70">
                      للاستفسار: {eventData.contact ?? "غير متوفر"}
                    </p>
                  ) : null}
                </div>
              </Card>
            </div>

            {/* Speakers / الحضور (if any) */}
            {speakersList.length > 0 && (
              <div className="space-y-4">
                <h2 className="font-amiri text-2xl font-bold">قائمة الحضور</h2>
                <Card className="bg-card border-border p-4">
                  <div className="grid sm:grid-cols-2 gap-3 font-tajawal">
                    {speakersList.map((s, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-[#B81D24] rounded-full" />
                        <span className="text-foreground">{s}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
