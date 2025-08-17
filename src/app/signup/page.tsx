"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, User, Building2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function SignupPage() {
  const [accountType, setAccountType] = useState<"user" | "organization">(
    "user"
  );
  interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    organizationName: string;
    organizationDescription: string;
    location: {
      region: string;
      addressDetail: string;
      mapsLink: string;
    };
  }

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    organizationName: "",
    organizationDescription: "",
    location: {
      region: "",
      addressDetail: "",
      mapsLink: "",
    },
  });

  const handleInputChange = (field: string, value: string) => {
    // handle location.* fields explicitly to keep types safe
    if (field.startsWith("location.")) {
      const [, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [child]: value,
        } as FormData["location"],
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: value } as unknown as FormData));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountType, ...formData }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) return alert(data.error);
        toast("تم انشاء الحساب بنجاح", {
          style: {
            backgroundColor: "#000000ff",
            color: "#ffffffff",
          },
        });
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <span className="font-tajawal font-medium text-lg">أحيوا</span>
            </Link>
            <Link
              href="/login"
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              لديك حساب؟ سجل دخول
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-amiri font-bold mb-2 text-foreground">
              إنشاء حساب جديد
            </h1>
            <p className="text-muted-foreground font-tajawal">
              انضم إلى منصة الفعاليات الدينية
            </p>
          </div>

          <Card className="bg-card border-border">
            <CardHeader className="space-y-6">
              <div>
                <CardTitle className="text-xl font-amiri text-center mb-2 text-foreground">
                  نوع الحساب
                </CardTitle>
                <CardDescription className="text-center text-muted-foreground font-tajawal">
                  اختر نوع الحساب المناسب لك
                </CardDescription>
              </div>

              <RadioGroup
                value={accountType}
                onValueChange={(value) =>
                  setAccountType(value as "user" | "organization")
                }
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem
                    value="user"
                    id="user"
                    className="border-white/20"
                  />
                  <Label
                    htmlFor="user"
                    className="flex items-center gap-2 cursor-pointer font-tajawal p-3 rounded-lg border border-white/10 hover:border-[#B81D24]/50 transition-colors flex-1"
                  >
                    <User className="w-4 h-4" />
                    مستخدم عادي
                  </Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem
                    value="organization"
                    id="organization"
                    className="border-white/20"
                  />
                  <Label
                    htmlFor="organization"
                    className="flex items-center gap-2 cursor-pointer font-tajawal p-3 rounded-lg border border-white/10 hover:border-[#B81D24]/50 transition-colors flex-1"
                  >
                    <Building2 className="w-4 h-4" />
                    منظمة
                  </Label>
                </div>
              </RadioGroup>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="font-amiri font-semibold text-lg">
                    المعلومات الأساسية
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-tajawal">
                      {accountType === "user" ? "الاسم الكامل" : "اسم المسؤول"}
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground font-tajawal"
                      placeholder={
                        accountType === "user"
                          ? "أدخل اسمك الكامل"
                          : "أدخل اسم المسؤول"
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-tajawal">
                      البريد الإلكتروني
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground font-tajawal"
                      placeholder="example@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-tajawal">
                      رقم الهاتف
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground font-tajawal"
                      placeholder="+966 50 123 4567"
                      required
                    />
                  </div>
                </div>

                {/* Organization Information */}
                {accountType === "organization" && (
                  <>
                    <Separator className="bg-white/10" />
                    <div className="space-y-4">
                      <h3 className="font-amiri font-semibold text-lg">
                        معلومات المنظمة
                      </h3>

                      <div className="space-y-2">
                        <Label
                          htmlFor="organizationName"
                          className="font-tajawal"
                        >
                          اسم المنظمة
                        </Label>
                        <Input
                          id="organizationName"
                          type="text"
                          value={formData.organizationName}
                          onChange={(e) =>
                            handleInputChange(
                              "organizationName",
                              e.target.value
                            )
                          }
                          className="bg-input border-border text-foreground placeholder:text-muted-foreground font-tajawal"
                          placeholder="أدخل اسم المنظمة"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="organizationDescription"
                          className="font-tajawal"
                        >
                          وصف المنظمة
                        </Label>
                        <Textarea
                          id="organizationDescription"
                          value={formData.organizationDescription}
                          onChange={(e) =>
                            handleInputChange(
                              "organizationDescription",
                              e.target.value
                            )
                          }
                          className="bg-input border-border text-foreground placeholder:text-muted-foreground font-tajawal min-h-[100px]"
                          placeholder="اكتب وصفاً مختصراً عن المنظمة وأنشطتها"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="region" className="font-tajawal">
                          منطقة
                        </Label>
                        <Input
                          id="region"
                          type="text"
                          value={formData.location.region}
                          onChange={(e) =>
                            handleInputChange("location.region", e.target.value)
                          }
                          className="bg-input border-border text-foreground placeholder:text-muted-foreground font-tajawal"
                          placeholder="مثال: بغداد - الكاظمية"
                          required
                        />

                        <Label htmlFor="addressDetail" className="font-tajawal">
                          عنوان تفصيلي
                        </Label>
                        <Input
                          id="addressDetail"
                          type="text"
                          value={formData.location.addressDetail}
                          onChange={(e) =>
                            handleInputChange(
                              "location.addressDetail",
                              e.target.value
                            )
                          }
                          className="bg-input border-border text-foreground placeholder:text-muted-foreground font-tajawal"
                          placeholder="مثال: شارع الكاظمية، قرب الحسينية"
                          required
                        />

                        <Label htmlFor="mapsLink" className="font-tajawal">
                          رابط (Google Maps)
                        </Label>
                        <Input
                          id="mapsLink"
                          type="url"
                          value={formData.location.mapsLink}
                          onChange={(e) =>
                            handleInputChange(
                              "location.mapsLink",
                              e.target.value
                            )
                          }
                          className="bg-[#0B0B0B] border-white/20 text-white placeholder:text-white/50 font-tajawal"
                          placeholder="https://maps.google.com/..."
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Password Section */}
                <Separator className="bg-white/10" />
                <div className="space-y-4">
                  <h3 className="font-amiri font-semibold text-lg">
                    كلمة المرور
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-tajawal">
                      كلمة المرور
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground font-tajawal"
                      placeholder="أدخل كلمة مرور قوية"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="font-tajawal">
                      تأكيد كلمة المرور
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground font-tajawal"
                      placeholder="أعد إدخال كلمة المرور"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-accent hover:bg-accent/90 text-white font-tajawal font-medium py-6 text-lg group"
                >
                  إنشاء الحساب
                  <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <p className="text-white/70 font-tajawal text-sm">
              بإنشاء حساب، أنت توافق على{" "}
              <Link href="/terms" className="text-[#B81D24] hover:underline">
                شروط الاستخدام
              </Link>{" "}
              و{" "}
              <Link href="/privacy" className="text-[#B81D24] hover:underline">
                سياسة الخصوصية
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
