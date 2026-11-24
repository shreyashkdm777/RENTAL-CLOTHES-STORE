import { useEffect, useRef } from "react";

/* Adds `is-in` once the element scrolls into view (one time).
   Children opt in with .rv-item (rise), .rv-img (unveil) or the .mask text reveal —
   set style={{ "--i": n }} on them to stagger. */
export default function Reveal({ as: Tag = "div", className = "", children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-in");
      return;
    }
    // threshold 0 so very tall grids (mobile, one column) still trigger
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`rv ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
