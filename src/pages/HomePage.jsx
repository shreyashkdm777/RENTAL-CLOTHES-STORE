import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/App.css";
import { addToBag } from "../utils/cart.js";

// 2. Service highlights shown below the hero banner
const services = [
  { icon: "bi-gem", title: "Authentic Designer Wear", description: "Curated pieces from premium labels" },
  { icon: "bi-scissors", title: "Free Fitting", description: "Altered to your measurements" },
  { icon: "bi-truck", title: "Delivery & Pickup", description: "Right to your doorstep" },
  { icon: "bi-stars", title: "Cleaned After Every Rental", description: "Fresh and ready to wear" },
];

// 3. Featured collections cards (shown below customer reviews)
const collections = [
  { id: 1, productId: 1, image: "/images/collections/collection-1.png", alt: "Featured look 1", bg: "#c4bdb6" },
  { id: 2, productId: 2, image: "/images/collections/collection-2.png", alt: "Featured look 2", bg: "#e4ddd5" },
  { id: 3, productId: 3, image: "/images/collections/collection-3.png", alt: "Featured look 3", bg: "#d3d0cd" },
  {
    id: 4,
    productId: 4,
    image: "/images/collections/collection-4.png",
    alt: "Featured look 4",
    bg: "#d9d9d9",
    featured: true,
    price: "₹10,000",
  },
  { id: 5, productId: 5, image: "/images/collections/collection-5.png", alt: "Featured look 5", bg: "#c9b49c" },
  { id: 6, productId: 6, image: "/images/collections/collection-6.png", alt: "Featured look 6", bg: "#e0d9cc" },
  { id: 7, productId: 7, image: "/images/collections/collection-7.png", alt: "Featured look 7", bg: "#e6e1dc" },
];

const centerIndex = collections.findIndex((item) => item.featured);

// 4. Main outfits list
const products = [
  { id: 1, label: "Atelier Noor", name: "Multicolour Lehenga With Bead & Thread Embroidery", category: "Lehengas", rent: 5000, trending: true, image: "/images/products/product-1.png" },
  { id: 2, label: "House of Zari", name: "Mustard Applique Lehenga With Mirror Work", category: "Lehengas", rent: 5000, trending: true, image: "/images/products/product-2.png" },
  { id: 3, label: "Mira & Co.", name: "Magenta Sharara Set With Floral Thread Work", category: "Shararas", rent: 5000, trending: false, image: "/images/products/product-3.png" },
  { id: 4, label: "Kaveri Couture", name: "Pastel Pink Lehenga With Sequin Florals", category: "Lehengas", rent: 5000, trending: true, image: "/images/products/product-4.png" },
  { id: 5, label: "Siya Bridal", name: "Maroon Gharara Set With Golden Zardozi", category: "Shararas", rent: 5000, trending: false, image: "/images/products/product-5.png" },
  { id: 6, label: "Atelier Noor", name: "Powder Blue Lehenga With Pearl & Bead Work", category: "Lehengas", rent: 5000, trending: true, image: "/images/products/product-6.png" },
  { id: 7, label: "Mira & Co.", name: "Black Sequin Gown With Thigh Slit", category: "Gowns", rent: 5000, trending: true, image: "/images/products/product-7.png" },
  { id: 8, label: "House of Zari", name: "Wine Satin Cowl-Neck Evening Gown", category: "Gowns", rent: 5000, trending: false, image: "/images/products/product-8.png" },
];

const filterOptions = ["All", "Lehengas", "Gowns", "Shararas"];

// 5. Occasion cards
const occasions = [
  { id: "mehendi", title: "Mehendi Brights", note: "Yellows, greens and playful prints", to: "/clothes?color=Yellow", image: "/images/occasions/mehendi.png", tone: "#c9a43a" },
  { id: "sangeet", title: "Sangeet Sparkle", note: "Sequins and beadwork made for the dance floor", to: "/clothes?work=Sequin", image: "/images/occasions/sangeet.png", tone: "#8a3b62" },
  { id: "bridal", title: "Bridal Reds", note: "Classic reds and rich zardozi", to: "/clothes?color=Maroon", image: "/images/occasions/bridal.png", tone: "#8f1f2e" },
  { id: "pastel", title: "Pastel Receptions", note: "Soft blush, mint and powder blue", to: "/clothes?color=Pink", image: "/images/occasions/pastel.png", tone: "#c9a9b4" },
  { id: "gala", title: "Black Gown Nights", note: "Evening gowns for cocktails and galas", to: "/clothes?category=Gowns", image: "/images/occasions/gala.png", tone: "#2b2327" },
  { id: "budget", title: "Under ₹5,000", note: "Premium looks at friendlier prices", to: "/clothes?maxPrice=5000", image: "/images/occasions/under-5k.png", tone: "#b08d57" },
];

// 6. How renting works steps
const steps = [
  { id: 1, title: "Choose your outfit", text: "Browse by occasion or category and pick your event date." },
  { id: 2, title: "Book and try", text: "Reserve with a small advance. We fit and alter it to you." },
  { id: 3, title: "Wear it", text: "It arrives steamed, styled and ready for the big day." },
  { id: 4, title: "Return it", text: "Send it back after the event. No cleaning, no storage." },
];

// 7. Accessories list
const accessories = [
  { id: 101, label: "Atelier Noor", name: "Polki Bridal Necklace Set", rent: 2500, image: "/images/accessories/accessory-1.png" },
  { id: 102, label: "House of Zari", name: "Pearl & Kundan Earrings", rent: 1200, image: "/images/accessories/accessory-2.png" },
  { id: 103, label: "Mira & Co.", name: "Embroidered Potli Clutch", rent: 900, image: "/images/accessories/accessory-3.png" },
  { id: 104, label: "Siya Bridal", name: "Gold Mathapatti With Pearl Drops", rent: 1500, image: "/images/accessories/accessory-4.png" },
];

// 8. Customer reviews
const testimonials = [
  {
    id: 1,
    name: "Aisha Khan",
    title: "The Perfect Lehenga for My Sister's Wedding",
    text: "It arrived steamed, fitted and right on time. I got more compliments than I could count, and returning it was effortless.",
    rating: 5,
    avatar: "/images/avatars/avatar-1.png",
  },
  {
    id: 2,
    name: "Meera Shah",
    title: "Three Functions, Three Designer Looks",
    text: "I rented outfits for the mehendi, sangeet and reception for less than one dress would have cost me to buy.",
    rating: 5,
    avatar: "/images/avatars/avatar-2.png",
  },
  {
    id: 3,
    name: "Sana Patel",
    title: "Quality That Looks Brand New",
    text: "The embroidery was flawless and the fitting advice was spot on. I will rent again for every wedding season.",
    rating: 5,
    avatar: "/images/avatars/avatar-3.png",
  },
  {
    id: 4,
    name: "Riya Desai",
    title: "My Go-To for Cocktail Nights",
    text: "The black gown I rented fit like it was made for me. Booking and pickup took no effort at all.",
    rating: 4,
    avatar: "/images/avatars/avatar-4.png",
  },
  {
    id: 5,
    name: "Nikita Rao",
    title: "Stress-Free From Booking to Return",
    text: "The team answered every question and helped me match jewellery to my saree. Truly a premium experience.",
    rating: 5,
    avatar: "/images/avatars/avatar-5.png",
  },
];

// 9. Blog posts
const blogs = [
  {
    id: 1,
    title: "Day Wedding or Night Reception? How to Choose Your Outfit",
    excerpt: "Fabrics, colours and silhouettes that work for each time of day.",
    image: "/images/blogs/blog-1.png",
  },
  {
    id: 2,
    title: "The Mehendi Colour Guide: Brights That Photograph Beautifully",
    excerpt: "Pick shades that glow in daylight and look great in photos.",
    image: "/images/blogs/blog-2.png",
  },
  {
    id: 3,
    title: "Lehenga Silhouettes Explained: A-Line, Mermaid and Flared",
    excerpt: "Find the cut that suits your frame and the way you want to move.",
    image: "/images/blogs/blog-3.png",
  },
];

// 10. Frequently Asked Questions
const faqs = [
  {
    q: "How does renting work?",
    a: "Choose an outfit, pick your event date and reserve it. We fit and alter it, deliver it before your event and collect it afterwards.",
  },
  {
    q: "How much do I pay to confirm a booking?",
    a: "A small advance confirms your date. The balance is due before delivery, once the fitting is done.",
  },
  {
    q: "Can I change or cancel my booking?",
    a: "Yes. You can change or cancel before the outfit is delivered. Any amount paid beyond the booking fee is refunded.",
  },
  {
    q: "What happens if the outfit gets damaged?",
    a: "Normal wear is expected and not charged. Tell us about any accidents when you return the outfit and we will guide you.",
  },
  {
    q: "Will it fit me?",
    a: "Every outfit is altered to your measurements before it ships. You can also request a trial before the event.",
  },
];

// 11. Footer navigation columns & contact info
const footerColumns = [
  {
    title: "Shop",
    links: [
      { label: "Lehengas", to: "/clothes?category=Lehengas" },
      { label: "Gowns", to: "/clothes?category=Gowns" },
      { label: "Shararas", to: "/clothes?category=Shararas" },
      { label: "Accessories", to: "/clothes?category=Accessories" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#how-it-works" },
      { label: "Our Story", href: "#reviews" },
      { label: "Style Journal", href: "#journal" },
      { label: "Contact Us", to: "/contact" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "How It Works", href: "#how-it-works" },
      { label: "FAQ", href: "#faq" },
      { label: "My Orders", to: "/orders" },
      { label: "My Account", to: "/account" },
    ],
  },
];

const contactDetails = [
  { icon: "bi-geo-alt", text: "Add your store address here" },
  { icon: "bi-envelope", text: "hello@rentwear.com" },
  { icon: "bi-telephone", text: "+91 00000 00000" },
];

// Helper function to format price in Indian Rupees
function formatPrice(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

// Reusable section title component
function SectionHeading({ id, title, subtitle }) {
  return (
    <div className="section-heading">
      <h2 id={id}>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

// Reusable product card component — clicking image or title opens the full Product Page
function ProductCard({ product, showButton, onAdd }) {
  const [justAdded, setJustAdded] = useState(false);

  const handleQuickAdd = () => {
    onAdd(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <div className="product-card">
      <Link to={`/product?id=${product.id}`} className="product-media">
        <img src={product.image} alt={product.name} />
      </Link>

      <div className="product-info">
        <p className="product-label">{product.label}</p>
        <h3 className="product-name">
          <Link to={`/product?id=${product.id}`}>{product.name}</Link>
        </h3>
        <p className="product-price">
          <small>Rent</small>
          {formatPrice(product.rent)}
        </p>

        {showButton && (
          <button
            type="button"
            className="product-button"
            onClick={handleQuickAdd}
          >
            {justAdded ? "Added to Bag ✓" : "Rent Now"}
          </button>
        )}
      </div>
    </div>
  );
}

function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [slideIndex, setSlideIndex] = useState(0);
  const [cardsPerRow, setCardsPerRow] = useState(4);
  const [reviewIndex, setReviewIndex] = useState(2);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 560) {
        setCardsPerRow(1);
      } else if (window.innerWidth <= 900) {
        setCardsPerRow(2);
      } else {
        setCardsPerRow(4);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((item) => item.category === selectedCategory);

  const trendingProducts = products.filter((item) => item.trending);
  const maxSlide = Math.max(trendingProducts.length - cardsPerRow, 0);
  const currentSlide = Math.min(slideIndex, maxSlide);

  const currentReview = testimonials[reviewIndex];

  return (
    <div className="site-wrapper">
      <main id="home">
        {/* HERO SECTION */}
        <section className="hero-copy">
          <p className="eyebrow">Best Collection</p>
          <h1>
            Quiet luxury,
            <br />
            <span>loudly considered.</span>
          </h1>
          <p className="hero-description">
            Explore premium clothing and statement accessories curated for every season.
          </p>
          <Link to="/clothes" className="shop-button">
            EXPLORE SHOP
          </Link>
        </section>

        <section className="hero-image">
          <img
            src="/images/fashion-hero1..png"
            alt="Models wearing the RentWear fashion collection"
          />
        </section>

        {/* SERVICE FEATURES */}
        <section className="service-features">
          <div className="service-container">
            {services.map((service) => (
              <div className="service-item" key={service.title}>
                <div className="service-icon">
                  <i className={`bi ${service.icon}`} />
                </div>
                <div className="service-content">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* NEW ARRIVALS */}
        <section className="shop-section" id="collection">
          <div className="section-inner">
            <SectionHeading
              id="arrivals-title"
              title="New Arrivals"
              subtitle="Fresh designer pieces for the season's weddings and parties."
            />

            <div className="filter-bar">
              {filterOptions.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`filter-chip ${selectedCategory === category ? "is-active" : ""}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showButton={true}
                  onAdd={(p) =>
                    addToBag({
                      id: p.id,
                      name: p.name,
                      image: p.image,
                      rent: p.rent,
                      color: "Default",
                      size: "M",
                      qty: 1,
                    })
                  }
                />
              ))}
            </div>
          </div>
        </section>

        {/* SHOP BY OCCASION */}
        <section className="shop-section" id="occasions">
          <div className="section-inner">
            <SectionHeading
              id="occasions-title"
              title="Shop by Occasion"
              subtitle="Curated edits for every function on your calendar."
            />

            <div className="edit-grid">
              {occasions.map((occasion) => (
                <Link
                  key={occasion.id}
                  to={occasion.to}
                  className="edit-tile"
                  style={{ backgroundColor: occasion.tone }}
                >
                  <img src={occasion.image} alt={occasion.title} />
                  <div className="edit-copy">
                    <h3>{occasion.title}</h3>
                    <p>{occasion.note}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* MOST RENTED CAROUSEL */}
        <section className="shop-section" id="trending">
          <div className="section-inner">
            <SectionHeading
              id="trending-title"
              title="Most Rented This Season"
              subtitle="The outfits our customers keep coming back for."
            />

            <div className="carousel">
              <button
                type="button"
                className="carousel-arrow carousel-arrow--prev"
                onClick={() => setSlideIndex(Math.max(currentSlide - 1, 0))}
                disabled={currentSlide === 0}
              >
                <i className="bi bi-arrow-left" />
              </button>

              <div className="carousel-viewport">
                <div
                  className="carousel-track"
                  style={{
                    transform: `translateX(-${(currentSlide * 100) / cardsPerRow}%)`,
                  }}
                >
                  {trendingProducts.map((item) => (
                    <div
                      key={item.id}
                      className="carousel-slide"
                      style={{ flexBasis: `${100 / cardsPerRow}%` }}
                    >
                      <ProductCard product={item} showButton={false} />
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="carousel-arrow carousel-arrow--next"
                onClick={() => setSlideIndex(Math.min(currentSlide + 1, maxSlide))}
                disabled={currentSlide === maxSlide}
              >
                <i className="bi bi-arrow-right" />
              </button>
            </div>
          </div>
        </section>

        {/* HOW RENTING WORKS */}
        <section className="how-section" id="how-it-works">
          <div className="section-inner">
            <SectionHeading
              id="how-title"
              title="How Renting Works"
              subtitle="From first look to final return, in four simple steps."
            />

            <div className="steps">
              {steps.map((step) => (
                <div className="step" key={step.id}>
                  <span className="step-number">{step.id}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMPLETE THE LOOK (ACCESSORIES) */}
        <section className="shop-section" id="accessories">
          <div className="section-inner">
            <SectionHeading
              id="accessories-title"
              title="Complete the Look"
              subtitle="Rent jewellery and clutches to match your outfit."
            />

            <div className="product-grid">
              {accessories.map((item) => (
                <ProductCard key={item.id} product={item} showButton={false} />
              ))}
            </div>
          </div>
        </section>

        {/* CUSTOMER REVIEWS */}
        <section className="reviews-section" id="reviews">
          <div className="section-inner">
            <SectionHeading
              id="reviews-title"
              title="Loved by Brides and Guests"
              subtitle="Hear from customers who wore RentWear to their celebrations."
            />

            <div className="testimonial-avatars">
              {testimonials.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={index === reviewIndex ? "is-active" : ""}
                  onClick={() => setReviewIndex(index)}
                >
                  <img src={item.avatar} alt={item.name} />
                </button>
              ))}
            </div>

            <div className="testimonial-body">
              <button
                type="button"
                className="testimonial-arrow"
                onClick={() => setReviewIndex(reviewIndex - 1)}
                disabled={reviewIndex === 0}
              >
                <i className="bi bi-arrow-left" />
              </button>

              <div className="testimonial-quote">
                <h3>{currentReview.title}</h3>
                <p>{currentReview.text}</p>

                <div className="testimonial-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`bi bi-star-fill ${star <= currentReview.rating ? "" : "is-empty"}`}
                    />
                  ))}
                </div>

                <div className="testimonial-author">
                  <strong>{currentReview.name}</strong>
                  <span>Verified Renter</span>
                </div>
              </div>

              <button
                type="button"
                className="testimonial-arrow"
                onClick={() => setReviewIndex(reviewIndex + 1)}
                disabled={reviewIndex === testimonials.length - 1}
              >
                <i className="bi bi-arrow-right" />
              </button>
            </div>
          </div>
        </section>

        {/* FEATURED COLLECTIONS (Below Reviews) */}
        <section className="feature-collections" id="collections">
          <h2>Featured Collections</h2>

          <div className="collection-fan">
            {collections.map((item, index) => {
              const level = Math.abs(index - centerIndex);

              return (
                <Link
                  key={item.id}
                  to={`/product?id=${item.productId}`}
                  className={`collection-card level-${level}`}
                  style={{ backgroundColor: item.bg, zIndex: 10 - level }}
                >
                  <img src={item.image} alt={item.alt} />

                  {item.featured && (
                    <>
                      <span className="collection-badge">New</span>
                      <span className="collection-tag">
                        Bridal
                        <br />
                        Edit
                      </span>
                      <span className="collection-price">
                        <small>Rent From</small>
                        <strong>{item.price}</strong>
                      </span>
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        </section>

        {/* STYLE JOURNAL */}
        <section className="shop-section" id="journal">
          <div className="section-inner">
            <SectionHeading
              id="journal-title"
              title="The Style Journal"
              subtitle="Styling ideas and wedding-season inspiration."
            />

            <div className="blog-grid">
              {blogs.map((blog) => (
                <div className="blog-card" key={blog.id}>
                  <img src={blog.image} alt={blog.title} />
                  <div className="blog-body">
                    <h3>{blog.title}</h3>
                    <p>{blog.excerpt}</p>
                    <Link to="/clothes" className="blog-link">
                      Explore collection
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="shop-section shop-section--last" id="faq">
          <div className="section-inner">
            <SectionHeading
              id="faq-title"
              title="Good to Know"
              subtitle="Answers to the questions we hear most."
            />

            <div className="faq-list">
              {faqs.map((item) => (
                <details className="faq-item" key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="site-footer" id="contact">
        <div className="footer-inner">
          <div className="footer-brand">
            <Link to="/" className="brand">
              Rent<span>Wear</span>
            </Link>
            <p>
              Premium designer wear for weddings, parties and special
              occasions. Rent the look, skip the price of owning it.
            </p>
          </div>

          {footerColumns.map((column) => (
            <div className="footer-column" key={column.title}>
              <h4>{column.title}</h4>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link to={link.to}>{link.label}</Link>
                    ) : (
                      <a href={link.href}>{link.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="footer-column footer-contact">
            <h4>Contact Us</h4>
            <ul>
              {contactDetails.map((item) => (
                <li key={item.text}>
                  <i className={`bi ${item.icon}`} />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="footer-bottom">
          &copy; 2026 RentWear. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default HomePage;