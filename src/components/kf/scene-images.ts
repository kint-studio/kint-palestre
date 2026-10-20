/** Le immagini del manubrio stanno in `public/forma/`, in tre misure: 2048 px (senza suffisso), 1024 e 640.
 *  `ceramic` e' l'oggetto (e la sagoma delle cifre), `kintsugi` quello con le giunture d'oro che si vede sotto il varco.
 *  Modulo senza "use client": lo importano sia `KfLanding` (server) sia `KfScene` (client). */
export function dumbbellImage(kind: "ceramic" | "kintsugi", size: "" | "-640" | "-1024") {
  return `/forma/manubrio-${kind}${size}.webp`;
}

/** Sui telefoni l'oggetto e' sempre quello da 1024 px: `KfLanding` lo fa precaricare. */
export const DUMBBELL_PRELOAD = dumbbellImage("ceramic", "-1024");
