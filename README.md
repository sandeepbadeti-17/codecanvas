# 🚀 DevCanva

A developer-focused platform designed to solve real-world problems around authentication, user lifecycle, and productivity tracking.

Built with a strong backend foundation to support future features like unified developer activity tracking across platforms.

---

## 🎥 Demo

*(Video demo coming soon)*
The application is fully functional with authentication, onboarding, and protected user flows.

---

## 🧠 Why I Built This

Developers work across multiple platforms like GitHub, LeetCode, and others — but there’s no unified system to reflect **actual daily progress**.

Most tools either:

* Track activity in isolation
* Or rely on manual input

This leads to inconsistency and lack of accountability.

**DevCanva is an attempt to solve this — starting with a robust authentication and user management system, which serves as the foundation for future integrations and tracking features.**

---

## 🧩 Problem Space

Building a reliable system with multiple authentication providers introduces challenges like:

* Handling multi-provider authentication (Email, Google, GitHub)
* Preventing account duplication and data overwrites
* Managing first-time user onboarding correctly
* Maintaining consistent session state

This project focuses on solving these problems in a scalable way.

---

## ⚙️ Features

* 🔐 Multi-provider authentication (Email, Google, GitHub)
* 🧭 First-time user onboarding flow
* 👤 Stable user persistence (no overwrites across providers)
* 🛡️ Protected routes using middleware
* 📝 Notes system (used to validate user-specific data persistence)

---

## 🏗️ Tech Stack

* Next.js
* NextAuth
* Prisma
* PostgreSQL (Neon - serverless)

---

## 🌍 Live Demo

https://dev-canva.vercel.app/

---

## 🛠️ Run Locally

```bash
npm install
npm run dev
```

---

## 🚧 Future Scope

* 📊 Unified developer activity tracking (GitHub, LeetCode, etc.)
* 🔔 Smart notifications based on real activity
* 🎯 Consistency and habit tracking system
* 😈 Feedback system (motivational / roast-based insights)

---

## 💡 Key Takeaway

This project is not just about authentication —
it’s about building a **scalable foundation for a developer productivity ecosystem.**
