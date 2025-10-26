
# 🎬 ByteCinema — Modern Movie Booking & Recommendation Platform

ByteCinema is a **next-generation movie platform** built with **Node.js**, **Express**, **MongoDB**, and **TypeScript**.  
It allows users to explore movies, book showtimes, post reviews, and enjoy an AI-powered recommendation system.  
Cloudinary handles media storage, Stripe powers secure payments, and Redis + RabbitMQ handle performance and asynchronous tasks.

---

## 🚀 Features

### 👤 Authentication & User Management
- Secure password hashing with **bcrypt**
- Support for **OAuth providers**: Google, GitHub, LinkedIn, Facebook, Twitter, Apple, Microsoft
- **JWT-based authentication** with refresh tokens
- OTP-based signup and password recovery system
- Role-based access (`USER`, `ADMIN`)

### 🎞️ Movies & Reviews
- Create and manage movie data (title, genre, cast, director, trailer, etc.)
- Upload posters via **Cloudinary**
- Add reviews and ratings with automatic aggregation
- AI-powered **personalized recommendations** (coming soon)

### 🎭 Theaters & Showtimes
- Manage theaters, locations, and screens
- Link movies to showtimes with pricing and seat availability
- Real-time seat tracking system (via Redis caching)

### 🎟️ Bookings & Payments
- Book tickets for specific showtimes
- Stripe-based **secure payment** integration
- Booking confirmation, status updates, and event-driven flow with RabbitMQ
- Cancellable bookings and refund logic

### 💬 Future Roadmap
- 🎯 AI Movie Recommendation System  
- ⚙️ Redis caching for faster performance  
- 📨 RabbitMQ-based event system  
- 📊 Analytics Dashboard for Admins  
- 📱 Frontend in React + TailwindCSS (planned)

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-------------|
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB + Mongoose |
| Authentication | JWT, bcrypt, OAuth |
| Payments | Stripe API |
| Media Storage | Cloudinary |
| Caching | Redis *(coming soon)* |
| Queue System | RabbitMQ *(coming soon)* |
| AI/ML | Custom Recommendation Engine *(planned)* |

---

## ⚙️ Installation & Setup

```bash
# Clone the repo
git clone https://github.com/ankitkumarbarik/ByteCinema.git

# Navigate to project
cd ByteCinema

# Install dependencies
npm install

# Setup environment variables (.env)
PORT=your_port_here
NODE_ENV=your_node_env_here
MONGO_URI=your_mongo_uri_here
ACCESS_TOKEN_SECRET=your_access_token_secret_here
ACCESS_TOKEN_EXPIRY=your_access_token_expiry_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
REFRESH_TOKEN_EXPIRY=your_refresh_token_expiry_here
ADMIN_EMAIL=your_admin_email_here
ADMIN_PASSWORD=your_admin_password_here
SMTP_SERVICE=your_smtp_service_here
SMTP_HOST=your_smtp_host_here
SMTP_SECURE=your_smtp_secure_here
SMTP_PORT=your_smtp_port_here
SMTP_USER=your_smtp_user_here
SMTP_PASS=your_smtp_pass_here
FRONTEND_BASE_URL=your_frontend_base_url_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name_here
CLOUDINARY_API_KEY=your_cloudinary_api_key_here
CLOUDINARY_API_SECRET=your_cloudinary_api_secret_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here

# Run in development
npm run dev
```

---

## 🧠 Author

👨‍💻 **Ankit Barik**  

---

## 📜 License

This project is licensed under the **MIT License**.  
Feel free to use and modify it as long as attribution is provided.

---

⭐ **ByteCinema** — Watch Smart. Book Smarter.  
