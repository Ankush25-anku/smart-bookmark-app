# 🔖 Smart Bookmark App

A production-ready bookmark manager built using Next.js (App Router) and Supabase.

---

## 🌍 Live Demo

👉 https://smart-bookmark-app-one-tau.vercel.app/

## 📦 GitHub Repository

👉 https://github.com/Ankush25-anku/smart-bookmark-app

---

## 🛠 Tech Stack

- Next.js (App Router)
- Supabase (Auth, PostgreSQL, Realtime)
- Google OAuth
- Row Level Security (RLS)
- Tailwind CSS
- Vercel Deployment

---

## ✨ Features

- 🔐 Login with Google (OAuth only)
- ➕ Add bookmarks (Title + URL)
- ❌ Delete bookmarks
- 🔒 Bookmarks are private per user
- ⚡ Real-time updates across multiple tabs
- 🌍 Production-ready deployment

---

## 🔐 Security – Row Level Security (RLS)

Bookmarks are private to each user using PostgreSQL RLS policies.

Example:

```sql
create policy "Users can view own bookmarks"
on bookmarks
for select
using (auth.uid() = user_id);
```
