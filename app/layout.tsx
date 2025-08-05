import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: {
    default: "Марк Литвак | Фотограф | Москва",
    template: "%s | Марк Литвак",
  },
  description:
    "Фотопортфолио Марка Литвака: концептуальная и стрит-фотография, чёрно-белые работы и визуальные эксперименты. Москва, Россия.",
  keywords: [
    "фотограф москва",
    "стрит фотография",
    "концептуальная фотография",
    "черно белая фотография",
    "городская фотография",
    "марк литвак",
    "little can",
    "фотопортфолио",
    "photographer moscow",
    "street photography",
    "conceptual photography",
    "urban photography",
  ],
  authors: [{ name: "Марк Литвак", url: "https://littlecan.vercel.app" }],
  creator: "Марк Литвак",
  publisher: "Little Can Photography",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://littlecan.vercel.app"),
  alternates: {
    canonical: "/",
    languages: {
      "ru-RU": "/"
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://littlecan.vercel.app",
    title: "Марк Литвак | Фотограф | Москва",
    description:
      "Фотопортфолио Марка Литвака: концептуальная и стрит-фотография, чёрно-белые работы и визуальные эксперименты.",
    siteName: "Little Can Photography",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Марк Литвак - Фотограф",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Марк Литвак | Фотограф | Москва",
    description:
      "Фотопортфолио Марка Литвака: концептуальная и стрит-фотография, чёрно-белые работы и визуальные эксперименты.",
    images: ["/og-image.jpg"],
    creator: "@canonlifeshots",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "Eh2v37pj2bqGPUtVZ0io70aubcGVoIxcddMTI9JN0ZQ",
    yandex: "1f0bec293ec639b0",
  },
    generator: 'NextJS'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: document.title,
                page_location: window.location.href,
              });
            `,
          }}
        />

        {/* Yandex.Metrica */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(YANDEX_COUNTER_ID, "init", {
                   clickmap:true,
                   trackLinks:true,
                   accurateTrackBounce:true,
                   webvisor:true
              });
            `,
          }}
        />
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/YANDEX_COUNTER_ID"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>

        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Марк Литвак",
              alternateName: "Mark Litvak",
              jobTitle: "Фотограф",
              description: "Концептуальная и стрит-фотография, чёрно-белые работы и визуальные эксперименты",
              url: "https://littlecan.vercel.app",
              image: "https://littlecan.vercel.app/gasmask.jpg",
              sameAs: ["https://t.me/canonlifeshots", "https://instagram.com/canonlifeshots"],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Москва",
                addressCountry: "RU",
              },
              email: "mark-litvak@mail.ru",
              knowsAbout: [
                "Стрит-фотография",
                "Концептуальная фотография",
                "Чёрно-белая фотография",
                "Городская фотография",
                "Архитектурная фотография",
              ],
              hasOccupation: {
                "@type": "Occupation",
                name: "Фотограф",
                occupationLocation: {
                  "@type": "City",
                  name: "Москва",
                },
              },
            }),
          }}
        />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://mc.yandex.ru" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Theme color */}
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
      </head>
      <body>
        <ThemeProvider defaultTheme="dark" storageKey="photographer-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
