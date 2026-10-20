"use client";
import { useEffect, useRef } from "react";
import type { Rect } from "./engine/depth-surface";
import { IdleCursor } from "./engine/idle-cursor";
import { loadMaterial } from "./engine/material-loader";
import { FORMATION_DONE_MS, SceneEngine } from "./engine/scene-engine";
import { dumbbellImage } from "./scene-images";

/** Dove sta il disegno dentro l'immagine (frazioni 0-1), misurato una volta sull'immagine: cosi' la pagina sa quanto
 *  sara' grande il manubrio prima ancora di scaricare l'immagine e puo' iniziare subito. */
type Bounds = { top: number; bottom: number; left: number; right: number };
const BOUNDS: Bounds = { top: 0.181, bottom: 0.819, left: 0.104, right: 0.896 };

/** Il manubrio sta grande al centro della schermata, come il vaso nell'hero del sito principale; il testo sta in basso
 *  a destra e su telefono sotto l'oggetto. */
function layout(w: number, h: number): Rect {
  const b = BOUNDS;
  const wf = Math.max(0.2, b.right - b.left), hf = Math.max(0.45, b.bottom - b.top), cx = (b.left + b.right) / 2;
  if (w >= 760) {
    const ih = Math.min((h * 0.68) / hf, (w * 0.36) / (wf * (2 / 3))), iw = (ih * 2) / 3;
    return { x: w * 0.5 - iw * cx, y: h * 0.9 - ih * b.bottom, w: iw, h: ih };
  }
  // telefono: fra l'intestazione e il blocco di testo in basso
  const ih = Math.min(Math.min(h * 0.44, 370) / hf, (w * 0.95) / (wf * (2 / 3))), iw = (ih * 2) / 3;
  return { x: w * 0.5 - iw * cx, y: h - 266 - ih * b.bottom, w: iw, h: ih };
}

/** Risoluzione massima del disegno rispetto ai pixel CSS: 2 sui telefoni (sono a 3x e a 1,5 sgranano), 1,5 sul computer. */
function maxDprFor(touch: boolean) {
  return touch ? 2 : 1.5;
}

/** Il file piu' piccolo che basta per la grandezza a cui il manubrio viene disegnato (la foto copre il rettangolo
 *  dell'oggetto, con la risoluzione dello schermo limitata come nel motore). I dispositivi a tocco (telefoni e tablet)
 *  non scaricano mai l'immagine da 2048 px: pesa di piu' e li farebbe scattare. */
function imageUrl(kind: "ceramic" | "kintsugi", rectWidth: number) {
  const touch = matchMedia("(hover: none)").matches;
  // i telefoni disegnano a risoluzione 2 (il computer a 1,5): l'immagine deve coprire quei pixel, non di meno
  const need = rectWidth * Math.min(devicePixelRatio, maxDprFor(touch));
  const size = need <= 560 ? "-640" : need <= 1024 || touch ? "-1024" : "";
  return dumbbellImage(kind, size);
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

/** La scena della home "forma" con il manubrio al posto del vaso: il manubrio si forma da cifre binarie, poi il cursore
 *  apre un varco e sotto si vedono le giunture d'oro. Riempie tutta la sezione che la contiene (la sezione deve essere
 *  `relative`). */
export function KfScene({ caption = "Le idee prendono forma" }: { caption?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const engineRef = useRef<SceneEngine | null>(null);
  const idleRef = useRef(new IdleCursor());

  useEffect(() => {
    const el = wrap.current, cv = canvas.current, cursor = ring.current;
    if (!el || !cv || !cursor) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches, touch = matchMedia("(hover: none)").matches;
    const idle = idleRef.current;
    let alive = true, visible = false, pageVisible = !document.hidden, last = 0, raf = 0;
    const cleanups: (() => void)[] = [];

    (async () => {
      const box = el.getBoundingClientRect();
      const rectWidth = layout(box.width, box.height).w;
      const ceramicUrl = imageUrl("ceramic", rectWidth), goldUrl = imageUrl("kintsugi", rectWidth);
      // all'inizio serve solo l'immagine dell'oggetto (la sagoma delle cifre): quella con l'oro serve dopo, quando passa
      // il cursore
      const base = await loadImage(ceramicUrl);
      const goldImage = loadImage(goldUrl);
      goldImage.catch(() => {});
      if (!alive) return;
      const engine = new SceneEngine({ canvas: cv, createCanvas: () => document.createElement("canvas"), base, width: box.width, height: box.height, dpr: devicePixelRatio, reduced, maxDpr: maxDprFor(touch), layout, grounded: false });
      engineRef.current = engine;
      // il materiale sotto il varco si calcola in un worker: la pagina non si blocca
      // il manubrio e' d'argento satinato: resta argento anche sotto il varco
      loadMaterial(goldUrl, () => goldImage, true).then((tech) => { if (alive) engine.setTech(tech); }).catch(() => {});

      // Quando la scena e' ferma (formazione finita, nessun cursore, nessun gesto) non serve ridisegnarla a 60 fps: si
      // disegna a 4 fotogrammi al secondo (basta a far scorrere la luce del fondo). Cosi' si puo' tenere una risoluzione
      // piu' alta sul telefono senza fare scattare ne' scaldare il dispositivo.
      let activeUntil = 0, lastDraw = 0;
      const wake = (t = performance.now()) => { activeUntil = Math.max(activeUntil, t + 1800); };
      // ogni gesto vero ferma il cursore automatico
      const cancelIdle = () => { if (idle.activity() && engine.flow) { engine.flow.pointer = null; engine.flow.old = null; } };
      const pointer = (e: PointerEvent) => {
        if (!engine.done || (e.target as Element | null)?.closest?.("a,button,input,textarea,summary")) return;
        wake();
        const r = el.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
        // il manubrio gira verso il mouse; sui dispositivi a tocco resta fermo e il dito apre solo il varco
        if (!reduced && !touch) engine.setPointer(e.clientX - r.left, e.clientY - r.top);
        const t = performance.now(), points = e.getCoalescedEvents?.() ?? [e];
        for (const p of points.length ? points : [e]) engine.addPointer(p.clientX - r.left, p.clientY - r.top, t);
        cursor.style.left = `${e.clientX - r.left}px`;
        cursor.style.top = `${e.clientY - r.top}px`;
        cursor.style.opacity = e.pointerType === "mouse" ? "1" : "0";
      };
      const leave = () => { cursor.style.opacity = "0"; engine.resetPointer(); };
      window.addEventListener("pointermove", cancelIdle, { capture: true, passive: true });
      window.addEventListener("pointerdown", cancelIdle, { capture: true, passive: true });
      window.addEventListener("pointermove", pointer, { capture: true, passive: true });
      el.parentElement?.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        window.removeEventListener("pointermove", cancelIdle, { capture: true });
        window.removeEventListener("pointerdown", cancelIdle, { capture: true });
        window.removeEventListener("pointermove", pointer, { capture: true });
        el.parentElement?.removeEventListener("pointerleave", leave);
      });

      const ro = new ResizeObserver(() => {
        const r = el.getBoundingClientRect();
        if (Math.abs(engine.w - r.width) > 1 || Math.abs(engine.h - r.height) > 1) { engine.resize(r.width, r.height, devicePixelRatio); wake(); }
      });
      ro.observe(el);
      const io = new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        last = 0;
        if (entries[0].intersectionRatio >= 0.35 && !engine.started) {
          engine.start();
          if (reduced) engine.elapsed = FORMATION_DONE_MS;
        }
      }, { threshold: [0, 0.35] });
      io.observe(el);
      const onVisibility = () => { pageVisible = !document.hidden; last = 0; wake(); };
      document.addEventListener("visibilitychange", onVisibility);
      cleanups.push(() => { ro.disconnect(); io.disconnect(); document.removeEventListener("visibilitychange", onVisibility); });

      const frame = (time: number) => {
        raf = requestAnimationFrame(frame);
        if (!visible || !pageVisible) { idle.suspend(); last = 0; return; }
        const dt = last ? Math.min((time - last) / 1000, 0.05) : 0;
        last = time;
        engine.advance(dt);
        const auto = idle.step(dt, !reduced && engine.done);
        if (auto) {
          // il cursore automatico percorre l'oggetto, non tutta la sezione
          const r = engine.rect;
          engine.addPointer(r.x + ((auto.x + 1) / 2) * r.w, r.y + ((1 - auto.y) / 2) * r.h, time);
          cursor.style.opacity = "0";
          wake(time);
        }
        if (!engine.done) wake(time);
        // ferma: 4 fotogrammi al secondo
        if (time > activeUntil && time - lastDraw < 250) return;
        lastDraw = time;
        engine.frame(time, 0);
      };
      engine.frame(performance.now());
      raf = requestAnimationFrame(frame);
    })().catch(() => {
      // senza la scena (immagini mancanti, canvas non disponibile) resta la sezione con il solo testo
    });

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      cleanups.forEach((c) => c());
      engineRef.current = null;
    };
  }, []);

  return (
    <>
      <div ref={wrap} className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <canvas ref={canvas} className="block h-full w-full" />
        <div ref={ring} className="kf-cursor"><i /></div>
      </div>
      <div className="kf-mono absolute inset-x-[var(--kf-gutter)] bottom-5 z-10 text-[var(--kf-soft)] md:bottom-6">
        <a href="#servizi" className="flex items-center gap-4 transition-opacity hover:opacity-70">{caption} <span aria-hidden="true" className="text-base">↓</span></a>
      </div>
    </>
  );
}
