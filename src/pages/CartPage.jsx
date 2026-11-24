import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/App.css";
import "../styles/Cartpage.css";
import {
  STORAGE_KEY,
  TAX_RATE,
  PROMOS,
  MAX_QTY,
  money,
  lineKey,
  loadCart,
  loadPromo,
  savePromo,
} from "../utils/cart.js";
import { prefersReducedMotion, useAnimatedNumber } from "../utils/motion.js";

// Counts up/down to the new amount whenever it changes
function Money({ value }) {
  return money(useAnimatedNumber(value));
}

export default function CartPage() {
  const [cart, setCart] = useState(loadCart);
  const [promo, setPromo] = useState(loadPromo);
  const [code, setCode] = useState(() => loadPromo()?.code || "");
  const [promoMsg, setPromoMsg] = useState(() => (loadPromo() ? `${loadPromo().code} applied` : ""));

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      window.dispatchEvent(new Event("rentwear-cart-updated"));
    } catch {
      /* storage unavailable */
    }
  }, [cart]);

  const changeQty = (key, delta) =>
    setCart(
      cart.map((i) =>
        lineKey(i) === key ? { ...i, qty: Math.min(MAX_QTY, Math.max(1, i.qty + delta)) } : i
      )
    );

  const [leaving, setLeaving] = useState(null);

  // Collapses the row first, then removes it from the bag
  const remove = (key, row) => {
    const drop = () => {
      setCart((c) => c.filter((i) => lineKey(i) !== key));
      setLeaving(null);
    };
    if (prefersReducedMotion() || !row) return drop();
    row.style.setProperty("--h", `${row.offsetHeight}px`);
    setLeaving(key);
    setTimeout(drop, 380);
  };

  const applyPromo = () => {
    const entered = code.trim().toUpperCase();
    if (PROMOS[entered]) {
      setPromo({ code: entered, rate: PROMOS[entered] });
      savePromo(entered);
      setPromoMsg(`${entered} applied`);
    } else {
      setPromo(null);
      savePromo("");
      setPromoMsg(entered ? "That code isn't valid" : "Enter a promo code");
    }
  };

  const count = cart.reduce((n, i) => n + i.qty, 0);
  const subtotal = cart.reduce((n, i) => n + i.rent * i.qty, 0);
  const discount = promo ? subtotal * promo.rate : 0;
  const tax = (subtotal - discount) * TAX_RATE;
  const total = subtotal - discount + tax;

  return (
    <div className="cart-page">
      {/* Left-aligned title matching Accessories */}
      <div className="ct-head" style={{ textAlign: "left" }}>
        <div className="ct-wrap">
          <div
            className="ct-title-row"
            style={{ display: "flex", justifyContent: "flex-start", alignItems: "baseline", gap: "14px", textAlign: "left" }}
          >
            <h1 style={{ textAlign: "left", margin: 0 }}>Your Bag</h1>
            <span className="ct-count">{count} {count === 1 ? "item" : "items"}</span>
          </div>
        </div>
      </div>

      <main className="ct-wrap">
        {cart.length === 0 ? (
          <div className="ct-empty">
            <p>Your bag is empty.</p>
            <Link to="/clothes" className="ct-continue"><i className="bi bi-arrow-left" /> Continue shopping</Link>
          </div>
        ) : (
          <div className="ct-layout">
            <section>
              <ul className="ct-items">
                {cart.map((item, idx) => {
                  const key = lineKey(item);
                  return (
                    <li className={`ct-item ${leaving === key ? "is-leaving" : ""}`} style={{ "--i": idx }} key={key}>
                      <Link to={`/product?id=${item.id}`} className="ct-thumb">
                        <img src={item.image} alt={item.name} />
                      </Link>

                      <div className="ct-info">
                        <h2>
                          <Link to={`/product?id=${item.id}`}>{item.name}</Link>
                        </h2>
                        <p>
                          Color: {item.color} · Size: {item.size}
                          {item.eventDate ? ` · Event: ${item.eventDate}` : ""}
                        </p>
                        <button type="button" className="ct-remove" onClick={(e) => remove(key, e.currentTarget.closest("li"))}>Remove</button>
                      </div>

                      <div className="ct-qty" role="group" aria-label={`Quantity for ${item.name}`}>
                        <button type="button" aria-label="Decrease quantity" onClick={() => changeQty(key, -1)}>−</button>
                        <span key={item.qty} className="num-pop">{item.qty}</span>
                        <button type="button" aria-label="Increase quantity" onClick={() => changeQty(key, 1)}>+</button>
                      </div>

                      <div className="ct-price"><Money value={item.rent * item.qty} /></div>
                    </li>
                  );
                })}
              </ul>
              <Link to="/clothes" className="ct-continue"><i className="bi bi-arrow-left" /> Continue shopping</Link>
            </section>

            <aside>
              <div className="ct-summary">
                <h2>ORDER SUMMARY</h2>
                <dl>
                  <div><dt>Subtotal</dt><dd><Money value={subtotal} /></dd></div>
                  {promo && <div><dt>Promo ({promo.code})</dt><dd>−<Money value={discount} /></dd></div>}
                  <div className="is-soft"><dt>Delivery</dt><dd>Free</dd></div>
                  <div><dt>Estimated tax</dt><dd><Money value={tax} /></dd></div>
                  <div className="ct-total"><dt>Total</dt><dd><Money value={total} /></dd></div>
                </dl>

                <div className="ct-promo">
                  <input
                    type="text"
                    placeholder="Promo code (WELCOME10)"
                    value={code}
                    aria-label="Promo code"
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                  />
                  <button type="button" onClick={applyPromo}>Apply</button>
                </div>
                {promoMsg && <p key={promoMsg} className={`ct-promo-msg ${promo ? "is-ok" : ""}`}>{promoMsg}</p>}

                <Link to="/checkout" className="ct-checkout">PROCEED TO CHECKOUT</Link>
              </div>

              <ul className="ct-trust">
                <li><i className="bi bi-check2" /> Free returns within 30 days</li>
                <li><i className="bi bi-check2" /> Secure checkout, encrypted end to end</li>
              </ul>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}