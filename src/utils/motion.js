import { useEffect, useRef, useState } from "react";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/* Tweens a number toward `target` whenever it changes (used for cart totals). */
export function useAnimatedNumber(target, ms = 450) {
  const [value, setValue] = useState(target);
  const from = useRef(target);

  useEffect(() => {
    if (from.current === target) return;
    if (prefersReducedMotion()) {
      from.current = target;
      setValue(target);
      return;
    }
    const start = performance.now();
    const a = from.current;
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / ms);
      const v = a + (target - a) * (1 - Math.pow(1 - p, 3));
      from.current = v;
      setValue(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);

  return value;
}
