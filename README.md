# DevCanva

> Developers grind across GitHub, LeetCode, and a dozen other platforms — but there's no single place that shows you the truth about your consistency. Most habit trackers let you lie to yourself. DevCanva doesn't.

🚧 **In progress** — Phase 1 live: multi-provider auth with persistent data. Streak sync from GitHub & LeetCode coming next.

🔗 [Live Demo](https://dev-canva.vercel.app/)

---

https://github.com/user-attachments/assets/f7cd07ef-c9bb-4ac9-b211-322d3026e486

---

## The problem

Every habit tracker lets you manually check a box. You can log a "coding session" without writing a single line. You can fake a streak. The accountability is an illusion.

DevCanva pulls your actual activity — commits, submissions, platform data — so the streak is real, or it's zero. No self-reporting. No "I'll log it later."

---

## Where it is now

Building this right means the foundation has to be solid. Phase 1 is a full authentication and user lifecycle system:

- **Multi-provider auth** — login with Email, Google, or GitHub. No duplicate accounts, no data overwrites across providers
- **First-time onboarding flow** — new users are detected and routed correctly every time
- **Persistent notes** — added as a real data layer to prove user-specific persistence is working correctly before building anything on top of it
- **Protected routes** — middleware-level session enforcement throughout

The notes feature exists to validate the data layer before integrating external APIs.

---

## What's coming

- **Platform sync** — GitHub & LeetCode to start. If it produces real activity data, it belongs here  
- **Real streaks** — built entirely from platform activity (no manual input)  
- **Consistency insights** — honest feedback on actual output  
- **Roast mode** — for when you need the truth, not encouragement

---

## Stack

`Next.js` &nbsp; `NextAuth` &nbsp; `Prisma` &nbsp; `PostgreSQL (Neon)`

---

## Run locally

```bash
npm install
npm run dev
```
