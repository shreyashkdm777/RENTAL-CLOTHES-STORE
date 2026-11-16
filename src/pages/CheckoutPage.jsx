import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/App.css";
import "../styles/CheckoutPage.css";
import { TAX_RATE, EXPRESS_FEE, money, lineKey, loadCart, loadPromo, clearBag, saveOrder } from "../utils/cart.js";
import { getSession } from "../utils/auth.js";

const SHIPPING = [
  { id: "standard", label: "Standard — 3–5 business days", fee: 0 },
  { id: "express", label: "Express — 1–2 business days", fee: EXPRESS_FEE },
];

const PAYMENTS = [
  { id: "card", label: "Credit / debit card" },
  { id: "upi", label: "UPI" },
  { id: "cod", label: "Pay on delivery" },
];

function Field({ label, name, form, setForm, className = "", ...rest }) {
  return (
    <label className={`co-field ${className}`}>
      <span>{label}</span>
      <input
        name={name}
        value={form[name]}
        {...rest}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
      />
    </label>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cart] = useState(loadCart);
  const [promo] = useState(loadPromo);
  const [form, setForm] = useState(() => {
    const s = getSession();
    const parts = (s?.name || "").trim().split(/\s+/);
    return {
      email: s?.email || "",
      news: false,
      first: parts[0] || "",
      last: parts.slice(1).join(" ") || "",
      address: "",
      city: "",
      state: "",
      pin: "",
      country: "India",
      phone: s?.phone || "",
      cardNumber: "",
      cardName: "",
      cardExpiry: "",
      cardCvv: "",
      upi: "",
    };
  });
  const [shipping, setShipping] = useState("standard");
  const [payment, setPayment] = useState("card");

  const fee = SHIPPING.find((s) => s.id === shipping).fee;
  const subtotal = cart.reduce((n, i) => n + i.rent * i.qty, 0);
  const discount = promo ? subtotal * promo.rate : 0;
  const tax = (subtotal - discount) * TAX_RATE;
  const total = subtotal - discount + fee + tax;

  const placeOrder = (e) => {
    e.preventDefault();
    const order = {
      id: "RW" + Date.now().toString().slice(-6),
      items: cart,
      shipping,
      payment,
      promo: promo?.code || null,
      totals: { subtotal, discount, fee, tax, total },
      total,
      customer: { email: form.email, name: `${form.first} ${form.last}`.trim(), phone: form.phone },
      address: { line: form.address, city: form.city, state: form.state, pin: form.pin, country: form.country },
      placedAt: new Date().toISOString(),
      status: "placed",
    };
    saveOrder(order);
    clearBag();
    navigate(`/orders?id=${order.id}`);
  };

  return (
    <div className="checkout-page">
      {/* Left-aligned title matching Accessories */}
      <div className="co-head" style={{ textAlign: "left" }}>
        <div className="co-wrap" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <h1 style={{ textAlign: "left", margin: 0 }}>Checkout</h1>
        </div>
      </div>

      <main className="co-wrap">
        {cart.length === 0 ? (
          <div className="co-done">
            <h2>Your bag is empty</h2>
            <p>Add an outfit to your bag before checking out.</p>
            <Link to="/clothes" className="co-btn">Browse outfits</Link>
          </div>
        ) : (
          <div className="co-layout">
            <form id="checkout-form" className="co-form" onSubmit={placeOrder}>
              <section className="co-section">
                <h2 className="co-step"><b>1</b> Contact</h2>
                <Field
                  label="Email"
                  name="email"
                  form={form}
                  setForm={setForm}
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
                <label className="co-news">
                  <input type="checkbox" checked={form.news} onChange={(e) => setForm({ ...form, news: e.target.checked })} />
                  <span>Email me with new arrivals and previews</span>
                </label>
              </section>

              <section className="co-section">
                <h2 className="co-step"><b>2</b> Shipping address</h2>
                <div className="co-row co-row--2">
                  <Field label="First name" name="first" form={form} setForm={setForm} placeholder="Aisha" autoComplete="given-name" required />
                  <Field label="Last name" name="last" form={form} setForm={setForm} placeholder="Khan" autoComplete="family-name" required />
                </div>
                <Field
                  label="Address"
                  name="address"
                  form={form}
                  setForm={setForm}
                  placeholder="Street address, apartment, unit"
                  autoComplete="street-address"
                  required
                />
                <div className="co-row co-row--3">
                  <Field label="City" name="city" form={form} setForm={setForm} placeholder="Mumbai" autoComplete="address-level2" required />
                  <Field label="State / Region" name="state" form={form} setForm={setForm} placeholder="Maharashtra" autoComplete="address-level1" required />
                  <Field
                    label="PIN code"
                    name="pin"
                    form={form}
                    setForm={setForm}
                    placeholder="400001"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    title="6-digit PIN code"
                    autoComplete="postal-code"
                    required
                  />
                </div>
                <div className="co-row co-row--2">
                  <Field label="Country" name="country" form={form} setForm={setForm} placeholder="India" autoComplete="country-name" required />
                  <Field
                    label="Phone"
                    name="phone"
                    form={form}
                    setForm={setForm}
                    type="tel"
                    placeholder="For delivery updates"
                    pattern="[0-9+\s\-]{10,15}"
                    title="10–15 digits"
                    autoComplete="tel"
                    required
                  />
                </div>
              </section>

              <section className="co-section">
                <h2 className="co-step"><b>3</b> Delivery method</h2>
                <div className="co-options">
                  {SHIPPING.map((s) => (
                    <label key={s.id} className={`co-option ${shipping === s.id ? "is-on" : ""}`}>
                      <input type="radio" name="shipping" checked={shipping === s.id} onChange={() => setShipping(s.id)} />
                      <span>{s.label}</span>
                      <em>{s.fee ? money(s.fee) : "Free"}</em>
                    </label>
                  ))}
                </div>
              </section>

              <section className="co-section">
                <h2 className="co-step">
                  <b>4</b> Payment
                  <small><i className="bi bi-lock-fill" /> Secure, encrypted</small>
                </h2>
                <div className="co-options">
                  {PAYMENTS.map((p) => (
                    <label key={p.id} className={`co-option ${payment === p.id ? "is-on" : ""}`}>
                      <input type="radio" name="payment" checked={payment === p.id} onChange={() => setPayment(p.id)} />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>

                {payment === "card" && (
                  <div className="co-pay">
                    <Field
                      label="Card number"
                      name="cardNumber"
                      form={form}
                      setForm={setForm}
                      placeholder="1234 5678 9012 3456"
                      inputMode="numeric"
                      pattern="[0-9 ]{13,19}"
                      maxLength={19}
                      autoComplete="cc-number"
                      required
                    />
                    <Field label="Name on card" name="cardName" form={form} setForm={setForm} autoComplete="cc-name" required />
                    <div className="co-row co-row--2">
                      <Field
                        label="Expiry"
                        name="cardExpiry"
                        form={form}
                        setForm={setForm}
                        placeholder="MM / YY"
                        pattern="(0[1-9]|1[0-2]) ?/ ?[0-9]{2}"
                        title="MM / YY"
                        maxLength={7}
                        autoComplete="cc-exp"
                        required
                      />
                      <Field
                        label="CVV"
                        name="cardCvv"
                        form={form}
                        setForm={setForm}
                        type="password"
                        placeholder="•••"
                        inputMode="numeric"
                        pattern="[0-9]{3,4}"
                        maxLength={4}
                        autoComplete="cc-csc"
                        required
                      />
                    </div>
                  </div>
                )}
                {payment === "upi" && (
                  <div className="co-pay">
                    <Field
                      label="UPI ID"
                      name="upi"
                      form={form}
                      setForm={setForm}
                      placeholder="name@bank"
                      pattern="[\w.\-]{2,}@[A-Za-z]{2,}"
                      title="e.g. name@bank"
                      required
                    />
                  </div>
                )}
                {payment === "cod" && (
                  <p className="co-note">Pay in cash or UPI when your outfit is delivered.</p>
                )}
              </section>
            </form>

            <aside className="co-aside">
              <div className="co-summary">
                <h2>ORDER SUMMARY</h2>
                <ul className="co-lines">
                  {cart.map((item) => (
                    <li key={lineKey(item)}>
                      <div className="co-thumb"><img src={item.image} alt={item.name} /></div>
                      <div>
                        <h3>{item.name}</h3>
                        <p>Qty {item.qty} · {item.color} · {item.size}</p>
                      </div>
                      <span>{money(item.rent * item.qty)}</span>
                    </li>
                  ))}
                </ul>

                <dl>
                  <div><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
                  {promo && <div><dt>Promo ({promo.code})</dt><dd>−{money(discount)}</dd></div>}
                  <div className="is-soft"><dt>Delivery</dt><dd>{fee ? money(fee) : "Free"}</dd></div>
                  <div><dt>Estimated tax</dt><dd>{money(tax)}</dd></div>
                  <div className="co-total"><dt>Total</dt><dd>{money(total)}</dd></div>
                </dl>

                <button type="submit" form="checkout-form" className="co-place">
                  PLACE ORDER — {money(total)}
                </button>
              </div>

              <div className="co-seal">
                <span className="co-emblem">R</span>
                <p>Steamed, fitted and delivered to your door before your event.</p>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}