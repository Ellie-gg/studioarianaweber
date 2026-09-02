"use client";

import { useEffect, useRef } from "react";

export function SilkCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let frame = 0, running = true;
    const draw = (t = 0) => {
      const ratio = Math.min(devicePixelRatio, 2); const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * ratio; canvas.height = height * ratio; ctx.scale(ratio, ratio);
      const drift = reduced ? 0 : t / 11000;
      ctx.clearRect(0, 0, width, height);
      ["rgba(216,181,175,.25)", "rgba(198,163,107,.18)", "rgba(117,61,79,.3)"].forEach((color, i) => {
        const gradient = ctx.createRadialGradient(width * (.2 + i * .34 + Math.sin(drift + i) * .07), height * (.25 + i * .22), 0, width * .5, height * .5, Math.max(width, height) * .72);
        gradient.addColorStop(0, color); gradient.addColorStop(1, "transparent"); ctx.fillStyle = gradient; ctx.fillRect(0, 0, width, height);
      });
      if (running && !reduced) frame = requestAnimationFrame(draw);
    };
    const resize = () => draw(performance.now()); const visibility = () => { running = !document.hidden; if (running) draw(performance.now()); else cancelAnimationFrame(frame); };
    draw(); window.addEventListener("resize", resize); document.addEventListener("visibilitychange", visibility);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  return <canvas ref={ref} aria-hidden="true" className="silk-canvas" />;
}
