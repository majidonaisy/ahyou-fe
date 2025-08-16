"use client"

import { useState } from "react"
import { ArrowLeft, Calendar, MapPin, Clock, Share2, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

// Mock event data - in real app this would come from API/database
const eventData = {
  id: "1",
  title: "مجلس عزاء الإمام الحسين (ع)",
  description:
    "مجلس عزاء مبارك في ذكرى استشهاد سيد الشهداء الإمام الحسين عليه السلام، يتضمن قراءة المقتل الشريف وأشعار الرثاء والمواعظ الحسينية.",
  date: "2024-07-17",
  time: "20:00",
  location: "حسينية الإمام علي (ع)",
  address: "شارع الكاظمية، بغداد، العراق",
  speaker: "الخطيب الحسيني محمد الكربلائي",
  category: "مجالس العزاء",
  attendees: 450,
  maxCapacity: 500,
  poster: "/image.jpg",
  organizer: "مؤسسة الإمام الحسين (ع) الخيرية",
  contact: "+964 770 123 4567",
  features: ["قراءة المقتل الشريف", "أشعار الرثاء الحسيني", "مواعظ وإرشادات دينية", "دعاء ختام المجلس"]
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const [isLiked, setIsLiked] = useState(false)

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: eventData.title,
        text: eventData.description,
        url: window.location.href,
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      {/* Header */}
      <div className="border-b border-gray-800/50 bg-[#0B0B0B]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/events">
              <Button variant="ghost" size="sm" className="text-white hover:text-[#B81D24] hover:bg-gray-900/50">
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة للفعاليات
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className={`hover:bg-gray-900/50 ${isLiked ? "text-[#B81D24]" : "text-white"}`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-white hover:text-[#B81D24] hover:bg-gray-900/50"
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
            <Card className="bg-transparent border-gray-800/30 overflow-hidden sticky top-24">
              <div className="aspect-[3/4] relative">
                <img
                  src={eventData.poster || "/placeholder.svg"}
                  alt={eventData.title}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <Badge className="absolute top-4 right-4 bg-[#B81D24] hover:bg-[#B81D24]/90 text-white border-none">
                  {eventData.category}
                </Badge>
              </div>
            </Card>
          </div>

          {/* Event Details */}
          <div className="lg:col-span-3 space-y-6">
            {/* Title Section */}
            <div className="space-y-3">
              <h1 className="font-amiri text-4xl md:text-5xl font-bold leading-tight">{eventData.title}</h1>
            </div>

            {/* Key Info Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-gray-900/30 border-gray-800/30 p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#B81D24]" />
                  <div className="font-tajawal">
                    <p className="text-sm text-gray-400">التاريخ</p>
                    <p className="font-medium">الثلاثاء، 17 يوليو 2024</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-900/30 border-gray-800/30 p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#B81D24]" />
                  <div className="font-tajawal">
                    <p className="text-sm text-gray-400">الوقت</p>
                    <p className="font-medium">{eventData.time}</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-900/30 border-gray-800/30 p-4 md:col-span-2">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#B81D24]" />
                  <div className="font-tajawal">
                    <p className="text-sm text-gray-400">المكان</p>
                    <p className="font-medium">{eventData.location}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="font-amiri text-2xl font-bold">وصف الفعالية</h2>
              <p className="font-tajawal text-gray-300 leading-relaxed text-lg">{eventData.description}</p>
            </div>

            <Separator className="bg-gray-800/50" />

            {/* Organizer Info */}
            <div className="space-y-4">
              <h2 className="font-amiri text-2xl font-bold">الجهة المنظمة</h2>
              <Card className="bg-gray-900/30 border-gray-800/30 p-4">
                <div className="font-tajawal space-y-2">
                  <p className="font-medium text-lg">{eventData.organizer}</p>
                  <p className="text-gray-400">{eventData.address}</p>
                  <p className="text-gray-400">للاستفسار: {eventData.contact}</p>
                </div>
              </Card>
            </div>

            {/* Event Features */}
            <div className="space-y-4">
              <h2 className="font-amiri text-2xl font-bold">محتوى المجلس</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {eventData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 font-tajawal">
                    <div className="w-2 h-2 bg-[#B81D24] rounded-full" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
