"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { services, type Service } from "@/src/content/services";
import { site, TODO_CLIENTE, whatsappLink } from "@/src/config/site";
import { track } from "@/src/lib/analytics";
import { SilkCanvas } from "@/src/components/effects/SilkCanvas";
import { BeforeAfter } from "@/src/components/BeforeAfter";

const wa = (message: string) => whatsappLink(message);
const contactLabel = site.whatsappNumber === TODO_CLIENTE ? "Agendar pelo Instagram" : "Agendar pelo WhatsApp";
const categories = ["Todos", "Rosto", "Corpo", "Sobrancelhas e olhar", "Bem-estar"] as const;
export default function SiteClient() {
  const [menu, setMenu] = useState(false), [solid, setSolid] = useState(false), [selected, setSelected] = useState<Service | null>(null), [activeService, setActiveService] = useState(0), [category, setCategory] = useState<(typeof categories)[number]>("Todos"), [progress, setProgress] = useState(0);
  const servicesRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const filtered = category === "Todos" ? services : services.filter((s) => s.category === category);
  useEffect(() => { const f = () => { setSolid(scrollY > 30); const max = document.documentElement.scrollHeight - innerHeight; setProgress(max > 0 ? Math.min(1, scrollY / max) : 0); }; f(); addEventListener("scroll", f, { passive: true }); return () => removeEventListener("scroll", f); }, []);
  const pickCategory = (c: (typeof categories)[number]) => { setCategory(c); setActiveService(0); servicesRef.current?.scrollTo({ left: 0 }); };
  useEffect(() => { if (!selected) return; const key = (e: KeyboardEvent) => { if (e.key === "Escape") setSelected(null); }; const away = (e: MouseEvent) => { if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) setSelected(null); }; addEventListener("keydown", key); addEventListener("mousedown", away); return () => { removeEventListener("keydown", key); removeEventListener("mousedown", away); }; }, [selected]);
  const syncActiveService = () => {
    const scroller = servicesRef.current;
    if (!scroller) return;
    const center = scroller.scrollLeft + scroller.clientWidth / 2;
    const cards = Array.from(scroller.children) as HTMLElement[];
    let nearest = 0, distance = Number.POSITIVE_INFINITY;
    cards.forEach((card, index) => {
      const nextDistance = Math.abs(card.offsetLeft + card.clientWidth / 2 - center);
      if (nextDistance < distance) { nearest = index; distance = nextDistance; }
    });
    if (nearest !== activeService) setActiveService(nearest);
  };
  const cta = (message: string, label: string) => ({ href: wa(message), onClick: () => track("whatsapp_click", { label }) });
  return <>
    <div className="progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>
    <header className={solid ? "header header-solid" : "header"}><a className="brand" href="#inicio"><em>Studio</em> Ariana Weber</a><button className="menu-button" aria-expanded={menu} aria-controls="menu" onClick={() => setMenu(!menu)}>Menu</button><nav id="menu" className={menu ? "nav nav-open" : "nav"}><a href="#tratamentos" onClick={() => setMenu(false)}>Tratamentos</a>{site.features.results && <a href="#resultados" onClick={() => setMenu(false)}>Resultados</a>}<a href="#sobre" onClick={() => setMenu(false)}>Sobre</a><a href="#contato" onClick={() => setMenu(false)}>Contato</a><a className="button button-small" {...cta(site.messages.default, "header")}>Agendar</a></nav></header>
    <main>
      <section className="hero" id="inicio"><div className="silk-fallback" /><SilkCanvas /><div className="hero-content"><p className="eyebrow">Estética com presença e escuta</p><h1>Realçar não é mudar.<br /><i>É revelar.</i></h1><p className="hero-copy">Protocolos faciais e corporais pensados para valorizar o que já é seu, com cuidado, técnica e atendimento personalizado.</p><div className="hero-proof"><span>Atendimento personalizado</span><span>✦</span><span>Areias, São José — SC</span><span>✦</span><span>{site.locationName}</span></div><div className="hero-actions"><a className="button" {...cta(site.messages.default, "hero")}>{contactLabel} <span>↗</span></a><a className="text-link" href="#tratamentos">Conhecer os tratamentos <span>↓</span></a></div></div><div className="portrait"><Image src="/images/ariana-hero.webp" alt="Ariana Weber em seu espaço de estética em São José" fill priority sizes="(max-width: 800px) 190px, 360px" /></div><p className="scroll-cue">deslize para sentir</p></section>
      <section className="trust"><p>Atendimento personalizado</p><span>✦</span><p>Protocolos faciais e corporais</p><span>✦</span><p>Areias, São José — SC</p></section>
      <section className="section services" id="tratamentos"><p className="eyebrow">Seu momento, seu ritmo</p><h2>Tratamentos que começam <i>com escuta.</i></h2><p className="intro">Cada escolha é um convite para cuidar de você com presença. Filtre pelo que você busca hoje e encontre o seu próximo ritual.</p><div className="filter-chips" role="group" aria-label="Filtrar tratamentos por categoria">{categories.map((c) => <button key={c} type="button" aria-pressed={category === c} className={category === c ? "chip chip-active" : "chip"} onClick={() => { pickCategory(c); track("service_view", { service: `filter_${c}` }); }}>{c}</button>)}</div><div className="service-mobile-nav" aria-hidden="true"><span>{filtered.length > 0 ? String(activeService + 1).padStart(2, "0") : "00"} / {String(filtered.length).padStart(2, "0")}</span><span>Deslize para descobrir&nbsp; →</span></div><div className="service-stack" ref={servicesRef} onScroll={syncActiveService}>{filtered.map((service, index) => <article className={`service-card${activeService === index ? " service-card-active" : ""}`} data-number={String(index + 1).padStart(2, "0")} key={service.name} style={{ top: `${100 + index * 18}px` }}><p className="card-number">{String(index + 1).padStart(2, "0")} — {service.category}</p><h3>{service.name}</h3><p>{service.description}</p><div className="card-actions"><button onClick={() => { setSelected(service); track("service_view", { service: service.name }); }}>Descobrir o ritual <span>↗</span></button><a {...cta(site.messages.service(service.name), `service_book_${service.name}`)}>Agendar <span>↗</span></a></div></article>)}</div></section>
      {site.features.results && <section className="section results" id="resultados"><p className="eyebrow">Resultados reais, quando compartilhados</p><h2>Cada corpo tem sua própria <i>história.</i></h2><div className="results-grid"><BeforeAfter /><div><p className="result-lead">Resultados compartilhados com autorização.</p><p className="muted">Resultados variam entre pessoas. Uma conversa atenta é sempre o primeiro passo.</p></div></div></section>}
      <section className="section about" id="sobre"><div className="about-image"><Image src="/images/ariana-about.webp" alt="Ariana Weber usando jaleco em seu espaço de atendimento" fill sizes="(max-width: 800px) 88vw, 38vw" /></div><div><p className="eyebrow">Sobre Ariana</p><h2>Cuidar é revelar aquilo que já <i>é seu.</i></h2><p>Ariana acredita em uma estética que acolhe, observa e respeita. Aqui, cada atendimento é construído para que você se sinta vista — sem excessos, sem fórmulas prontas.</p><p className="muted">Atendimento personalizado em Areias, São José, no espaço {site.locationName}.</p></div></section>
      <section className="contact" id="contato"><p className="eyebrow">Seu tempo de se escolher</p><h2>Vamos conversar sobre o seu <i>cuidado?</i></h2><p>Conte o que você está buscando. Ariana te orienta para encontrar o melhor caminho para o seu momento.</p><a className="button button-light" {...cta(site.messages.default, "final")}>{contactLabel} <span>↗</span></a><div className="contact-meta"><a href={site.instagramUrl} target="_blank" rel="noreferrer">{site.instagram}</a><a href={site.mapsUrl} target="_blank" rel="noreferrer">{site.address}</a></div></section>
    </main>
    <a className="floating" {...cta(site.messages.default, "floating")}>{site.whatsappNumber === TODO_CLIENTE ? "Instagram" : "WhatsApp"} <span>↗</span></a><a className="mobile-booking" {...cta(site.messages.default, "mobile_fixed")}>{contactLabel}</a>
    {selected && <div className="dialog-backdrop"><section ref={dialogRef} className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><button className="close" aria-label="Fechar" onClick={() => setSelected(null)}>×</button><p className="eyebrow">{selected.category}</p><h2 id="dialog-title">{selected.name}</h2><p>{selected.description}</p><h3>O que este cuidado pode incluir</h3><ul>{selected.benefits.map((b) => <li key={b}>{b}</li>)}</ul><p className="muted">{selected.indication}</p><div className="dialog-actions"><a className="button" {...cta(site.messages.service(selected.name), `service_${selected.name}`)}>Quero saber mais sobre este tratamento</a><a className="text-link-dark" {...cta(site.messages.default, `service_generic_${selected.name}`)}>Prefiro descrever o que busco</a></div></section></div>}
    <footer><span>© {new Date().getFullYear()} {site.name}</span><a href={site.instagramUrl} target="_blank" rel="noreferrer">Instagram</a><span>Atendimento em São José — SC</span></footer>
  </>;
}
