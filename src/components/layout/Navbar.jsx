
import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate
} from "react-router-dom";

import { bagCount } from "../../utils/cart.js";

export default function Navbar() {
  const [count, setCount] = useState(bagCount);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Update cart count when page changes
  useEffect(() => {
    setCount(bagCount());
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  // Listen for cart updates
  useEffect(() => {
    const updateBag = () => setCount(bagCount());

    window.addEventListener("storage", updateBag);
    window.addEventListener("rentwear-cart-updated", updateBag);

    return () => {
      window.removeEventListener("storage", updateBag);
      window.removeEventListener("rentwear-cart-updated", updateBag);
    };
  }, []);

  // Soft shadow once the page has scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Product search
  const handleSearch = (event) => {
    event.preventDefault();

    const q = query.trim();

    navigate(
      q
        ? `/clothes?search=${encodeURIComponent(q)}`
        : "/clothes"
    );

    setMenuOpen(false);
  };

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>

      {/* Mobile menu button */}
      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        <span key={menuOpen ? "close" : "open"} className="menu-glyph">
          {menuOpen ? "✕" : "☰"}
        </span>
      </button>

      {/* Navigation links */}
      <nav
        className={`category-nav ${menuOpen ? "show-menu" : ""}`}
        aria-label="Main navigation"
      >
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/clothes">Clothes</NavLink>
        <Link to="/clothes?category=Accessories">
          Accessories
        </Link>
        <NavLink to="/contact">Contact</NavLink>
      </nav>

      {/* Website logo */}
      <Link to="/" className="brand">
        Rent<span>Wear</span>
      </Link>

      {/* Right side actions */}
      <div className="header-actions">

        {/* Search */}
        <form className="search-box" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="Search"
            aria-label="Search products"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        <span className="header-divider" />

        {/* Orders */}
        <Link
          to="/orders"
          className="icon-button"
          aria-label="My orders"
        >
          <img src="/icons/heart.png" alt="" />
        </Link>

        {/* Cart */}
        <Link
          to="/cart"
          className="icon-button bag-icon"
          aria-label="Shopping bag"
        >
          <img src="/icons/cart.png" alt="" />

          {count > 0 && (
            <span key={count} className="bag-count">{count}</span>
          )}
        </Link>

        {/* Account */}
        <Link
          to="/account"
          className="icon-button"
          aria-label="Account"
        >
          <img src="/icons/profile-icon.png" alt="" />
        </Link>

        {/* Login */}
        <Link to="/login" className="login-link">
          Login
        </Link>

      </div>
    </header>
  );
}
