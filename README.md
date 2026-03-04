# LIAFEX REGISTER — POS Dashboard

Modern, full‑featured point‑of‑sale dashboard built with **Next.js**, **Auth.js**, and **Tailwind CSS**.
Originally created as an authentication starter, the project has evolved into a mini‑POS platform with
product management, cart/register, receipts, and sales reports—all secured behind a login.

---

## ✨ Key Features

* Secure credential authentication via Auth.js
* Protected routes with session handling
* **Product catalogue** with CRUD management (code, price, discount)
* **Sales register** – add items to cart, update quantities, void or complete transactions
* Automatic **transaction logging** in MongoDB
* On‑the‑fly **receipt generation & printing** using an HTML template
* **Sales reports** with date filtering and monthly summaries
* Clean, scalable layout architecture and reusable UI components
* Modern glassmorphism/Dark‑light friendly UI style
* Loading states & UX feedback throughout
* Ready for production extension and customization

---

## 🧱 Tech Stack

* Next.js (App Router)
* Auth.js (Credentials Provider)
* Tailwind CSS + @tailwindcss/postcss (v4)
* TypeScript
* Lucide Icons
* Mongoose for MongoDB models
* bcryptjs for credential hashing
* axios & fetch for client/server communication

---

## 🔐 Environment Variables

Create a `.env.local` file at the project root with the following keys (see `seed.js` for initial user creation):

```
AUTH_SECRET=<your_secret_here>
USERNAME=<your-admin-init-username>
PASSWORD=<your-admin-init-password>
MONGODB_URI=<your-mongodb-uri>
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=<your-recaptcha-site-key>
RECAPTCHA_SECRET_KEY=<your-recaptcha-secret-key>
```

> The `USERNAME`/`PASSWORD` pair is used by the credentials provider to bootstrap the first administrator account.

---

## 🚀 Getting Started

1. Install dependencies (this repo uses `pnpm` but `npm`/`yarn` work too):

```bash
pnpm install
# or npm install
```

2. Create your `.env.local` as described above and ensure your MongoDB instance is reachable.

3. Optionally run the included `seed.js` script to create the initial user:

```bash
node seed.js
```

4. Start the development server:

```bash
pnpm run dev
# or npm run dev
```

5. Open your browser at `http://localhost:3000` and log in with the seeded credentials.

---

## 🔌 API Endpoints (POS)

The application exposes a small REST‑style API under `/pos/api` used by the front‑end:

* `GET  /pos/api/products` – list all products
* `POST /pos/api/products` – create a new product
* `PUT  /pos/api/products/[code]` – update product data
* `DELETE /pos/api/products/[code]` – remove a product
* `GET  /pos/api/transactions` – retrieve transaction history
* `POST /pos/api/transactions` – record a new sale
* `POST /pos/api/prints` – generate printable HTML receipt

These endpoints require a valid session and are intended for internal use by the UI components.

---

## 🧠 Architecture Philosophy

This project is designed as a **starter architecture**, not just a UI template.

Principles:

* Separation of client and server logic
* Minimal re-renders
* Clean auth flow
* Extensible component design
* Production-ready patterns

---

## 🔒 Authentication Flow

1. User submits login form
2. Credentials validated via Auth.js provider
3. Session created
4. Redirect to dashboard
5. Protected routes verify session

---

## 🎯 Intended Use

Originally a simple authentication dashboard, this repo now provides a lightweight POS platform and is ideal for:

* Small retail or food‑service POS systems
* Cash register prototypes
* Admin dashboards with a sales register
* Internal tools that require transaction logging and reporting
* Starter templates for building larger inventory/ERP systems

---

## 📌 Roadmap & Future Enhancements

Already implemented in the current version:

* Product CRUD management
* Sales register with cart, void, and payment flow
* Transaction persistence in MongoDB
* Printable receipt generator
* Date‑range sales reporting with monthly summaries

Potential future additions:

* Role‑based access control (admin, cashier, manager)
* Inventory tracking and low‑stock alerts
* Barcode scanner support
* PDF receipts or email notifications
* Analytics charts and exportable reports
* Multi‑terminal / concurrent user support

---

## 📜 License

MIT — free to use, modify, and build upon.

---

## 🤝 Contribution

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

---

## ⭐ Author Note

Built as a clean foundation for scalable dashboard apps.
