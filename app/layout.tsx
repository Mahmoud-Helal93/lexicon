import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans, Noto_Naskh_Arabic } from "next/font/google"
import "./globals.css"
import { StoreProvider } from "@/lib/store"
import { SiteNav } from "@/components/site-nav"

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const arabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
})

export const metadata: Metadata = {
  title: "GRE Vocabulary — Study & Practice",
  description:
    "Memorize GRE vocabulary fast with flashcards, simple spaced repetition, and interactive definition & Arabic translation practice.",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#1b1b2b" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sans.variable} ${arabic.variable} font-sans antialiased`}>
        <StoreProvider>
          <div className="flex min-h-dvh flex-col">
            <SiteNav />
            <main className="flex-1">{children}</main>
          </div>
        </StoreProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
