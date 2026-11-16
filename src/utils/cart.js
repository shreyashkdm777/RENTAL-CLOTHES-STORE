/* Settings and helpers shared by the Cart and Checkout pages — edit your settings here */

export const STORAGE_KEY = "rentwear-cart";   // other pages can add items by writing to this key
export const PROMO_KEY = "rentwear-promo";    // remembers the promo code applied in the bag
export const ORDERS_KEY = "rentwear-orders";  // placed orders, saved on this device
export const TAX_RATE = 0.05;                 // estimated tax — set your real GST rate
export const PROMOS = { WELCOME10: 0.1 };     // promo code -> discount (0.1 = 10%)
export const EXPRESS_FEE = 499;               // express delivery charge in ₹
export const MAX_QTY = 10;
export const SHOW_DEMO_BAG = false;           // true = an empty bag shows 3 sample outfits (design preview only)

// Shown the first time the pages open (until the bag is changed), so you can preview the design
export const DEMO_CART = [
  { id: 4, name: "Pastel Sequin Lehenga", image: "/images/products/product-4.png", rent: 12000, color: "Pink", size: "M", qty: 1 },
  { id: 7, name: "Black Sequin Gown", image: "/images/products/product-7.png", rent: 7500, color: "Black", size: "S", qty: 1 },
  { id: 101, name: "Polki Necklace Set", image: "/images/accessories/accessory-1.png", rent: 2500, color: "Gold", size: "Free size", qty: 1 },
];

export const money = (n) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const lineKey = (i) => `${i.id}-${i.size}-${i.color}`;

export function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : SHOW_DEMO_BAG ? DEMO_CART : [];
  } catch {
    return SHOW_DEMO_BAG ? DEMO_CART : [];
  }
}

export function loadPromo() {
  try {
    const code = localStorage.getItem(PROMO_KEY);
    return code && PROMOS[code] ? { code, rate: PROMOS[code] } : null;
  } catch {
    return null;
  }
}

export function savePromo(code) {
  try {
    if (code) localStorage.setItem(PROMO_KEY, code);
    else localStorage.removeItem(PROMO_KEY);
  } catch {
    /* storage unavailable */
  }
}

export function clearBag() {
  try {
    localStorage.setItem(STORAGE_KEY, "[]");
    localStorage.removeItem(PROMO_KEY);
    window.dispatchEvent(new Event("rentwear-cart-updated"));
  } catch {
    /* storage unavailable */
  }
}

/* Adds an outfit to the saved bag and returns the new total quantity (null if storage is unavailable) */
export function addToBag(item) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const bag = raw ? JSON.parse(raw) : [];
    const found = bag.find((i) => lineKey(i) === lineKey(item));
    if (found) found.qty = Math.min(MAX_QTY, found.qty + item.qty);
    else bag.push(item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bag));
    window.dispatchEvent(new Event("rentwear-cart-updated"));
    return bag.reduce((n, i) => n + i.qty, 0);
  } catch {
    return null;
  }
}

/* Total quantity currently in the saved bag (for the header badge) */
export function bagCount() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw).reduce((n, i) => n + i.qty, 0) : 0;
  } catch {
    return 0;
  }
}

/* Labels shown on the Orders page */
export const SHIPPING_LABELS = {
  standard: "Standard — 3–5 business days",
  express: "Express — 1–2 business days",
};
export const PAYMENT_LABELS = { card: "Credit / debit card", upi: "UPI", cod: "Pay on delivery" };

/* Placed orders, newest first. (Saved in this browser only — replace with your server when you have one.) */
export function loadOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveOrder(order) {
  try {
    const list = loadOrders();
    list.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable */
  }
}