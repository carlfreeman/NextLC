"use client"

// Google Analytics
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "GA_MEASUREMENT_ID"

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    ym: (...args: any[]) => void
  }
}

// Google Analytics Events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Yandex Metrica Events
export const trackYandexEvent = (target: string, params?: Record<string, any>) => {
  if (typeof window !== "undefined" && window.ym) {
    window.ym(process.env.NEXT_PUBLIC_YANDEX_ID || "YANDEX_COUNTER_ID", "reachGoal", target, params)
  }
}

// Combined tracking function
export const trackPhotoView = (photoId: string, photoTitle: string) => {
  trackEvent("view_photo", "engagement", photoTitle)
  trackYandexEvent("photo_view", { photo_id: photoId, photo_title: photoTitle })
}

export const trackSectionChange = (section: string) => {
  trackEvent("section_change", "navigation", section)
  trackYandexEvent("section_change", { section })
}

export const trackFilterUse = (filterType: "category" | "season", filterValue: string) => {
  trackEvent("use_filter", "portfolio", `${filterType}:${filterValue}`)
  trackYandexEvent("filter_use", { filter_type: filterType, filter_value: filterValue })
}

export const trackContactClick = (contactType: "email" | "telegram") => {
  trackEvent("contact_click", "engagement", contactType)
  trackYandexEvent("contact_click", { contact_type: contactType })
}
