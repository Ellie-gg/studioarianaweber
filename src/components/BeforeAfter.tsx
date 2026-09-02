"use client";

import { useRef, useState } from "react";
import { track } from "@/src/lib/analytics";

export function BeforeAfter() {
  const [value, setValue] = useState(50); const touched = useRef(false);
  const interact = (next: number) => { setValue(Math.max(0, Math.min(100, next))); if (!touched.current) { track("before_after_interaction"); touched.current = true; } };
  return <div className="comparison" aria-label="Área de desenvolvimento: imagens de antes e depois aguardando autorização">
    <div className="comparison-after"><span>Depois</span><p>Imagem autorizada<br />TODO_CLIENTE</p></div>
    <div className="comparison-before" style={{ width: `${value}%` }}><span>Antes</span><p>Imagem autorizada<br />TODO_CLIENTE</p></div>
    <input aria-label="Ajustar comparação de antes e depois" type="range" min="0" max="100" value={value} onChange={(e) => interact(Number(e.target.value))} />
    <div className="comparison-handle" style={{ left: `${value}%` }} aria-hidden="true">↔</div>
  </div>;
}
