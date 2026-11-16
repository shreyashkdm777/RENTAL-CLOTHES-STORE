import { useEffect, useState } from "react";
import "../styles/App.css";
import "../styles/Orderspage.css";
import { money, loadOrders, bagCount, SHIPPING_LABELS, PAYMENT_LABELS } from "../utils/cart.js";

const ORDERS_KEY = "rentwear-orders";

const STEPS = [
  { id: "placed", label: "Order placed" },
  { id: "confirmed", label: "Confirmed" },
  { id: "out", label: "Out for delivery" },
  { id: "delivered", label: "Delivered" },
  { id: "returned", label: "Picked up" },
];

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

export default function OrdersPage() {
  const highlight = new URLSearchParams(window.location.search).get("id");
  const [orders, setOrders] = useState(loadOrders);
  const [count] = useState(bagCount);

  useEffect(() => {
    if (!highlight) return;
    document.getElementById(`order-${highlight}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [highlight]);

  const handleRemoveOrder = (orderId) => {
    if (!window.confirm(`Remove order ${orderId} from your orders?`)) return;

    const updatedOrders = orders.filter((order) => order.id !== orderId);
    setOrders(updatedOrders);

    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
    } catch {
      /* storage unavailable */
    }
  };

  const justPlaced = orders.find((o) => o.id === highlight);

  return (
    <div className="orders-page">
      {/* Title (Left-aligned like Accessories) */}
      <div className="or-head">
        <div className="or-wrap">
          <div className="or-title-row">
            <h1>My Orders</h1>
            <span>{orders.length} {orders.length === 1 ? "order" : "orders"}</span>
          </div>
        </div>
      </div>

      <main className="or-wrap or-main">
        {justPlaced && (
          <div className="or-banner">
            <i className="bi bi-check-circle-fill" />
            <div>
              <strong>Thank you! Your order {justPlaced.id} has been placed.</strong>
              <p>We&apos;ll be in touch to confirm your fitting and delivery date.</p>
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="or-empty">
            <i className="bi bi-bag" />
            <h2>No orders yet</h2>
            <p>When you rent an outfit, you&apos;ll see it here.</p>
            <a href="/clothes" className="or-btn">Browse outfits</a>
          </div>
        ) : (
          orders.map((o) => {
            const sub = o.items.reduce((n, i) => n + i.rent * i.qty, 0);
            const t = o.totals || { subtotal: sub, discount: 0, fee: 0, tax: 0, total: o.total ?? sub };
            const step = Math.max(0, STEPS.findIndex((s) => s.id === o.status));
            const a = o.address || {};
            return (
              <article id={`order-${o.id}`} key={o.id} className={`or-card ${o.id === highlight ? "is-new" : ""}`}>
                {/* Head */}
                <div className="or-card-head">
                  <div>
                    <p className="or-kicker">ORDER</p>
                    <h2>{o.id}</h2>
                    <p className="or-date">Placed on {formatDate(o.placedAt)}</p>
                  </div>
                  <div className="or-head-right">
                    <span className="or-pill">{STEPS[step].label}</span>
                    <strong>{money(t.total)}</strong>
                    <button
                      type="button"
                      className="or-remove-btn"
                      onClick={() => handleRemoveOrder(o.id)}
                      aria-label={`Remove order ${o.id}`}
                    >
                      <i className="bi bi-trash3" /> Remove order
                    </button>
                  </div>
                </div>

                {/* Progress */}
                <ol className="or-track" aria-label="Order progress">
                  {STEPS.map((s, n) => (
                    <li key={s.id} className={`${n <= step ? "is-done" : ""} ${n === step ? "is-current" : ""}`}>
                      <span>{n <= step ? <i className="bi bi-check2" /> : n + 1}</span>
                      <em>{s.label}</em>
                    </li>
                  ))}
                </ol>
                {step === 0 && (
                  <p className="or-note">
                    We&apos;ll contact you{o.customer?.phone ? ` on ${o.customer.phone}` : ""} to confirm your fitting and delivery date.
                  </p>
                )}

                {/* Items + totals */}
                <div className="or-body">
                  <ul className="or-items">
                    {o.items.map((i) => (
                      <li key={`${i.id}-${i.size}-${i.color}`}>
                        <div className="or-thumb"><img src={i.image} alt={i.name} /></div>
                        <div>
                          <h3>{i.name}</h3>
                          <p>Color: {i.color} · Size: {i.size} · Qty: {i.qty}</p>
                          <a href={`/product?id=${i.id}`}>Rent again →</a>
                        </div>
                        <span>{money(i.rent * i.qty)}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="or-summary">
                    <h3>ORDER SUMMARY</h3>
                    <dl>
                      <div><dt>Subtotal</dt><dd>{money(t.subtotal)}</dd></div>
                      {t.discount > 0 && <div><dt>Promo{o.promo ? ` (${o.promo})` : ""}</dt><dd>−{money(t.discount)}</dd></div>}
                      <div><dt>Delivery</dt><dd>{t.fee ? money(t.fee) : "Free"}</dd></div>
                      <div><dt>Estimated tax</dt><dd>{money(t.tax)}</dd></div>
                      <div className="or-total"><dt>Total</dt><dd>{money(t.total)}</dd></div>
                    </dl>
                  </div>
                </div>

                {/* Delivery / payment details */}
                <div className="or-foot">
                  <div>
                    <h3>Delivery address</h3>
                    <p>
                      {o.customer?.name}<br />
                      {a.line}<br />
                      {[a.city, a.state, a.pin].filter(Boolean).join(", ")}<br />
                      {a.country}
                    </p>
                  </div>
                  <div>
                    <h3>Delivery method</h3>
                    <p>{SHIPPING_LABELS[o.shipping] || o.shipping}</p>
                  </div>
                  <div>
                    <h3>Payment</h3>
                    <p>{PAYMENT_LABELS[o.payment] || o.payment}</p>
                  </div>
                </div>
              </article>
            );
          })
        )}

        {orders.length > 0 && (
          <a href="/clothes" className="or-continue"><i className="bi bi-arrow-left" /> Continue shopping</a>
        )}
      </main>
    </div>
  );
}