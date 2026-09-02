import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site } from "@/src/config/site";

export const metadata: Metadata = {
  title: site.seo.title,
  description: site.seo.description,
  alternates: site.canonical === "TODO_CLIENTE" ? undefined : { canonical: site.canonical },
  openGraph: { title: site.seo.title, description: site.seo.description, locale: site.locale, type: "website" },
  twitter: { card: "summary", title: site.seo.title, description: site.seo.description },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: "#24171D", colorScheme: "light" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: site.name,
    url: site.canonical,
    sameAs: [site.instagramUrl],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rua Fagundes Varela, 1633",
      addressLocality: "São José",
      addressRegion: "SC",
      postalCode: "88113-800",
      addressCountry: "BR",
    },
  };
  return <html lang="pt-BR"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} /></body></html>;
}
