import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../styles/App.css";
import "../styles/Clothingpage.css";
import { items, SIZES, CATEGORIES, WORKS, COLORS } from "../data/products.js";

const PER_PAGE = 12;
const MIN_PRICE = 500;
const MAX_PRICE = 17000;
const STEP = 500;

const formatPrice = (n) => "₹" + n.toLocaleString("en-IN");
const countBy = (key, value) => items.filter((i) => i[key] === value).length;

export default function ClothingPage() {
  const [searchParams] = useSearchParams();

  const [cats, setCats] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [price, setPrice] = useState([MIN_PRICE, MAX_PRICE]);
  const [colors, setColors] = useState([]);
  const [works, setWorks] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Sync filters when navigating from Navbar or Homepage links
  useEffect(() => {
    const startCat = searchParams.get("category");
    const startColor = searchParams.get("color");
    const startWork = searchParams.get("work");
    const startMax = Number(searchParams.get("maxPrice"));
    const startSearch = searchParams.get("search") || "";

    setCats(CATEGORIES.includes(startCat) ? [startCat] : []);
    setColors(COLORS.some((c) => c.name === startColor) ? [startColor] : []);
    setWorks(WORKS.includes(startWork) ? [startWork] : []);
    setPrice([MIN_PRICE, startMax >= MIN_PRICE && startMax <= MAX_PRICE ? startMax : MAX_PRICE]);
    setSearch(startSearch);
    setPage(1);
  }, [searchParams]);

  const toggle = (list, setList, value) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
    setPage(1);
  };

  const clearAll = () => {
    setCats([]);
    setSizes([]);
    setColors([]);
    setWorks([]);
    setSearch("");
    setPrice([MIN_PRICE, MAX_PRICE]);
    setPage(1);
  };

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = items.filter(
      (i) =>
        (!cats.length || cats.includes(i.category)) &&
        (!sizes.length || !i.sizes.length || i.sizes.some((s) => sizes.includes(s))) &&
        i.rent >= price[0] &&
        i.rent <= price[1] &&
        (!colors.length || i.colors.some((c) => colors.includes(c))) &&
        (!works.length || works.includes(i.work)) &&
        (!q ||
          i.name.toLowerCase().includes(q) ||
          i.brand.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          (i.subtitle && i.subtitle.toLowerCase().includes(q)))
    );
    if (sort === "low") return [...list].sort((a, b) => a.rent - b.rent);
    if (sort === "high") return [...list].sort((a, b) => b.rent - a.rent);
    return list;
  }, [cats, sizes, price, colors, works, search, sort]);

  const pages = Math.max(1, Math.ceil(visible.length / PER_PAGE));
  const current = Math.min(page, pages);
  const start = (current - 1) * PER_PAGE;
  const shown = visible.slice(start, start + PER_PAGE);

  const pct = (v) => ((v - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

  return (
    <div className="clothing-page">
      <main className="cl-main">
        <h1 className="cl-title">{cats.length === 1 ? cats[0] : "All Outfits"}</h1>
        <p className="cl-sub">{items.length} pieces, fitted to you and cleaned after every rental.</p>

        <div className="cl-layout">
          {/* ---------- Sidebar ---------- */}
          <aside className="cl-sidebar">
            <button type="button" className="cl-filter-toggle" onClick={() => setFiltersOpen(!filtersOpen)}>
              <i className="bi bi-sliders" /> {filtersOpen ? "Hide filters" : "Show filters"}
            </button>

            <div className={`cl-filters ${filtersOpen ? "is-open" : ""}`}>
              <div className="cl-filters-head">
                <span>FILTERS</span>
                <button type="button" onClick={clearAll}>Clear all</button>
              </div>

              <section className="cl-group">
                <h2>Category</h2>
                {CATEGORIES.map((c) => (
                  <label key={c} className="cl-check">
                    <input type="checkbox" checked={cats.includes(c)} onChange={() => toggle(cats, setCats, c)} />
                    <span>{c}</span>
                    <em>{countBy("category", c)}</em>
                  </label>
                ))}
              </section>

              <section className="cl-group">
                <h2>Size</h2>
                <div className="cl-sizes">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={sizes.includes(s) ? "is-on" : ""}
                      aria-pressed={sizes.includes(s)}
                      onClick={() => toggle(sizes, setSizes, s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </section>

              <section className="cl-group">
                <h2>Rent price</h2>
                <div className="cl-range">
                  <div className="cl-range-track" />
                  <div className="cl-range-fill" style={{ left: pct(price[0]) + "%", width: pct(price[1]) - pct(price[0]) + "%" }} />
                  <input
                    type="range"
                    min={MIN_PRICE}
                    max={MAX_PRICE}
                    step={STEP}
                    value={price[0]}
                    aria-label="Minimum price"
                    onChange={(e) => {
                      setPrice([Math.min(+e.target.value, price[1] - STEP), price[1]]);
                      setPage(1);
                    }}
                  />
                  <input
                    type="range"
                    min={MIN_PRICE}
                    max={MAX_PRICE}
                    step={STEP}
                    value={price[1]}
                    aria-label="Maximum price"
                    onChange={(e) => {
                      setPrice([price[0], Math.max(+e.target.value, price[0] + STEP)]);
                      setPage(1);
                    }}
                  />
                </div>
                <div className="cl-range-labels">
                  <span>{formatPrice(price[0])}</span>
                  <span>{formatPrice(price[1])}</span>
                </div>
              </section>

              <section className="cl-group">
                <h2>Color</h2>
                <div className="cl-swatches">
                  {COLORS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      title={c.name}
                      aria-label={c.name}
                      aria-pressed={colors.includes(c.name)}
                      className={colors.includes(c.name) ? "is-on" : ""}
                      style={{ background: c.hex }}
                      onClick={() => toggle(colors, setColors, c.name)}
                    />
                  ))}
                </div>
              </section>

              <section className="cl-group">
                <h2>Embellishment</h2>
                {WORKS.map((w) => (
                  <label key={w} className="cl-check">
                    <input type="checkbox" checked={works.includes(w)} onChange={() => toggle(works, setWorks, w)} />
                    <span>{w}</span>
                    <em>{countBy("work", w)}</em>
                  </label>
                ))}
              </section>
            </div>
          </aside>

          {/* ---------- Results ---------- */}
          <section className="cl-results">
            <div className="cl-toolbar">
              <span>
                {visible.length
                  ? `Showing ${start + 1}-${start + shown.length} of ${visible.length}`
                  : "Showing 0 of 0"}
              </span>
              <label className="cl-sort">
                <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} aria-label="Sort">
                  <option value="newest">Sort: Newest first</option>
                  <option value="low">Sort: Price, low to high</option>
                  <option value="high">Sort: Price, high to low</option>
                </select>
              </label>
            </div>

            {shown.length ? (
              <div className="cl-grid">
                {shown.map((p) => (
                  <Link to={`/product?id=${p.id}`} className="cl-card" key={p.id}>
                    <div className="cl-media">
                      {p.isNew && <span className="cl-badge">NEW</span>}
                      <img src={p.image} alt={p.name} />
                    </div>
                    <div className="cl-line">
                      <h3>{p.name}</h3>
                      <span>{formatPrice(p.rent)}</span>
                    </div>
                    <p className="cl-meta">{p.brand} · {p.colors[0]}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="cl-empty">
                <p>No outfits match these filters.</p>
                <button type="button" onClick={clearAll}>Clear all filters</button>
              </div>
            )}

            <nav className="cl-pages" aria-label="Pagination">
              {Array.from({ length: pages }, (_, n) => n + 1).map((n) => (
                <button key={n} type="button" className={n === current ? "is-on" : ""} onClick={() => setPage(n)}>
                  {n}
                </button>
              ))}
              <button type="button" className="cl-next" disabled={current === pages} onClick={() => setPage(current + 1)}>
                Next <i className="bi bi-arrow-right" />
              </button>
            </nav>
          </section>
        </div>
      </main>
    </div>
  );
}