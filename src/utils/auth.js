/*
  DEMO sign-in, stored in this browser only (localStorage).
  Passwords are salted + hashed (SHA-256), never saved as plain text — but browser-only login is NOT real security.
  When you have a server, replace the bodies of signup() and login() with calls to your API
  (and let the server issue the session). The pages only rely on the { ok, error } results below.
*/

const USERS_KEY = "rentwear-users";
const SESSION_KEY = "rentwear-session";

const NO_CRYPTO = "Secure sign-in needs a secure connection. Please open the site over https.";
const NO_STORAGE = "We couldn't save your account on this device. Please allow site storage and try again.";

const readUsers = () => {
    try {
        const list = JSON.parse(localStorage.getItem(USERS_KEY));
        return Array.isArray(list) ? list : [];
    } catch {
        return [];
    }
};

const toHex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");

async function hash(salt, password) {
    const bytes = new TextEncoder().encode(`${salt}:${password}`);
    return toHex(new Uint8Array(await window.crypto.subtle.digest("SHA-256", bytes)));
}

function startSession(user, remember) {
    const data = JSON.stringify({ name: user.name, email: user.email, phone: user.phone });
    try {
        sessionStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(SESSION_KEY);
        (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, data);
    } catch {
        /* storage unavailable */
    }
}

/* The signed-in customer { name, email, phone } or null */
export function getSession() {
    try {
        const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function logout() {
    try {
        sessionStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(SESSION_KEY);
    } catch {
        /* storage unavailable */
    }
}

export async function signup({ name, email, phone, password, remember }) {
    if (!window.crypto?.subtle) return { ok: false, error: NO_CRYPTO };

    const users = readUsers();
    const cleanEmail = email.trim().toLowerCase();
    if (users.some((u) => u.email === cleanEmail)) {
        return { ok: false, error: "An account with this email already exists. Try logging in." };
    }

    const salt = toHex(window.crypto.getRandomValues(new Uint8Array(16)));
    const user = {
        name: name.trim(), email: cleanEmail, phone: phone.trim(),
        salt, passwordHash: await hash(salt, password),
    };
    try {
        localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
    } catch {
        return { ok: false, error: NO_STORAGE };
    }
    startSession(user, remember);
    return { ok: true };
}

export async function login({ email, password, remember }) {
    if (!window.crypto?.subtle) return { ok: false, error: NO_CRYPTO };

    const cleanEmail = email.trim().toLowerCase();
    const user = readUsers().find((u) => u.email === cleanEmail);
    const wrong = { ok: false, error: "The email or password is incorrect." };
    if (!user) return wrong;
    if ((await hash(user.salt, password)) !== user.passwordHash) return wrong;

    startSession(user, remember);
    return { ok: true };
}