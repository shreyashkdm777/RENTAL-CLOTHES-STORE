import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/layout/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import ClothingPage from "./pages/ClothingPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const { pathname } = useLocation();
  return (
    <div key={pathname} className="route-fade">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/clothes" element={<ClothingPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <AnimatedRoutes />
    </>
  );
}
