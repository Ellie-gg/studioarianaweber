export const TODO_CLIENTE = "TODO_CLIENTE";

export const site = {
  name: "Studio Ariana Weber Estética",
  shortName: "Ariana Weber",
  instagram: "@studioarianaweber.estetica",
  instagramUrl: "https://www.instagram.com/studioarianaweber.estetica/",
  locale: "pt-BR",
  country: "BR",
  currency: "BRL",
  canonical: TODO_CLIENTE,
  whatsappNumber: TODO_CLIENTE,
  address: TODO_CLIENTE,
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
  if (site.whatsappNumber === TODO_CLIENTE) return "#contato";
  return `https://wa.me/${site.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
