import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site } from "@/src/config/site";

export const metadata: Metadata = {
  title: site.seo.title,
  description: site.seo.description,
  alternates: site.canonical === "TODO_CLIENTE" ? undefined : { canonical: site.canonical },
  openGraph: { title: site.seo.title, description: site.seo.description, locale: site.locale, type: "website" },
  twitter: { card: "summary", title: site.seo.title, description: site.seo.description },
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: "#24171D", colorScheme: "light" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
