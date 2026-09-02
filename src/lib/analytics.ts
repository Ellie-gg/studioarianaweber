export function track(event: "whatsapp_click" | "service_view" | "before_after_interaction", data?: Record<string, string>) {
  // Adapter intentionally inactive until an analytics provider is configured.
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true") {
    window.dispatchEvent(new CustomEvent("studio-analytics", { detail: { event, data } }));
  }
}
