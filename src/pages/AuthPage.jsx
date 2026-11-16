import { useState } from "react";
import "../styles/App.css"; // reuses your existing header styles
import { bagCount } from "../utils/cart.js";
import { signup, login, getSession, logout } from "../utils/auth.js";

/* All styles for the login and signup pages live here, so there is no separate CSS file to lose. */
const AUTH_CSS = `
/* Login & Sign up pages — every rule is scoped to .auth-page / "au-" classes, so no other page is affected.
   Colors are your RentWear theme: maroon #6b1d34, ink #1d1517, muted #6e6266, gold #b08d57, blush #f8efe9. */

.auth-page {
  margin-top: 0; /* cancels the 61px top padding App.css puts on <body>, so no global body rule is needed */
  --au-ink: #1d1517;
  --au-muted: #6e6266;
  --au-maroon: #6b1d34;
  --au-gold: #b08d57;
  --au-blush: #fffdf9;
  --au-line: #eadfd8;
  --au-field: #d9ccc6;
  --au-tile: #f1e8e1;
  background: #fff;
  color: var(--au-ink);
  font-family: "DM Sans", Arial, sans-serif;
  min-height: 100vh;
}

/* The header from App.css is fixed; here it sits under the announcement bar and sticks on scroll */
.auth-page .site-header { position: sticky; top: 0; }
.auth-page .site-header .login-link { font-weight: 600; }

/* Announcement bar */
.au-announce {
  display: flex; justify-content: space-between; align-items: center;
  padding: 9px 5%; background: #f8e5df;
  font-size: 11px; font-weight: 500; letter-spacing: 0.04em; color: var(--au-maroon);
}
.au-locale { display: flex; gap: 26px; }
.au-locale button {
  border: none; background: none; font-size: 10px; color: var(--au-ink);
  display: flex; align-items: center; gap: 6px;
}
.au-locale i { font-size: 9px; }

/* Layout: just the form card, centered */
.au-layout { min-height: calc(100vh - 110px); background: var(--au-blush); display: flex; }

/* Form side */
.au-side { flex: 1; display: flex; align-items: center; justify-content: center; padding: 48px 24px; }
.au-card {
  width: 100%; max-width: 430px; padding: 38px 36px;
  background: #fff; border: 1px solid var(--au-line); border-radius: 6px;
  box-shadow: 0 10px 40px rgba(107, 29, 52, 0.06);
}
.au-card h1 { font-family: "Playfair Display", Georgia, serif; font-size: 30px; font-weight: 500; line-height: 1.15; }
.au-sub { margin: 8px 0 24px; font-size: 14px; line-height: 1.5; color: var(--au-muted); }

.au-error {
  display: flex; gap: 8px; align-items: flex-start; margin-bottom: 16px; padding: 11px 13px;
  background: #fbeeee; border: 1px solid #ecc9c9; border-radius: 6px;
  font-size: 13px; line-height: 1.4; color: #8a1f2d;
}

.au-field { display: block; margin-bottom: 16px; }
.au-field > span { display: block; margin-bottom: 7px; font-size: 12px; font-weight: 600; }
.au-field input {
  width: 100%; height: 46px; padding: 0 14px;
  border: 1px solid var(--au-field); border-radius: 6px; background: #fff;
  font-family: inherit; font-size: 14px; color: var(--au-ink); outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.au-field input::placeholder { color: #a89b96; }
.au-field input:focus { border-color: var(--au-maroon); box-shadow: 0 0 0 3px rgba(107, 29, 52, 0.12); }

.au-pass { position: relative; }
.au-pass input { padding-right: 44px; }
.au-pass button {
  position: absolute; top: 0; right: 0; width: 44px; height: 46px;
  border: none; background: none; font-size: 16px; color: var(--au-muted);
}
.au-pass button:hover { color: var(--au-maroon); }

/* Password strength */
.au-meter { display: flex; align-items: center; gap: 10px; margin: -6px 0 16px; font-size: 11px; color: var(--au-muted); }
.au-meter div { display: flex; gap: 4px; flex: 1; }
.au-meter i { height: 4px; flex: 1; border-radius: 2px; background: var(--au-line); }
.au-meter i.is-on { background: var(--au-gold); }

.au-check { display: flex; align-items: center; gap: 9px; margin: 4px 0 20px; font-size: 13px; color: var(--au-muted); cursor: pointer; }
.au-check input { width: 16px; height: 16px; margin: 0; accent-color: var(--au-maroon); cursor: pointer; }

/* Buttons */
.au-submit, .au-btn {
  display: flex; align-items: center; justify-content: center; width: 100%; height: 48px;
  border: 1px solid var(--au-maroon); border-radius: 6px;
  background: var(--au-maroon); color: #fff;
  font-family: inherit; font-size: 14px; font-weight: 500; cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.au-submit:hover:not(:disabled), .au-btn:hover { background: #561628; border-color: #561628; }
.au-submit:disabled { opacity: 0.6; cursor: default; }
.au-btn { margin-top: 12px; }
.au-btn--ghost { background: #fff; color: var(--au-maroon); }
.au-btn--ghost:hover { background: var(--au-maroon); color: #fff; }

.au-switch { margin-top: 22px; text-align: center; font-size: 13px; color: var(--au-muted); }
.au-switch a { font-weight: 600; color: var(--au-maroon); }
.au-switch a:hover { text-decoration: underline; }

/* Already signed in */
.au-done { text-align: center; }
.au-done > i { font-size: 36px; color: var(--au-maroon); }
.au-done h1 { margin-top: 10px; }
.au-done p { margin: 10px 0 14px; font-size: 14px; line-height: 1.6; color: var(--au-muted); }
.au-link { margin-top: 16px; border: none; background: none; font-size: 13px; color: var(--au-muted); text-decoration: underline; }
.au-link:hover { color: var(--au-maroon); }

/* Tablet & mobile */
@media (max-width: 900px) {
  .au-layout { min-height: 0; }
  .au-side { padding: 36px 16px 60px; }
}

@media (max-width: 560px) {
  .au-locale { display: none; }
  .au-announce span { font-size: 10px; }
  .au-card { padding: 28px 20px; }
}
`;

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Lehengas", href: "/clothes?category=Lehengas" },
  { label: "Gowns", href: "/clothes?category=Gowns" },
  { label: "Shararas", href: "/clothes?category=Shararas" },
  { label: "Accessories", href: "/clothes?category=Accessories" },
];

const STRENGTH = ["", "Weak", "Okay", "Good", "Strong"];

function strength(pw) {
  if (!pw) return 0;
  let n = 0;
  if (pw.length >= 8) n++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) n++;
  if (/\d/.test(pw)) n++;
  if (/[^A-Za-z0-9]/.test(pw)) n++;
  return Math.max(1, n);
}

// Only allow redirects back into this website (never to another domain)
const safeNext = (value) => (value && /^\/(?!\/)/.test(value) ? value : "/account");

function Field({ label, name, form, setForm, ...rest }) {
  return (
    <label className="au-field">
      <span>{label}</span>
      <input name={name} value={form[name]} onChange={(e) => setForm({ ...form, [name]: e.target.value })} {...rest} />
    </label>
  );
}

function PasswordField({ label, name, form, setForm, ...rest }) {
  const [show, setShow] = useState(false);
  return (
    <label className="au-field">
      <span>{label}</span>
      <div className="au-pass">
        <input
          name={name} type={show ? "text" : "password"} value={form[name]} required
          onChange={(e) => setForm({ ...form, [name]: e.target.value })} {...rest}
        />
        <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}>
          <i className={`bi ${show ? "bi-eye-slash" : "bi-eye"}`} />
        </button>
      </div>
    </label>
  );
}

export default function AuthPage({ mode = "login" }) {
  // Which page is this? Taken from the address (/signup), with data-mode in the HTML as a backup
  const isSignup = mode === "signup" || /signup/i.test(window.location.pathname);
  const next = safeNext(new URLSearchParams(window.location.search).get("next"));
  const nextQuery = next === "/account" ? "" : `?next=${encodeURIComponent(next)}`;

  const [session, setSession] = useState(getSession);
  const [count] = useState(bagCount);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "", remember: true, terms: false });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const level = strength(form.password);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (isSignup && form.password !== form.confirm) {
      setError("The two passwords don't match.");
      return;
    }
    setBusy(true);
    const result = isSignup ? await signup(form) : await login(form);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    window.location.href = next;
  };

  return (
    <div className="auth-page">
      <style>{AUTH_CSS}</style>

      {/* Shared navigation is rendered by App.jsx */}
<main className="au-layout">
        {/* ---------- Form ---------- */}
        <section className="au-side">
          <div className="au-card">
            {session ? (
              <div className="au-done">
                <i className="bi bi-person-check" />
                <h1>You&apos;re signed in</h1>
                <p>{session.name}<br />{session.email}</p>
                <a href="/account" className="au-btn">My account</a>
                <a href="/clothes" className="au-btn au-btn--ghost">Continue shopping</a>
                <button type="button" className="au-link" onClick={() => { logout(); setSession(null); }}>Log out</button>
              </div>
            ) : (
              <>
                <h1>{isSignup ? "Create your account" : "Welcome back"}</h1>
                <p className="au-sub">
                  {isSignup
                    ? "Join RentWear to rent designer wear and track your orders."
                    : "Log in to rent faster and track your orders."}
                </p>

                <form onSubmit={submit} noValidate={false}>
                  {error && <div className="au-error" role="alert"><i className="bi bi-exclamation-circle" /> {error}</div>}

                  {isSignup && (
                    <Field label="Full name" name="name" form={form} setForm={setForm}
                      placeholder="Aisha Khan" autoComplete="name" required />
                  )}
                  <Field label="Email" name="email" form={form} setForm={setForm} type="email"
                    placeholder="you@example.com" autoComplete="email" required />
                  {isSignup && (
                    <Field label="Phone" name="phone" form={form} setForm={setForm} type="tel"
                      placeholder="For delivery &amp; fitting updates" pattern="[0-9+\s\-]{10,15}"
                      title="10–15 digits" autoComplete="tel" required />
                  )}

                  <PasswordField label="Password" name="password" form={form} setForm={setForm}
                    placeholder={isSignup ? "At least 8 characters" : "Your password"}
                    autoComplete={isSignup ? "new-password" : "current-password"} minLength={isSignup ? 8 : undefined} />

                  {isSignup && form.password && (
                    <div className="au-meter" aria-live="polite">
                      <div>{[1, 2, 3, 4].map((n) => (<i key={n} className={n <= level ? "is-on" : ""} />))}</div>
                      <span>{STRENGTH[level]}</span>
                    </div>
                  )}

                  {isSignup && (
                    <PasswordField label="Confirm password" name="confirm" form={form} setForm={setForm}
                      placeholder="Re-enter your password" autoComplete="new-password" />
                  )}

                  {isSignup ? (
                    <label className="au-check">
                      <input type="checkbox" checked={form.terms} required
                        onChange={(e) => setForm({ ...form, terms: e.target.checked })} />
                      <span>I agree to the rental terms and privacy policy</span>
                    </label>
                  ) : (
                    <label className="au-check">
                      <input type="checkbox" checked={form.remember}
                        onChange={(e) => setForm({ ...form, remember: e.target.checked })} />
                      <span>Keep me logged in</span>
                    </label>
                  )}

                  <button type="submit" className="au-submit" disabled={busy}>
                    {busy ? "Please wait…" : isSignup ? "Create account" : "Log in"}
                  </button>
                </form>

                <p className="au-switch">
                  {isSignup ? (
                    <>Already have an account? <a href={`/login${nextQuery}`}>Log in</a></>
                  ) : (
                    <>New to RentWear? <a href={`/signup${nextQuery}`}>Create an account</a></>
                  )}
                </p>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}