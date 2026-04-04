# 🚀 DevCanva

A full-stack developer activity app focused on **authentication, user lifecycle, and system design**.

Built to understand and solve real-world authentication challenges like multi-provider conflicts and user data consistency.

---

## 🎥 Demo
*(Video demo coming soon. The app is fully functional with authentication and user flow implemented.)*

---

## 🧠 Problem Solved

- Handling multi-provider authentication (Email, Google, GitHub)  
- Preventing user data overwrite across providers  
- Managing first-time user onboarding correctly  
- Maintaining consistent session state using JWT  

---

## ⚙️ Features

- 🔐 Multi-provider authentication  
- 🧭 First-time onboarding flow  
- 👤 Stable user persistence (no overwrites)  
- 🛡️ Protected routes via middleware  
- 📝 Notes system (used for testing data persistence)  

---

## 🏗️ Tech Stack

- Next.js  
- NextAuth  
- Prisma  
- PostgreSQL (via Neon - serverless database)

---

Environment variables are required for authentication and database configuration.

---

## 🌍 Live Demo

*(Live demo will be added after deployment.)*

---

## 🛠️ Run Locally

```bash
npm install
npm run dev
