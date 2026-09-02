"use client";

import { useEffect, useRef } from "react";

export function SilkCanvas() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let destroyed = false;
    let cleanup = () => {};

    void (async () => {
      const [{ ShaderMaterial, Uniform, WebGLRenderer }, fluidFx] = await Promise.all([
        import("three"),
        import("three-fluid-fx"),
      ]);
      if (destroyed) return;

      const renderer = new WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
        premultipliedAlpha: false,
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
      renderer.domElement.setAttribute("aria-hidden", "true");
      host.appendChild(renderer.domElement);

      const fluid = new fluidFx.FluidSimulation(renderer, {
        profile: "performance",
        pressureIterations: 4,
        splatRadius: 0.0015,
        splatForce: 4,
        curlStrength: 0.45,
        densityDissipation: 0.95,
        velocityDissipation: 0.98,
        pressureDissipation: 0.2,
        enableVorticity: true,
        reflectWalls: false,
        bfecc: false,
      });

      const material = new ShaderMaterial({
        transparent: true,
        depthTest: false,
        depthWrite: false,
        vertexShader: fluidFx.FULLSCREEN_VERTEX,
        fragmentShader: /* glsl */ `
          precision highp float;
          varying vec2 vUv;
          uniform sampler2D tFluid;
          uniform float uTime;

          void main() {
            vec3 field = texture2D(tFluid, vUv).rgb;
            float density = clamp(field.b * 1.85, 0.0, 1.0);
            float flow = clamp(length(field.rg) * 0.04, 0.0, 1.0);
            vec3 rose = vec3(0.847, 0.710, 0.686);
            vec3 gold = vec3(0.776, 0.639, 0.420);
            vec3 plum = vec3(0.275, 0.118, 0.190);
            float silk = 0.5 + 0.5 * sin(vUv.y * 8.0 + uTime * 0.18 + field.r * 0.8);
            vec3 color = mix(rose, gold, silk * 0.58 + flow * 0.3);
            color = mix(color, plum, smoothstep(0.35, 1.0, flow) * 0.28);
            float alpha = pow(density, 0.72) * 0.62;
            gl_FragColor = vec4(color, alpha);
          }
        `,
        uniforms: {
          tFluid: new Uniform(fluid.densityTexture),
          uTime: new Uniform(0),
        },
      });
      const pass = new fluidFx.FullscreenPass(material);
      const detachPointer = fluidFx.attachPointerSplats(host.parentElement ?? host, fluid);

      const resize = () => {
        const width = Math.max(1, host.clientWidth);
        const height = Math.max(1, host.clientHeight);
        renderer.setSize(width, height, false);
        fluid.resize(width, height);
      };
      const observer = new ResizeObserver(resize);
      observer.observe(host);
      resize();

      let previous = performance.now();
      let nextAmbient = previous + 350;
      const render = (now: number) => {
        const delta = Math.min(Math.max((now - previous) / 1000, 1e-6), 1 / 30);
        previous = now;
        if (now >= nextAmbient) {
          const x = 0.14 + Math.random() * 0.72;
          const y = 0.18 + Math.random() * 0.64;
          fluid.addSplat(x, y, (Math.random() - 0.5) * 2.2, (Math.random() - 0.5) * 1.4, { radius: 0.0018 });
          nextAmbient = now + 2300 + Math.random() * 1200;
        }
        fluid.step(Math.min(delta, 1 / 60));
        material.uniforms.tFluid.value = fluid.densityTexture;
        material.uniforms.uTime.value = now / 1000;
        pass.render(renderer, null);
      };
      const setRunning = () => {
        previous = performance.now();
        renderer.setAnimationLoop(document.hidden ? null : render);
      };
      document.addEventListener("visibilitychange", setRunning);
      setRunning();

      cleanup = () => {
        renderer.setAnimationLoop(null);
        document.removeEventListener("visibilitychange", setRunning);
        observer.disconnect();
        detachPointer?.();
        pass.dispose();
        material.dispose();
        fluid.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      destroyed = true;
      cleanup();
    };
  }, []);

  return <div ref={hostRef} aria-hidden="true" className="silk-canvas" />;
}
