"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Upload,
  Calendar,
  MapPin,
  User,
  FileText,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const eventCategories = [
  "مجالس العزاء",
  "محاضرات دينية",
  "قراءة الأدعية",
  "ندوات فقهية",
  "مناسبات دينية",
  "دروس تفسير",
  "أمسيات شعرية",
];

export default function AddEventPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    time: "",
    location: "",
    address: "",
    organizer: "",
    contact: "",
    speaker: "",
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_API_KEY!
      );

      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!)
        .upload(fileName, file);

      if (error) {
        console.error("Error uploading image:", error.message);
        toast.error("فشل في تحفيظ الصورة");
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!)
        .getPublicUrl(fileName);
        console.log(publicUrlData)

      if (publicUrlData?.publicUrl) {
        setSelectedImage(publicUrlData.publicUrl);
        toast.success("تم تحفيظ الصورة بنجاح");
      } else {
        toast.error("فشل الحصول على رابط الصورة");
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    (async () => {
      try {
        const payload = { ...formData, image: selectedImage };

        const res = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) {
          toast.error(data?.error || "خطأ في الخادم");
          return;
        }

        toast.success("تم نشر الفعالية بنجاح");
        // navigate to events list
        router.push("/events");
      } catch (err) {
        console.error(err);
        toast.error("حدث خطأ غير متوقع");
      }
    })();
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-amiri text-4xl md:text-5xl font-bold mb-2">
              إضافة فعالية جديدة
            </h1>
            <p className="font-tajawal text-gray-400">
              أنشئ فعالية دينية جديدة لمشاركتها مع المجتمع
            </p>
          </div>
          <Link href="/events">
            <Button
              variant="ghost"
              className="text-white hover:text-[#B81D24] hover:bg-gray-900/50"
            >
              <ArrowLeft className="w-4 h-4 ml-2" />
              إلغاء
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Image Upload Section */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-900/30 border-gray-800/30 sticky top-24">
                <CardHeader>
                  <CardTitle className="font-amiri text-xl flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-[#B81D24]" />
                    صورة الفعالية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="aspect-[3/4] relative border-2 border-dashed border-gray-700 rounded-lg overflow-hidden hover:border-[#B81D24]/50 transition-colors">
                      {selectedImage ? (
                        <Image
                          src={selectedImage || "/vercel.svg"}
                          alt="Event poster"
                          className="w-full h-full object-cover"
                          layout="fill"
                          objectFit="cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                          <Upload className="w-12 h-12 mb-4" />
                          <p className="font-tajawal text-sm text-center">
                            اضغط لرفع صورة الفعالية
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                    <p className="font-tajawal text-xs text-gray-500 text-center">
                      يُفضل استخدام صورة بنسبة 3:4 وحجم لا يزيد عن 5 ميجابايت
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="bg-gray-900/30 border-gray-800/30">
                <CardHeader>
                  <CardTitle className="font-amiri text-xl flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#B81D24]" />
                    المعلومات الأساسية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="title"
                      className="font-tajawal text-sm font-medium"
                    >
                      عنوان الفعالية *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="مثال: مجلس عزاء الإمام الحسين (ع)"
                      className="bg-[#0B0B0B] border-gray-700 focus:border-[#B81D24] font-tajawal"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="category"
                      className="font-tajawal text-sm font-medium"
                    >
                      نوع الفعالية *
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleInputChange("category", value)
                      }
                    >
                      <SelectTrigger className="bg-[#0B0B0B] border-gray-700 focus:border-[#B81D24] font-tajawal">
                        <SelectValue placeholder="اختر نوع الفعالية" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        {eventCategories.map((category) => (
                          <SelectItem
                            key={category}
                            value={category}
                            className="font-tajawal"
                          >
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="font-tajawal text-sm font-medium"
                    >
                      وصف الفعالية *
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="اكتب وصفاً مفصلاً عن الفعالية ومحتواها..."
                      className="bg-[#0B0B0B] border-gray-700 focus:border-[#B81D24] font-tajawal min-h-[120px] resize-none"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Date & Time */}
              <Card className="bg-gray-900/30 border-gray-800/30">
                <CardHeader>
                  <CardTitle className="font-amiri text-xl flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#B81D24]" />
                    التاريخ والوقت
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="date"
                        className="font-tajawal text-sm font-medium"
                      >
                        التاريخ *
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          handleInputChange("date", e.target.value)
                        }
                        className="bg-[#0B0B0B] border-gray-700 focus:border-[#B81D24] font-tajawal"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="time"
                        className="font-tajawal text-sm font-medium"
                      >
                        الوقت *
                      </Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) =>
                          handleInputChange("time", e.target.value)
                        }
                        className="bg-[#0B0B0B] border-gray-700 focus:border-[#B81D24] font-tajawal"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="bg-gray-900/30 border-gray-800/30">
                <CardHeader>
                  <CardTitle className="font-amiri text-xl flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#B81D24]" />
                    المكان
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="location"
                      className="font-tajawal text-sm font-medium"
                    >
                      اسم المكان *
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      placeholder="مثال: حسينية الإمام علي (ع)"
                      className="bg-[#0B0B0B] border-gray-700 focus:border-[#B81D24] font-tajawal"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="address"
                      className="font-tajawal text-sm font-medium"
                    >
                      العنوان التفصيلي *
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      placeholder="مثال: شارع الكاظمية، بغداد، العراق"
                      className="bg-[#0B0B0B] border-gray-700 focus:border-[#B81D24] font-tajawal"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Organizer Information */}
              <Card className="bg-gray-900/30 border-gray-800/30">
                <CardHeader>
                  <CardTitle className="font-amiri text-xl flex items-center gap-2">
                    <User className="w-5 h-5 text-[#B81D24]" />
                    معلومات المنظم
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="organizer"
                      className="font-tajawal text-sm font-medium"
                    >
                      الجهة المنظمة *
                    </Label>
                    <Input
                      id="organizer"
                      value={formData.organizer}
                      onChange={(e) =>
                        handleInputChange("organizer", e.target.value)
                      }
                      placeholder="مثال: مؤسسة الإمام الحسين (ع) الخيرية"
                      className="bg-[#0B0B0B] border-gray-700 focus:border-[#B81D24] font-tajawal"
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="speaker"
                        className="font-tajawal text-sm font-medium"
                      >
                        المتحدث/الخطيب
                      </Label>
                      <Input
                        id="speaker"
                        value={formData.speaker}
                        onChange={(e) =>
                          handleInputChange("speaker", e.target.value)
                        }
                        placeholder="مثال: الخطيب الحسيني محمد الكربلائي"
                        className="bg-[#0B0B0B] border-gray-700 focus:border-[#B81D24] font-tajawal"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="contact"
                        className="font-tajawal text-sm font-medium"
                      >
                        رقم التواصل *
                      </Label>
                      <Input
                        id="contact"
                        value={formData.contact}
                        onChange={(e) =>
                          handleInputChange("contact", e.target.value)
                        }
                        placeholder="مثال: +964 770 123 4567"
                        className="bg-[#0B0B0B] border-gray-700 focus:border-[#B81D24] font-tajawal"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-6">
                <Link href="/events">
                  <Button
                    variant="outline"
                    className="font-tajawal border-gray-700 text-gray-300 hover:bg-gray-900/50 bg-transparent"
                  >
                    إلغاء
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="bg-[#B81D24] hover:bg-[#B81D24]/90 text-white font-tajawal px-8"
                >
                  نشر الفعالية
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
