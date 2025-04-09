# 📝 Collaborative Blogging Platform

A feature-rich, scalable, and secure blogging system built with **NestJS**, **PostgreSQL**, and **TypeORM** — designed for seamless collaboration, real-time interactions, and insightful analytics.

---

## 🚀 Features

- 🔐 **User Authentication** – JWT-based login/registration with role-based access control (Admin, Editor, User)
- 🧑‍💻 **User Profiles** – Create and edit profiles, follow/unfollow users
- ✍️ **Blog System** – Create, edit, publish, delete blog posts with markdown support and media uploads
- 💬 **Comments & Reactions** – Nested commenting, like/dislike blogs and comments
- 🛎 **Real-Time Notifications** – Live updates via WebSockets or RabbitMQ for comments, likes, and follows
- 📊 **Admin Dashboard** – View analytics and manage users, roles, and content
- ⚡ **Performance Optimizations** – Redis caching, API rate limiting, and optimized DB queries

---

## 🧱 Tech Stack

- **Backend:** NestJS (Node.js)
- **Database:** PostgreSQL + TypeORM
- **Authentication:** JWT & bcrypt
- **Caching:** Redis
- **Event Communication:** WebSockets / RabbitMQ
- **Cloud Storage:** AWS S3 (for media)

---

## 📚 Modules

### 🧑 User Management
- JWT auth
- Profile CRUD
- Following system
- RBAC support

### 📰 Blogging
- Blog post CRUD
- Markdown formatting
- Image/file uploads
- Tagging & categories

### 💬 Interactions
- Comments & replies
- Like/dislike functionality

### 🛎 Notifications
- Real-time updates via WebSocket/RabbitMQ

### ⚙️ Caching & Optimization
- Redis for hot data
- Rate limiting
- Query indexing

### 📈 Admin Tools
- Analytics dashboard
- User/content moderation

---

## 🗃 ERD Overview

- **Users**: id, name, email, password, role, bio, profile_picture  
- **Blogs**: id, title, content, author_id, created_at, updated_at  
- **Comments**: id, blog_id, user_id, content, parent_comment_id, created_at  
- **Reactions**: id, user_id, blog_id, type  
- **Followers**: follower_id, followed_id  
- **Notifications**: id, user_id, message, status, created_at  

---

## 🛠 Architecture

- **Client**: React / Next.js (planned)
- **Backend**: Modular monolith using NestJS
- **Data Layer**: PostgreSQL with TypeORM
- **Cache Layer**: Redis
- **Event Handling**: WebSockets / RabbitMQ

---

## 🔒 Security

- Passwords hashed with bcrypt
- JWT with refresh tokens
- Role-based access control (RBAC)
- Rate limiting & input validation
- CORS enforcement

---

## 📅 Development Roadmap

| Phase | Description |
|-------|-------------|
| 1️⃣    | Project Setup (NestJS, PostgreSQL, Auth) |
| 2️⃣    | Blog CRUD, file uploads |
| 3️⃣    | Comments, reactions, following |
| 4️⃣    | Notifications & caching |
| 5️⃣    | Admin dashboard & optimization |

---

## ✅ Getting Started

1. Clone the repo  
2. Run `npm install`  
3. Configure `.env` for PostgreSQL, Redis, and JWT secrets  
4. Run the project using `npm run start:dev`

---

## 📌 Next Steps

- Finalize DB schema
- Setup initial modules using NestJS CLI
- Implement authentication and roles

---

## 💡 License

This project is open-source and available under the [MIT License](LICENSE).
