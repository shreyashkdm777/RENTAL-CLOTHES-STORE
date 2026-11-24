import { prefersReducedMotion } from "./motion.js";

/* Flies a small thumbnail from `fromEl` into the header bag icon, then bounces the icon.
   Does nothing if the bag icon isn't visible (small phones) or motion is reduced. */
export function flyToBag(fromEl, src) {
  const bag = document.querySelector(".bag-icon");
  if (!fromEl || !bag || prefersReducedMotion()) return;

  const a = fromEl.getBoundingClientRect();
  const b = bag.getBoundingClientRect();
  if (!a.width || !b.width) return;

  const w = 64;
  const h = 84;
  const ghost = document.createElement("div");
  ghost.className = "fly-ghost";
  Object.assign(ghost.style, {
    left: `${a.left + a.width / 2 - w / 2}px`,
    top: `${a.top + a.height / 2 - h / 2}px`,
    width: `${w}px`,
    height: `${h}px`,
    backgroundImage: `url("${src}")`,
  });
  document.body.appendChild(ghost);

  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);

  ghost
    .animate(
      [
        { transform: "translate(0,0) scale(1) rotate(0deg)", opacity: 1 },
        { transform: `translate(${dx * 0.55}px, ${dy * 0.55 - 90}px) scale(0.6) rotate(-8deg)`, opacity: 1, offset: 0.55 },
        { transform: `translate(${dx}px, ${dy}px) scale(0.12) rotate(0deg)`, opacity: 0.3 },
      ],
      { duration: 780, easing: "cubic-bezier(.5,0,.3,1)" }
    )
    .addEventListener("finish", () => {
      ghost.remove();
      bag.classList.remove("is-bump");
      void bag.offsetWidth; // restart the bounce if it is already playing
      bag.classList.add("is-bump");
    });
}
