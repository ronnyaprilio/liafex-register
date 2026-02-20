# LIAFEX REGISTER — POS Dashboard

Modern POS dashboard system built with **Next.js**, **Auth.js**, and **Tailwind CSS**.
Designed as a clean, scalable foundation for point-of-sale applications with authentication and protected routes.

---

## ✨ Features

* Secure credential authentication
* Protected dashboard routes
* Clean scalable layout architecture
* Reusable UI components
* Modern glassmorphism UI style
* Loading states & UX feedback
* Ready for production extension

---

## 🧱 Tech Stack

* Next.js (App Router)
* Auth.js (Credentials Provider)
* Tailwind CSS
* TypeScript
* Lucide Icons

---

## 📁 Project Structure

```
app/
 ├─ login/
 ├─ dashboard/
 ├─ api/auth/[...nextauth]/
components/
 ├─ LoginForm
 ├─ TextBox
 ├─ SubmitButton
 ├─ LogoutButton
```

---

## 🔐 Environment Variables

Create `.env.local`

```
AUTH_SECRET=your_secret_here
USERNAME=admin
PASSWORD=123
```

---

## 🚀 Getting Started

Install dependencies

```
npm install
```

Run development server

```
npm run dev
```

Open

```
http://localhost:3000
```

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

This project is ideal for:

* POS systems
* Admin dashboards
* Internal tools
* SaaS panels
* Starter templates

---

## 📌 Roadmap Ideas

* Role-based access
* Database integration
* Transaction module
* Receipt generator
* Analytics charts
* Inventory system

---

## 📜 License

MIT — free to use, modify, and build upon.

---

## 🤝 Contribution

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

---

## ⭐ Author Note

Built as a clean foundation for scalable dashboard apps.
If you find it useful, consider starring the repo ⭐
