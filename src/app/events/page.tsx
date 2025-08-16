"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin } from "lucide-react"

// Mock event data - in a real app this would come from an API
const mockEvents = [
  {
    id: 1,
    title: "مجلس عزاء الإمام الحسين (ع)",
    date: "2024-08-15",
    location: "الحسينية الكبرى - بغداد",
    category: "عزاء",
  },
  {
    id: 2,
    title: "محاضرة في سيرة أهل البيت (ع)",
    date: "2024-08-18",
    location: "مسجد الإمام علي - النجف",
    category: "محاضرة",
  },
  {
    id: 3,
    title: "قراءة دعاء كميل",
    date: "2024-08-20",
    location: "مسجد الكوفة - الكوفة",
    category: "دعاء",
  },
  {
    id: 4,
    title: "ندوة فقهية",
    date: "2024-08-22",
    location: "الحوزة العلمية - قم",
    category: "ندوة",
  },
]

const categoryColors = {
  عزاء: "bg-[#B81D24]/10 text-[#B81D24] border-[#B81D24]/20",
  محاضرة: "bg-gray-800/50 text-gray-300 border-gray-700",
  دعاء: "bg-gray-800/50 text-gray-300 border-gray-700",
  ندوة: "bg-gray-800/50 text-gray-300 border-gray-700",
}

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredEvents = selectedCategory
    ? mockEvents.filter((event) => event.category === selectedCategory)
    : mockEvents

  const categories = Array.from(new Set(mockEvents.map((event) => event.category)))

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-amiri text-4xl md:text-5xl font-bold mb-6 text-white">الفعاليات الدينية</h1>
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
              className="bg-[#0B0B0B] border-gray-800/50 hover:border-[#B81D24]/30 transition-all duration-300 group cursor-pointer"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <Badge
                    variant="outline"
                    className={`font-tajawal text-xs ${categoryColors[event.category as keyof typeof categoryColors]}`}
                  >
                    {event.category}
                  </Badge>
                </div>
                <CardTitle className="font-amiri text-xl text-white group-hover:text-[#B81D24] transition-colors leading-relaxed">
                  {event.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center text-gray-400 text-sm">
                  <Calendar className="w-4 h-4 ml-2 text-[#B81D24]" />
                  <span className="font-tajawal">{event.date}</span>
                </div>

                <div className="flex items-center text-gray-400 text-sm">
                  <MapPin className="w-4 h-4 ml-2 text-[#B81D24]" />
                  <span className="font-tajawal">{event.location}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <p className="font-tajawal text-gray-500 text-lg">لا توجد فعاليات في هذه الفئة</p>
          </div>
        )}
      </main>
    </div>
  )
}
