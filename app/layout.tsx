import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/AuthProvider"
import { ThemeProvider } from "@/components/ThemeProvider"
import HeaderDropdown from "@/components/Header"
import DashboardLayout from "@/components/DashboardLayout"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Candy Blossom",
  description:
    "I will take care of your plants, and make them bloom like candy",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--bg)] text-[var(--text)]">
        <ThemeProvider>
          <AuthProvider>
            <HeaderDropdown />
            <div className="mt-16">
              <DashboardLayout>
                {children}
              </DashboardLayout>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}