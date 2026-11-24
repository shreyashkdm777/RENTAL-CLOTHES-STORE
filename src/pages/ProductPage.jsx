import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "../styles/App.css";
import "../styles/Productpage.css";
import { getItem, items, COLORS } from "../data/products.js";
import { addToBag, MAX_QTY } from "../utils/cart.js";
import { flyToBag } from "../utils/fly.js";

const price = (n) => "₹" + n.toLocaleString("en-IN");

const CROP_VIEWS = [
  { scale: 1, x: 50, y: 50 },
  { scale: 1.6, x: 50, y: 88 },
  { scale: 2, x: 30, y: 25 },
  { scale: 2.5, x: 68, y: 12 },
];

function Photo({ view, alt }) {
  return (
    <img
      src={view.src}
      alt={alt}
      style={{ transform: `scale(${view.scale})`, transformOrigin: `${view.x}% ${view.y}%` }}
    />
  );
}

function Stars({ rating }) {
  return (
    <span className="pd-stars" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <i key={n} className={`bi ${rating >= n ? "bi-star-fill" : rating >= n - 0.5 ? "bi-star-half" : "bi-star"}`} />
      ))}
    </span>
  );
}

export default function ProductPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = Number(searchParams.get("id"));
  const item = getItem(id);

  const [view, setView] = useState(0);
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState("details");
  const [guide, setGuide] = useState(false);
  const [added, setAdded] = useState(false);
  const mainRef = useRef(null);

  // Reset options whenever the user opens a different dress
  useEffect(() => {
    if (!item) return;
    setView(0);
    setColor(item.colors[0] || "Default");
    setSize(item.sizes.includes("M") ? "M" : item.sizes[0] || "Free size");
    setQty(1);
    setAdded(false);
    setOpen("details");
  }, [item]);

  const views = item
    ? item.gallery?.length
      ? item.gallery.map((src) => ({ src, scale: 1, x: 50, y: 50 }))
      : CROP_VIEWS.map((v) => ({ ...v, src: item.image }))
    : [];

  const minDate = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10);

  const add = (goToBag = false) => {
    if (!goToBag) flyToBag(mainRef.current, item.image);
    addToBag({
      id: item.id,
      name: item.name,
      image: item.image,
      rent: item.rent,
      color,
      size,
      eventDate: eventDate || undefined,
      qty,
    });
    if (goToBag) {
      navigate("/cart");
      return;
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const related = item
    ? items.filter((x) => x.id !== item.id && (x.category === item.category || x.category === "Accessories")).slice(0, 4)
    : [];

  const sections = item && [
    {
      id: "details",
      title: "Outfit Highlights & Craft",
      content: (
        <div>
          {item.fabric && <p style={{ marginBottom: 8 }}><strong>Fabric:</strong> {item.fabric}</p>}
          {item.occasion && <p style={{ marginBottom: 8 }}><strong>Ideal For:</strong> {item.occasion}</p>}
          {item.work && <p style={{ marginBottom: 8 }}><strong>Craft & Work:</strong> {item.work}</p>}
          {item.details?.length > 0 && (
            <ul style={{ paddingLeft: 16, marginTop: 6, display: "grid", gap: 4 }}>
              {item.details.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          )}
        </div>
      ),
    },
    {
      id: "fit",
      title: "Fabric & Fit",
      content: (
        <p>
          {item.fit ||
            (item.category === "Accessories"
              ? "Free size."
              : `${item.work ? item.work + " work. " : ""}Every outfit is altered to your measurements with our free fitting service.`)}
        </p>
      ),
    },
    {
      id: "care",
      title: "Care Instructions",
      content: (
        <p>
          Please don&apos;t wash or iron. We steam, sanitize, and dry-clean every outfit after each rental, so just send it back as worn.
        </p>
      ),
    },
    {
      id: "ship",
      title: "Shipping & Returns",
      content: (
        <p>
          Free doorstep delivery 2 days before your event and free pickup afterwards.
          {item.deposit ? ` Refundable security deposit of ${price(item.deposit)} is returned in full upon pickup.` : ""}
        </p>
      ),
    },
  ];

  return (
    <div className="product-page">
      <main className="pd-wrap">
        {!item ? (
          <div className="pd-missing">
            <h1>We couldn&apos;t find that outfit</h1>
            <Link to="/clothes" className="pd-add">BROWSE ALL OUTFITS</Link>
          </div>
        ) : (
          <>
            <nav className="pd-crumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link> /{" "}
              <Link to={`/clothes?category=${encodeURIComponent(item.category)}`}>{item.category}</Link> /{" "}
              <span>{item.name}</span>
            </nav>

            <div className="pd-layout" key={item.id}>
              {/* ---------- Gallery ---------- */}
              <div>
                <div className="pd-main" ref={mainRef}>
                  <Photo key={`${item.id}-${view}`} view={views[view]} alt={item.name} />
                  <span className="pd-emblem">R</span>
                </div>
                <div className="pd-thumbs">
                  {views.map((v, n) => (
                    <button
                      key={n}
                      type="button"
                      className={`pd-thumb ${n === view ? "is-on" : ""}`}
                      aria-label={`View ${n + 1}`}
                      onClick={() => setView(n)}
                    >
                      <Photo view={v} alt="" />
                    </button>
                  ))}
                </div>
              </div>

              {/* ---------- Details ---------- */}
              <div className="pd-info">
                <p style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pd-brown)", fontWeight: 600, marginBottom: 6 }}>
                  {item.brand} · {item.category}
                </p>
                <h1>{item.name}</h1>
                {item.subtitle && (
                  <p style={{ marginTop: 6, fontSize: 13, color: "var(--pd-muted)" }}>{item.subtitle}</p>
                )}

                {item.rating && (
                  <div className="pd-rating">
                    <Stars rating={item.rating} />
                    <span>{item.rating.toFixed(1)} ({item.reviews} verified rentals)</span>
                  </div>
                )}

                <p className="pd-price">
                  {price(item.rent)} <small>/ 2-day rental</small>
                  {item.retailValue && (
                    <small style={{ marginLeft: 10, textDecoration: "line-through" }}>
                      Retail {price(item.retailValue)}
                    </small>
                  )}
                </p>

                <hr />

                <p className="pd-desc">
                  {item.description ||
                    (item.work
                      ? `${item.name} by ${item.brand}, finished with ${item.work.toLowerCase()} detailing. Fitted to your measurements and delivered ready to wear for your event.`
                      : `${item.name} by ${item.brand}. A finishing touch for your look, delivered ready to wear for your event.`)}
                </p>

                <h2 className="pd-label">Color — {color}</h2>
                <div className="pd-swatches">
                  {item.colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      title={c}
                      aria-label={c}
                      aria-pressed={c === color}
                      className={c === color ? "is-on" : ""}
                      style={{ background: COLORS.find((x) => x.name === c)?.hex }}
                      onClick={() => setColor(c)}
                    />
                  ))}
                </div>

                {item.sizes.length > 0 && (
                  <>
                    <div className="pd-label-row">
                      <h2 className="pd-label">Size</h2>
                      <button type="button" className="pd-guide" onClick={() => setGuide(!guide)}>Size guide →</button>
                    </div>
                    <div className="pd-sizes">
                      {item.sizes.map((s) => (
                        <button
                          key={s}
                          type="button"
                          aria-pressed={s === size}
                          className={s === size ? "is-on" : ""}
                          onClick={() => setSize(s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    {guide && (
                      <p className="pd-guide-note">
                        Not sure? Choose the closest size. Every outfit is altered to your measurements with our free fitting service.
                      </p>
                    )}
                  </>
                )}

                <div style={{ marginTop: 22 }}>
                  <label className="pd-label" htmlFor="pd-event-date" style={{ display: "block", marginBottom: 8 }}>
                    Event Date <span style={{ fontWeight: 400, color: "var(--pd-muted)" }}>(optional — delivered 2 days prior)</span>
                  </label>
                  <input
                    id="pd-event-date"
                    type="date"
                    min={minDate}
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    style={{
                      height: 36,
                      padding: "0 12px",
                      border: "1px solid #d9d5cc",
                      borderRadius: 2,
                      fontSize: 12,
                      color: "var(--pd-ink)",
                      background: "#fff",
                    }}
                  />
                </div>

                <div className="pd-buy">
                  <div className="pd-qty" role="group" aria-label="Quantity">
                    <button type="button" aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                    <span>{qty}</span>
                    <button type="button" aria-label="Increase quantity" onClick={() => setQty(Math.min(MAX_QTY, qty + 1))}>+</button>
                  </div>
                  <button type="button" className="pd-add" onClick={() => add(false)}>
                    {added ? "ADDED TO BAG ✓" : `ADD TO BAG — ${price(item.rent * qty)}`}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => add(true)}
                  style={{
                    width: "100%",
                    height: 38,
                    marginTop: 10,
                    border: "1px solid #111",
                    borderRadius: 2,
                    background: "#fff",
                    color: "#111",
                    fontFamily: "var(--pd-mono)",
                    fontSize: "9.5px",
                    letterSpacing: "0.08em",
                  }}
                >
                  RENT NOW &amp; CHECKOUT
                </button>

                <ul className="pd-trust">
                  <li><i className="bi bi-check2" /> Free delivery &amp; pickup, fitted to your measurements</li>
                  <li><i className="bi bi-check2" /> Cleaned &amp; sanitized after every rental</li>
                  {item.deposit && (
                    <li><i className="bi bi-shield-check" /> Refundable security deposit: {price(item.deposit)}</li>
                  )}
                </ul>

                <div className="pd-acc">
                  {sections.map((s) => (
                    <div key={s.id} className="pd-acc-item">
                      <button type="button" aria-expanded={open === s.id} onClick={() => setOpen(open === s.id ? "" : s.id)}>
                        {s.title}
                        <i className={`bi ${open === s.id ? "bi-dash" : "bi-plus"}`} />
                      </button>
                      <div className={`pd-acc-panel ${open === s.id ? "is-open" : ""}`}>
                        <div>
                          <div style={{ paddingBottom: 16, fontSize: 11, lineHeight: 1.7, color: "var(--pd-muted)" }}>{s.content}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ---------- Complete the Look / Related Pieces ---------- */}
            {related.length > 0 && (
              <section style={{ marginTop: 72, paddingTop: 42, borderTop: "1px solid var(--pd-line)" }}>
                <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 24, fontWeight: 500, marginBottom: 24 }}>
                  Complete the Look
                </h2>
                <div className="product-grid" style={{ marginTop: 0 }}>
                  {related.map((rel) => (
                    <Link key={rel.id} to={`/product?id=${rel.id}`} className="product-card">
                      <div className="product-media">
                        <img src={rel.image} alt={rel.name} />
                      </div>
                      <div className="product-info">
                        <p className="product-label">{rel.brand}</p>
                        <h3 className="product-name">{rel.name}</h3>
                        <p className="product-price">
                          <small>Rent</small>
                          {price(rel.rent)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}