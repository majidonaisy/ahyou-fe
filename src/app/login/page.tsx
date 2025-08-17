"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) return alert(data.error);
        // Save token and user info to localStorage for now
        if (data.token) localStorage.setItem("token", data.token);
        if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
        toast("تم تسجيل الدخول بنجاح!", {
          style: {
            backgroundColor: "#000000ff",
            color: "#ffffffff",
          },
        });
        router.push("/events");
      })
      .catch((err) => console.error(err));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 text-foreground">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-amiri text-4xl font-bold text-foreground mb-2">
            أحيوا
          </h1>
        </div>

        <Card className="bg-card border-border">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="font-tajawal text-2xl text-foreground">
              تسجيل الدخول
            </CardTitle>
            <CardDescription className="font-tajawal text-gray-400">
              ادخل بياناتك للوصول إلى حسابك
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="font-tajawal text-white text-right block"
                >
                  البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 font-tajawal text-right"
                  placeholder="example@email.com"
                  required
                  dir="ltr"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="font-tajawal text-white text-right block"
                >
                  كلمة المرور
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 font-tajawal text-right pr-10"
                    placeholder="••••••••"
                    required
                    dir="ltr"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="font-tajawal text-sm text-[#B81D24] hover:text-red-400 transition-colors"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-[#B81D24] hover:bg-red-700 text-white font-tajawal text-lg py-6 transition-all duration-300 group"
              >
                <span>تسجيل الدخول</span>
                <ArrowRight className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>

            <div className="mt-6">
              <Separator className="bg-gray-800" />
              <div className="text-center mt-6">
                <p className="font-tajawal text-gray-400">
                  ليس لديك حساب؟{" "}
                  <Link
                    href="/signup"
                    className="text-[#B81D24] hover:text-red-400 transition-colors font-medium"
                  >
                    إنشاء حساب جديد
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="font-tajawal text-gray-500 text-sm">
            © 2024 أحيوا. جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </div>
  );
}
