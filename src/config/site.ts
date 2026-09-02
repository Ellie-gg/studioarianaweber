export const TODO_CLIENTE = "TODO_CLIENTE";

export const site = {
  name: "Studio Ariana Weber Estética",
  shortName: "Ariana Weber",
  instagram: "@studioarianaweber.estetica",
  instagramUrl: "https://www.instagram.com/studioarianaweber.estetica/",
  locale: "pt-BR",
  country: "BR",
  currency: "BRL",
  canonical: "https://studio-ariana-weber-estetica.eliel-garcia910176.chatgpt.site",
  whatsappNumber: TODO_CLIENTE,
  instagramDirectUrl: "https://ig.me/m/studioarianaweber.estetica",
  address: "Rua Fagundes Varela, 1633 — Areias, São José — SC, 88113-800",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Rua%20Fagundes%20Varela%2C%201633%2C%20Areias%2C%20S%C3%A3o%20Jos%C3%A9%20SC",
  locationName: "WF Concept Paris",
  hours: TODO_CLIENTE,
  seo: {
    title: "Studio Ariana Weber Estética | Cuidado que realça",
    description:
      "Protocolos faciais e corporais pensados para valorizar o que já é seu, com cuidado e atendimento personalizado.",
  },
  messages: {
    default:
      "Olá, Ariana! Vim pelo site e gostaria de conhecer os tratamentos disponíveis.",
    service: (name: string) =>
      `Olá, Ariana! Vim pelo site e gostaria de saber mais sobre ${name}.`,
  },
  features: { testimonials: false, faq: false, results: false },
} as const;

export function whatsappLink(message: string) {
  if (site.whatsappNumber === TODO_CLIENTE) return site.instagramDirectUrl;
  return `https://wa.me/${site.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
