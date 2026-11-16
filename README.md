# RentWear – Rental Clothing Store

A React + Vite clothing rental storefront. The project has been reorganized into beginner-friendly folders and uses one shared navbar on every route.

## 1. Requirements

- Node.js (LTS version)
- npm

## 2. Run the project

Open this folder in VS Code. Open the terminal in the project root and run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

To create a production build:

```bash
npm run build
```

## 3. Project structure

```text
Rentalstore/
├── public/
│   ├── icons/                 # Navbar and interface icons
│   └── images/                # Product, collection and banner images
├── src/
│   ├── components/
│   │   └── layout/
│   │       └── Navbar.jsx     # One navbar shared by every page
│   ├── data/
│   │   └── products.js        # Product list and product options
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ClothingPage.jsx
│   │   ├── ProductPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── OrdersPage.jsx
│   │   ├── AuthPage.jsx
│   │   ├── AccountPage.jsx
│   │   └── ContactPage.jsx
│   ├── styles/                # CSS files
│   ├── utils/
│   │   ├── auth.js            # Demo browser-based authentication
│   │   └── cart.js            # Cart, promo and order helpers
│   ├── App.jsx                # React Router page configuration
│   └── main.jsx               # React application entry point
├── index.html
├── package.json
└── README.md
```

## 4. Available pages

| Page | URL |
|---|---|
| Home | `/` |
| Clothes | `/clothes` |
| Product details | `/product?id=1` |
| Cart | `/cart` |
| Checkout | `/checkout` |
| Orders | `/orders` |
| Login | `/login` |
| Sign up | `/signup` |
| Account | `/account` |
| Contact | `/contact` |

## 5. Where to make changes

- **Navbar:** `src/components/layout/Navbar.jsx`
- **Page routing:** `src/App.jsx`
- **Home page design:** `src/pages/HomePage.jsx` and `src/styles/App.css`
- **Product information:** `src/data/products.js`
- **Cart and order behaviour:** `src/utils/cart.js`
- **Page styling:** matching CSS file inside `src/styles/`

## 6. Beginner notes

- `main.jsx` starts the React application.
- `App.jsx` decides which page component appears for each URL.
- `Navbar.jsx` is included once in `App.jsx`, so it stays consistent across all pages.
- Each file inside `pages/` represents one screen of the website.
- `data/` stores information; `utils/` stores reusable functions; `styles/` stores CSS.

## 7. Important project notes

The existing login implementation is a browser-only demo and is not production authentication. Cart, orders and account demo data are stored in the browser. Connect a secure backend before using this project for real customer accounts or payments.
