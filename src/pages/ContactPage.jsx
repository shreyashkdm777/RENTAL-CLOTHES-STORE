import { useState } from "react";
import "../styles/App.css"; // reuses your existing header styles

/* ---------- Your contact details (same as your footer — edit them here) ---------- */
const CONTACT = {
    address: "At.Alibag, Near.Bus Stop Alibag",
    email: "rentwear@gmail.com",
    phone: "+91  9684335722",
    hours: "",     // e.g. "Mon–Sat, 10am – 7pm"  (hidden while empty)
    whatsapp: "",  // digits with country code, e.g. "919876543210"  (WhatsApp button hidden while empty)
};

const FORM_ENDPOINT = "";

const TOPICS = [
    "Renting an outfit",
    "Fitting & alterations",
    "Delivery & pickup",
    "Help with an order",
    "Something else",
];

const FAQS = [
    {
        q: "How does renting work?",
        a: "Choose your outfit and pick your event date. Reserve it with a small advance and we fit and alter it to you. It arrives steamed, styled and ready for the big day, and after the event you simply send it back.",
    },
    {
        q: "Will the outfit fit me?",
        a: "Yes. Every outfit goes through our free fitting service, so it is altered to your measurements before the event.",
    },
    {
        q: "Do I need to clean the outfit before returning it?",
        a: "No. Every outfit is cleaned after each rental, so there is no cleaning and no storage on your side.",
    },
    {
        q: "How do delivery and pickup work?",
        a: "We bring your outfit right to your doorstep and collect it from you after your event.",
    },
    {
        q: "Can you help me match jewellery to my outfit?",
        a: "Of course. Write to us with your outfit and event, and our team will help you choose accessories to complete the look.",
    },
];

const bagCount = () => {
    try {
        const raw = localStorage.getItem("rentwear-cart");
        return raw ? JSON.parse(raw).reduce((n, i) => n + i.qty, 0) : 0;
    } catch {
        return 0;
    }
};

const EMPTY = { name: "", email: "", phone: "", topic: TOPICS[0], date: "", message: "", website: "" };

const CONTACT_CSS = `
.contact-page {
  margin-top: 0;
  --cn-ink: #1d1517;
  --cn-muted: #6e6266;
  --cn-maroon: #6b1d34;
  --cn-gold: #b08d57;
  --cn-line: #eadfd8;
  --cn-field: #d9ccc6;
  background: #fffdf9;
  color: var(--cn-ink);
  font-family: "DM Sans", Arial, sans-serif;
  min-height: 100vh;
}

.contact-page .site-header { position: sticky; top: 0; }

/* Title area — left-aligned like Accessories */
.cn-wrap { max-width: 1180px; margin: 0 auto; padding: 0 5%; }
.cn-head {
  padding-top: 28px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--cn-line);
  text-align: left;
}
.cn-head .cn-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}
.cn-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.22em; color: var(--cn-gold); }
.cn-head h1 {
  margin: 0;
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(32px, 4vw, 44px);
  font-weight: 500;
  line-height: 1.1;
  text-align: left;
}
.cn-head p { margin-top: 10px; max-width: 520px; font-size: 15px; line-height: 1.6; color: var(--cn-muted); text-align: left; }

/* Form + details */
.cn-main { background: var(--cn-blush); padding: 48px 0 64px; }
.cn-layout { display: grid; grid-template-columns: 1fr 360px; gap: 32px; align-items: start; }

.cn-card { background: #fff; border: 1px solid var(--cn-line); border-radius: 6px; padding: 34px 34px 36px; }
.cn-card h2 { font-family: "Playfair Display", Georgia, serif; font-size: 26px; font-weight: 500; }
.cn-card-sub { margin: 6px 0 24px; font-size: 14px; color: var(--cn-muted); }

.cn-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.cn-field { display: block; margin-bottom: 16px; }
.cn-field > span { display: block; margin-bottom: 7px; font-size: 12px; font-weight: 600; }
.cn-field > span em { font-style: normal; font-weight: 400; color: var(--cn-muted); }
.cn-field input, .cn-field select, .cn-field textarea {
  width: 100%; padding: 0 14px;
  border: 1px solid var(--cn-field); border-radius: 6px; background: #fff;
  font-family: inherit; font-size: 14px; color: var(--cn-ink); outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.cn-field input, .cn-field select { height: 46px; }
.cn-field textarea { padding: 12px 14px; min-height: 130px; resize: vertical; line-height: 1.5; }
.cn-field input::placeholder, .cn-field textarea::placeholder { color: #a89b96; }
.cn-field input:focus, .cn-field select:focus, .cn-field textarea:focus {
  border-color: var(--cn-maroon); box-shadow: 0 0 0 3px rgba(107, 29, 52, 0.12);
}
.cn-field select {
  appearance: none; -webkit-appearance: none; padding-right: 40px; cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%236b1d34' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 15px center;
}
.cn-hp { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }

.cn-error {
  display: flex; gap: 8px; margin-bottom: 16px; padding: 11px 13px;
  background: #fbeeee; border: 1px solid #ecc9c9; border-radius: 6px;
  font-size: 13px; line-height: 1.4; color: #8a1f2d;
}

.cn-submit, .cn-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  height: 48px; padding: 0 30px; border: 1px solid var(--cn-maroon); border-radius: 6px;
  background: var(--cn-maroon); color: #fff;
  font-family: inherit; font-size: 14px; font-weight: 500; cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.cn-submit:hover:not(:disabled), .cn-btn:hover { background: #561628; border-color: #561628; }
.cn-submit:disabled { opacity: 0.6; cursor: default; }
.cn-btn--ghost { background: #fff; color: var(--cn-maroon); }
.cn-btn--ghost:hover { background: var(--cn-maroon); color: #fff; }

/* Sent state */
.cn-done { text-align: center; padding: 30px 10px; }
.cn-done > i { font-size: 40px; color: var(--cn-maroon); }
.cn-done h2 { margin-top: 12px; }
.cn-done p { margin: 10px auto 22px; max-width: 380px; font-size: 14px; line-height: 1.6; color: var(--cn-muted); }
.cn-done a { color: var(--cn-maroon); font-weight: 600; }

/* Details column */
.cn-info { display: grid; gap: 14px; }
.cn-item {
  display: flex; gap: 16px; align-items: flex-start;
  padding: 20px 22px; background: #fff; border: 1px solid var(--cn-line); border-radius: 6px;
}
.cn-item > i {
  flex: none; width: 42px; height: 42px; border-radius: 50%;
  background: var(--cn-blush); color: var(--cn-maroon);
  display: flex; align-items: center; justify-content: center; font-size: 18px;
}
.cn-item h3 { font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--cn-gold); }
.cn-item p, .cn-item a { display: block; margin-top: 6px; font-size: 15px; line-height: 1.5; word-break: break-word; }
.cn-item a { color: var(--cn-ink); }
.cn-item a:hover { color: var(--cn-maroon); text-decoration: underline; }
.cn-whatsapp { width: 100%; height: 48px; padding: 0; }

/* FAQ */
.cn-faq { padding: 68px 0 84px; }
.cn-faq-head { text-align: center; }
.cn-faq-head h2 { font-family: "Playfair Display", Georgia, serif; font-size: clamp(28px, 3.4vw, 38px); font-weight: 500; }
.cn-faq-head p { margin-top: 8px; font-size: 14px; color: var(--cn-muted); }
.cn-acc { max-width: 760px; margin: 34px auto 0; border-bottom: 1px solid var(--cn-line); }
.cn-acc-item { border-top: 1px solid var(--cn-line); }
.cn-acc-item button {
  display: flex; justify-content: space-between; align-items: center; gap: 16px; width: 100%;
  padding: 20px 0; border: none; background: none; text-align: left;
  font-family: inherit; font-size: 16px; font-weight: 600; color: var(--cn-ink); cursor: pointer;
}
.cn-acc-item button:hover { color: var(--cn-maroon); }
.cn-acc-item button i { flex: none; font-size: 16px; color: var(--cn-maroon); }
.cn-acc-item p { padding: 0 40px 22px 0; font-size: 14px; line-height: 1.7; color: var(--cn-muted); }

/* Tablet & mobile */
@media (max-width: 900px) {
  .cn-layout { grid-template-columns: 1fr; }
  .cn-main { padding: 36px 0 48px; }
}

@media (max-width: 560px) {
  .cn-wrap { padding: 0 16px; }
  .cn-card { padding: 24px 18px 28px; }
  .cn-row { grid-template-columns: 1fr; gap: 0; }
  .cn-submit { width: 100%; }
  .cn-acc-item button { font-size: 15px; }
}
`;

export default function ContactPage() {
    const [form, setForm] = useState(EMPTY);
    const [status, setStatus] = useState("idle");
    const [open, setOpen] = useState(0);
    const [count] = useState(bagCount);

    const today = new Date().toISOString().slice(0, 10);
    const set = (name) => (e) => setForm({ ...form, [name]: e.target.value });

    const details = [
        { icon: "bi-geo-alt", label: "Visit us", text: CONTACT.address },
        { icon: "bi-envelope", label: "Email us", text: CONTACT.email, href: `mailto:${CONTACT.email}` },
        { icon: "bi-telephone", label: "Call us", text: CONTACT.phone, href: `tel:${CONTACT.phone.replace(/[^\d+]/g, "")}` },
        { icon: "bi-clock", label: "Opening hours", text: CONTACT.hours },
    ].filter((d) => d.text);

    const submit = async (e) => {
        e.preventDefault();
        if (form.website) return;
        setStatus("sending");

        if (FORM_ENDPOINT) {
            try {
                const res = await fetch(FORM_ENDPOINT, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Accept: "application/json" },
                    body: JSON.stringify({
                        name: form.name, email: form.email, phone: form.phone,
                        topic: form.topic, eventDate: form.date, message: form.message,
                    }),
                });
                setStatus(res.ok ? "sent" : "error");
            } catch {
                setStatus("error");
            }
            return;
        }

        const body = `Name: ${form.name}\nPhone: ${form.phone || "-"}\nEvent date: ${form.date || "-"}\n\n${form.message}`;
        window.location.href =
            `mailto:${CONTACT.email}?subject=${encodeURIComponent(`${form.topic} — message from ${form.name}`)}&body=${encodeURIComponent(body)}`;
        setStatus("mailto");
    };

    const sent = status === "sent" || status === "mailto";

    return (
        <div className="contact-page">
            <style>{CONTACT_CSS}</style>

            {/* Title (Left-aligned like Accessories) */}
            <div className="cn-head">
                <div className="cn-wrap">
                    <h1>Contact Us</h1>
                </div>
            </div>

            <main className="cn-main">
                <div className="cn-wrap cn-layout">
                    {/* ---------- Form ---------- */}
                    <div className="cn-card">
                        {sent ? (
                            <div className="cn-done">
                                <i className="bi bi-check-circle" />
                                <h2>{status === "sent" ? "Thank you!" : "Almost there!"}</h2>
                                <p>
                                    {status === "sent"
                                        ? `We've received your message and will reply to ${form.email}.`
                                        : <>Your email app should now open with your message ready. Just press Send. If nothing opens, email us at <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.</>}
                                </p>
                                <button type="button" className="cn-btn cn-btn--ghost" onClick={() => { setForm(EMPTY); setStatus("idle"); }}>
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2>Send us a message</h2>
                                <p className="cn-card-sub">Fill in the form and we&apos;ll be in touch.</p>

                                <form onSubmit={submit}>
                                    {status === "error" && (
                                        <div className="cn-error" role="alert">
                                            <i className="bi bi-exclamation-circle" />
                                            Sorry, your message could not be sent. Please try again, or email us at {CONTACT.email}.
                                        </div>
                                    )}

                                    <div className="cn-row">
                                        <label className="cn-field">
                                            <span>Full name</span>
                                            <input value={form.name} onChange={set("name")} placeholder="Aisha Khan" autoComplete="name" required />
                                        </label>
                                        <label className="cn-field">
                                            <span>Email</span>
                                            <input type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" autoComplete="email" required />
                                        </label>
                                    </div>

                                    <div className="cn-row">
                                        <label className="cn-field">
                                            <span>Phone <em>(optional)</em></span>
                                            <input type="tel" value={form.phone} onChange={set("phone")} placeholder="For quick updates"
                                                pattern="[0-9+\s\-]{10,15}" title="10–15 digits" autoComplete="tel" />
                                        </label>
                                        <label className="cn-field">
                                            <span>Event date <em>(optional)</em></span>
                                            <input type="date" value={form.date} onChange={set("date")} min={today} />
                                        </label>
                                    </div>

                                    <label className="cn-field">
                                        <span>What is this about?</span>
                                        <select value={form.topic} onChange={set("topic")}>
                                            {TOPICS.map((t) => (<option key={t}>{t}</option>))}
                                        </select>
                                    </label>

                                    <label className="cn-field">
                                        <span>Message</span>
                                        <textarea value={form.message} onChange={set("message")} minLength={10} required
                                            placeholder="Tell us about your event and the outfit you have in mind…" />
                                    </label>

                                    <div className="cn-hp" aria-hidden="true">
                                        <input tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} />
                                    </div>

                                    <button type="submit" className="cn-submit" disabled={status === "sending"}>
                                        {status === "sending" ? "Sending…" : <>Send message <i className="bi bi-arrow-right" /></>}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>

                    {/* ---------- Details ---------- */}
                    <aside className="cn-info">
                        {details.map((d) => (
                            <div className="cn-item" key={d.label}>
                                <i className={`bi ${d.icon}`} />
                                <div>
                                    <h3>{d.label}</h3>
                                    {d.href ? <a href={d.href}>{d.text}</a> : <p>{d.text}</p>}
                                </div>
                            </div>
                        ))}

                        {CONTACT.whatsapp && (
                            <a className="cn-btn cn-whatsapp" href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noreferrer">
                                <i className="bi bi-whatsapp" /> Chat on WhatsApp
                            </a>
                        )}
                    </aside>
                </div>
            </main>

            {/* ---------- FAQ ---------- */}
            <section className="cn-faq">
                <div className="cn-wrap">
                    <div className="cn-faq-head">
                        <h2>Frequently asked questions</h2>
                        <p>Quick answers about renting with RentWear.</p>
                    </div>
                    <div className="cn-acc">
                        {FAQS.map((f, n) => (
                            <div className="cn-acc-item" key={f.q}>
                                <button type="button" aria-expanded={open === n} onClick={() => setOpen(open === n ? -1 : n)}>
                                    {f.q}
                                    <i className={`bi ${open === n ? "bi-dash-lg" : "bi-plus-lg"}`} />
                                </button>
                                {open === n && <p>{f.a}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}