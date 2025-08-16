import type React from "react"
import type { Metadata } from "next"
import { Amiri, Tajawal } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-amiri",
})

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  variable: "--font-tajawal",
})

export const metadata: Metadata = {
  title: "منصة الفعاليات الشيعية | Shia Events Platform",
  description: "منصة لتنظيم وإدارة الفعاليات الدينية الشيعية | Platform for organizing Shia religious gatherings",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={`dark ${amiri.variable} ${tajawal.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-tajawal antialiased">{children}
        <Toaster />
      </body>
    </html>
  )
}
