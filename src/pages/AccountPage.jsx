import { useEffect, useState } from "react";
import "../styles/App.css"; // reuses your existing header styles

const USERS_KEY = "rentwear-users";
const SESSION_KEY = "rentwear-session";
const ORDERS_KEY = "rentwear-orders";
const CART_KEY = "rentwear-cart";

const readJSON = (storage, key, fallback) => {
  try {
    const value = JSON.parse(storage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
};

const getSession = () => readJSON(sessionStorage, SESSION_KEY, null) || readJSON(localStorage, SESSION_KEY, null);

const readUsers = () => {
  const list = readJSON(localStorage, USERS_KEY, []);
  return Array.isArray(list) ? list : [];
};

const toHex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");

async function hash(salt, password) {
  const bytes = new TextEncoder().encode(`${salt}:${password}`);
  return toHex(new Uint8Array(await window.crypto.subtle.digest("SHA-256", bytes)));
}

const NO_USER = "We couldn't find your account on this device. Please log out and log in again.";

function updateProfile(email, { name, phone }) {
  try {
    const users = readUsers();
    const user = users.find((u) => u.email === email);
    if (!user) return { ok: false, error: NO_USER };
    user.name = name.trim();
    user.phone = phone.trim();
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const session = { name: user.name, email: user.email, phone: user.phone };
    const store = sessionStorage.getItem(SESSION_KEY) ? sessionStorage : localStorage;
    store.setItem(SESSION_KEY, JSON.stringify(session));
    return { ok: true, session };
  } catch {
    return { ok: false, error: "We couldn't save your details. Please allow site storage and try again." };
  }
}

async function changePassword(email, current, next) {
  if (!window.crypto?.subtle) return { ok: false, error: "Changing your password needs a secure (https) connection." };
  try {
    const users = readUsers();
    const user = users.find((u) => u.email === email);
    if (!user) return { ok: false, error: NO_USER };
    if ((await hash(user.salt, current)) !== user.passwordHash) {
      return { ok: false, error: "Your current password is incorrect." };
    }
    user.salt = toHex(window.crypto.getRandomValues(new Uint8Array(16)));
    user.passwordHash = await hash(user.salt, next);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return { ok: true };
  } catch {
    return { ok: false, error: "We couldn't update your password. Please try again." };
  }
}

function logout() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* storage unavailable */
  }
  window.location.href = "/login";
}

const money = (n) => "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatDate = (iso) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const STATUS = { placed: "Order placed", confirmed: "Confirmed", out: "Out for delivery", delivered: "Delivered", returned: "Picked up" };
const orderTotal = (o) => o.totals?.total ?? o.total ?? o.items.reduce((n, i) => n + i.rent * i.qty, 0);
const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "R";

const bagCount = () => readJSON(localStorage, CART_KEY, []).reduce((n, i) => n + i.qty, 0);

const TABS = [
  { id: "overview", label: "Overview", icon: "bi-grid" },
  { id: "profile", label: "Profile details", icon: "bi-person" },
  { id: "password", label: "Password", icon: "bi-shield-lock" },
];

const ACCOUNT_CSS = `
.account-page {
  margin-top: 0;
  --ac-ink: #1d1517;
  --ac-muted: #6e6266;
  --ac-maroon: #6b1d34;
  --ac-gold: #b08d57;
  --ac-line: #eadfd8;
  --ac-field: #d9ccc6;
  --ac-blush: #f8efe9;
  background: #fffdf9;
  color: var(--ac-ink);
  font-family: "DM Sans", Arial, sans-serif;
  min-height: 100vh;
}

.account-page .site-header { position: sticky; top: 0; }
.account-page .site-header .login-link { font-weight: 600; }

/* Title area — left-aligned like Accessories */
.ac-wrap { max-width: 1180px; margin: 0 auto; padding: 0 5%; }
.ac-head { border-bottom: 1px solid var(--ac-line); padding-top: 28px; padding-bottom: 24px; text-align: left; }
.ac-head-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  text-align: left;
}
.ac-head-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}
.ac-eyebrow { margin: 0; font-size: 11px; font-weight: 600; letter-spacing: 0.22em; color: var(--ac-gold); text-align: left; }
.ac-head h1 {
  margin: 8px 0 0;
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(30px, 3.6vw, 42px);
  font-weight: 500;
  line-height: 1.1;
  text-align: left;
}
.ac-head p { margin: 8px 0 0; font-size: 15px; color: var(--ac-muted); text-align: left; }

/* Buttons */
.ac-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  height: 44px; padding: 0 24px; border: 1px solid var(--ac-maroon); border-radius: 6px;
  background: var(--ac-maroon); color: #fff;
  font-family: inherit; font-size: 14px; font-weight: 500; cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.ac-btn:hover:not(:disabled) { background: #561628; border-color: #561628; }
.ac-btn:disabled { opacity: 0.6; cursor: default; }
.ac-btn--ghost { background: #fff; color: var(--ac-maroon); }
.ac-btn--ghost:hover:not(:disabled) { background: var(--ac-maroon); color: #fff; border-color: var(--ac-maroon); }

/* Layout */
.ac-main { padding: 40px 0 70px; }
.ac-layout { display: grid; grid-template-columns: 270px 1fr; gap: 28px; align-items: start; }

/* Sidebar */
.ac-side { position: sticky; top: 90px; background: #fff; border: 1px solid var(--ac-line); border-radius: 6px; overflow: hidden; }
.ac-me { padding: 26px 22px 22px; text-align: center; border-bottom: 1px solid var(--ac-line); }
.ac-avatar {
  width: 68px; height: 68px; margin: 0 auto; border-radius: 50%;
  background: var(--ac-maroon); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-family: "Playfair Display", Georgia, serif; font-size: 24px; font-weight: 500;
}
.ac-me h2 { margin-top: 12px; font-family: "Playfair Display", Georgia, serif; font-size: 19px; font-weight: 600; }
.ac-me p { margin-top: 4px; font-size: 13px; color: var(--ac-muted); word-break: break-all; }
.ac-nav { display: grid; padding: 8px; }
.ac-nav button, .ac-nav a {
  display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px 14px;
  border: none; border-left: 3px solid transparent; border-radius: 6px; background: none;
  font-family: inherit; font-size: 14px; color: var(--ac-ink); text-align: left; cursor: pointer;
}
.ac-nav i { font-size: 16px; color: var(--ac-muted); }
.ac-nav button:hover, .ac-nav a:hover { background: var(--ac-blush); }
.ac-nav .is-on { background: var(--ac-blush); border-left-color: var(--ac-maroon); color: var(--ac-maroon); font-weight: 600; }
.ac-nav .is-on i { color: var(--ac-maroon); }
.ac-nav .ac-out { margin-top: 6px; border-top: 1px solid var(--ac-line); border-radius: 0 0 6px 6px; color: var(--ac-muted); }

/* Panels */
.ac-panel { background: #fff; border: 1px solid var(--ac-line); border-radius: 6px; padding: 32px 34px 36px; }
.ac-panel h2 { font-family: "Playfair Display", Georgia, serif; font-size: 25px; font-weight: 500; }
.ac-panel-sub { margin: 6px 0 24px; font-size: 14px; color: var(--ac-muted); }
.ac-block { margin-top: 30px; }
.ac-block-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 14px; }
.ac-block-head h3 { font-family: "Playfair Display", Georgia, serif; font-size: 19px; font-weight: 500; }
.ac-block-head a { font-size: 13px; font-weight: 600; color: var(--ac-maroon); }
.ac-block-head a:hover { text-decoration: underline; }

/* Stat cards */
.ac-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.ac-stat { padding: 18px 20px; background: var(--ac-blush); border-radius: 6px; }
.ac-stat span { display: block; font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ac-gold); }
.ac-stat strong { display: block; margin-top: 8px; font-family: "Playfair Display", Georgia, serif; font-size: 26px; font-weight: 500; color: var(--ac-maroon); }

/* Recent orders */
.ac-orders { list-style: none; border: 1px solid var(--ac-line); border-radius: 6px; }
.ac-orders li {
  display: grid; grid-template-columns: 1.2fr 1fr auto auto; gap: 16px; align-items: center;
  padding: 16px 20px; border-top: 1px solid var(--ac-line); font-size: 14px;
}
.ac-orders li:first-child { border-top: none; }
.ac-orders strong { display: block; font-family: "Playfair Display", Georgia, serif; font-size: 16px; color: var(--ac-maroon); }
.ac-orders small { display: block; margin-top: 3px; font-size: 12px; color: var(--ac-muted); }
.ac-pill { padding: 4px 12px; border-radius: 999px; background: var(--ac-blush); border: 1px solid var(--ac-line); font-size: 11px; font-weight: 600; color: var(--ac-maroon); white-space: nowrap; }
.ac-orders a { font-size: 13px; font-weight: 600; color: var(--ac-maroon); }
.ac-orders a:hover { text-decoration: underline; }
.ac-empty { padding: 34px 20px; border: 1px dashed var(--ac-field); border-radius: 6px; text-align: center; font-size: 14px; color: var(--ac-muted); }
.ac-empty .ac-btn { margin-top: 16px; }

.ac-actions { display: flex; flex-wrap: wrap; gap: 12px; }

/* Forms */
.ac-form { max-width: 460px; }
.ac-field { display: block; margin-bottom: 16px; }
.ac-field > span { display: block; margin-bottom: 7px; font-size: 12px; font-weight: 600; }
.ac-field > span em { font-style: normal; font-weight: 400; color: var(--ac-muted); }
.ac-field input {
  width: 100%; height: 46px; padding: 0 14px;
  border: 1px solid var(--ac-field); border-radius: 6px; background: #fff;
  font-family: inherit; font-size: 14px; color: var(--ac-ink); outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.ac-field input:focus { border-color: var(--ac-maroon); box-shadow: 0 0 0 3px rgba(107, 29, 52, 0.12); }
.ac-field input:disabled { background: var(--ac-blush); color: var(--ac-muted); cursor: not-allowed; }
.ac-hint { margin-top: 6px; font-size: 12px; color: var(--ac-muted); }

.ac-note { display: flex; gap: 8px; align-items: flex-start; margin-bottom: 18px; padding: 11px 13px; border-radius: 6px; font-size: 13px; line-height: 1.4; }
.ac-note--ok { background: #f1f7ee; border: 1px solid #cfe3c8; color: #2f5d2a; }
.ac-note--error { background: #fbeeee; border: 1px solid #ecc9c9; color: #8a1f2d; }

/* Tablet & mobile */
@media (max-width: 900px) {
  .ac-layout { grid-template-columns: 1fr; }
  .ac-side { position: static; }
  .ac-me { display: flex; align-items: center; gap: 16px; text-align: left; padding: 18px 20px; }
  .ac-avatar { margin: 0; width: 54px; height: 54px; font-size: 20px; flex: none; }
  .ac-me h2 { margin-top: 0; }
  .ac-nav { display: flex; overflow-x: auto; gap: 4px; }
  .ac-nav button, .ac-nav a { width: auto; white-space: nowrap; padding: 10px 14px; border-left: none; border-bottom: 3px solid transparent; border-radius: 6px 6px 0 0; }
  .ac-nav .is-on { border-bottom-color: var(--ac-maroon); }
  .ac-nav .ac-out { margin-top: 0; border-top: none; border-radius: 6px 6px 0 0; }
}

@media (max-width: 560px) {
  .ac-wrap { padding: 0 16px; }
  .ac-head-row { flex-direction: column; align-items: flex-start; }
  .ac-panel { padding: 24px 18px 28px; }
  .ac-stats { grid-template-columns: 1fr; }
  .ac-orders li { grid-template-columns: 1fr auto; row-gap: 8px; }
  .ac-btn { width: 100%; }
}
`;

function Note({ note }) {
  if (!note) return null;
  return (
    <div className={`ac-note ac-note--${note.type}`} role={note.type === "error" ? "alert" : "status"}>
      <i className={`bi ${note.type === "ok" ? "bi-check-circle" : "bi-exclamation-circle"}`} /> {note.text}
    </div>
  );
}

export default function AccountPage() {
  const [session, setSession] = useState(getSession);
  const hash = window.location.hash.slice(1);
  const [tab, setTab] = useState(TABS.some((t) => t.id === hash) ? hash : "overview");
  const [orders] = useState(() => {
    const list = readJSON(localStorage, ORDERS_KEY, []);
    return Array.isArray(list) ? list : [];
  });
  const [count] = useState(bagCount);
  const [profile, setProfile] = useState({ name: session?.name || "", phone: session?.phone || "" });
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [note, setNote] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!session) window.location.replace("/login?next=%2Faccount");
  }, [session]);

  if (!session) return null;

  const go = (id) => {
    setTab(id);
    setNote(null);
    window.history.replaceState(null, "", id === "overview" ? window.location.pathname : `#${id}`);
  };

  const saveProfile = (e) => {
    e.preventDefault();
    const result = updateProfile(session.email, profile);
    if (result.ok) {
      setSession(result.session);
      setNote({ type: "ok", text: "Your details have been saved." });
    } else {
      setNote({ type: "error", text: result.error });
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (pw.next !== pw.confirm) {
      setNote({ type: "error", text: "The two new passwords don't match." });
      return;
    }
    setBusy(true);
    const result = await changePassword(session.email, pw.current, pw.next);
    setBusy(false);
    if (result.ok) {
      setPw({ current: "", next: "", confirm: "" });
      setNote({ type: "ok", text: "Your password has been changed." });
    } else {
      setNote({ type: "error", text: result.error });
    }
  };

  const firstName = session.name.split(" ")[0];
  const totalSpent = orders.reduce((n, o) => n + orderTotal(o), 0);

  return (
    <div className="account-page">
      <style>{ACCOUNT_CSS}</style>

      {/* Title (Left-aligned like Accessories) */}
      <div className="ac-head">
        <div className="ac-wrap">
          <div className="ac-head-row">
            <div className="ac-head-left">
              <p className="ac-eyebrow">MY ACCOUNT</p>
              <h1>Hello, {firstName}</h1>
              <p>Manage your details, orders and password in one place.</p>
            </div>
            <a href="/clothes" className="ac-btn">Browse outfits</a>
          </div>
        </div>
      </div>

      <main className="ac-main">
        <div className="ac-wrap ac-layout">
          {/* ---------- Sidebar ---------- */}
          <aside className="ac-side">
            <div className="ac-me">
              <div className="ac-avatar" aria-hidden="true">{initials(session.name)}</div>
              <div>
                <h2>{session.name}</h2>
                <p>{session.email}</p>
              </div>
            </div>
            <nav className="ac-nav" aria-label="Account">
              {TABS.map((t) => (
                <button key={t.id} type="button" className={tab === t.id ? "is-on" : ""} onClick={() => go(t.id)}>
                  <i className={`bi ${t.icon}`} /> {t.label}
                </button>
              ))}
              <a href="/orders"><i className="bi bi-bag" /> My orders</a>
              <button type="button" className="ac-out" onClick={logout}>
                <i className="bi bi-box-arrow-right" /> Log out
              </button>
            </nav>
          </aside>

          {/* ---------- Content ---------- */}
          <section className="ac-panel">
            {tab === "overview" && (
              <>
                <h2>Welcome back, {firstName}</h2>
                <p className="ac-panel-sub">Here&apos;s a quick look at your RentWear activity.</p>

                <div className="ac-stats">
                  <div className="ac-stat"><span>Orders placed</span><strong>{orders.length}</strong></div>
                  <div className="ac-stat"><span>Outfits in your bag</span><strong>{count}</strong></div>
                  <div className="ac-stat"><span>Total spent</span><strong>{money(totalSpent)}</strong></div>
                </div>

                <div className="ac-block">
                  <div className="ac-block-head">
                    <h3>Recent orders</h3>
                    {orders.length > 0 && <a href="/orders">View all →</a>}
                  </div>
                  {orders.length === 0 ? (
                    <div className="ac-empty">
                      You haven&apos;t placed an order yet.
                      <div><a href="/clothes" className="ac-btn">Browse outfits</a></div>
                    </div>
                  ) : (
                    <ul className="ac-orders">
                      {orders.slice(0, 3).map((o) => (
                        <li key={o.id}>
                          <div>
                            <strong>{o.id}</strong>
                            <small>{formatDate(o.placedAt)} · {o.items.reduce((n, i) => n + i.qty, 0)} item(s)</small>
                          </div>
                          <span className="ac-pill">{STATUS[o.status] || "Order placed"}</span>
                          <span>{money(orderTotal(o))}</span>
                          <a href={`/orders?id=${o.id}`}>View</a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="ac-block">
                  <div className="ac-block-head"><h3>Quick links</h3></div>
                  <div className="ac-actions">
                    <a href="/cart" className="ac-btn ac-btn--ghost"><i className="bi bi-bag" /> View my bag</a>
                    <a href="/contact" className="ac-btn ac-btn--ghost"><i className="bi bi-chat-dots" /> Contact us</a>
                  </div>
                </div>
              </>
            )}

            {tab === "profile" && (
              <>
                <h2>Profile details</h2>
                <p className="ac-panel-sub">Keep your details up to date so we can reach you about fittings and delivery.</p>
                <form className="ac-form" onSubmit={saveProfile}>
                  <Note note={note} />
                  <label className="ac-field">
                    <span>Full name</span>
                    <input value={profile.name} minLength={2} required autoComplete="name"
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                  </label>
                  <label className="ac-field">
                    <span>Email</span>
                    <input value={session.email} disabled />
                    <p className="ac-hint">This is your login email, so it can&apos;t be changed here.</p>
                  </label>
                  <label className="ac-field">
                    <span>Phone <em>(optional)</em></span>
                    <input type="tel" value={profile.phone} placeholder="For delivery & fitting updates"
                      pattern="[0-9+\s\-]{10,15}" title="10–15 digits" autoComplete="tel"
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                  </label>
                  <button type="submit" className="ac-btn">Save changes</button>
                </form>
              </>
            )}

            {tab === "password" && (
              <>
                <h2>Change password</h2>
                <p className="ac-panel-sub">Choose a new password of at least 8 characters.</p>
                <form className="ac-form" onSubmit={savePassword}>
                  <Note note={note} />
                  <label className="ac-field">
                    <span>Current password</span>
                    <input type="password" value={pw.current} required autoComplete="current-password"
                      onChange={(e) => setPw({ ...pw, current: e.target.value })} />
                  </label>
                  <label className="ac-field">
                    <span>New password</span>
                    <input type="password" value={pw.next} required minLength={8} autoComplete="new-password"
                      onChange={(e) => setPw({ ...pw, next: e.target.value })} />
                  </label>
                  <label className="ac-field">
                    <span>Confirm new password</span>
                    <input type="password" value={pw.confirm} required minLength={8} autoComplete="new-password"
                      onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
                  </label>
                  <button type="submit" className="ac-btn" disabled={busy}>{busy ? "Please wait…" : "Update password"}</button>
                </form>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}