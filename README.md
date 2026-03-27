# GuaranteedSportPicks - Sports Betting Insights Platform

A professional sports betting platform that provides expert-vetted betting "picks" (recommendations) for various sports including NFL, NBA, MLB, and NHL. The platform features a subscription-based model integrated with Stripe, a robust admin dashboard for content management, and a personalized user dashboard for tracking purchases and picks.

---

## 🚀 Overview

GuaranteedSportPicks is designed to bridge the gap between expert sports analysts and bettors. It offers a clean, modern interface where users can browse free picks, read the latest betting insights, and subscribe to premium packages for high-confidence expert recommendations.

---

## ✨ Key Features

### 🔐 Authentication & Security
- **Secure Auth**: JWT-based authentication with role-based access control (Admin & User).
- **Email Verification**: Mandatory email verification for new accounts.
- **Password Management**: Secure password reset and update functionality.
- **Backend Security**: Implementation of Helmet, HPP, Rate limiting, and Mongo-sanitize for robust protection.

### 🎯 Sports Picks System
- **Free Picks**: Daily accessible sports recommendations for all visitors.
- **Premium Picks**: High-value picks locked behind subscription packages.
- **Pick Details**: Includes sport type, teams, odds, market type (Moneyline, Spread, Totals), confidence levels, and detailed expert analysis (writeups).
- **Result Tracking**: Real-time status updates (Win/Loss/Void) for transparency.

### 💳 Subscription & Payments
- **Stripe Integration**: Secure payment processing for single-purchase picks and recurring subscriptions.
- **Multiple Packages**: Flexible plans including Daily, Weekly, Monthly, and Seasonal access.
- **Tiered Access**: Support for sport-specific or all-access subscriptions.

### 🖥️ Dashboards
- **Admin Dashboard**:
  - Full CRUD for Articles, Picks, and Testimonials.
  - User and Subscription management.
  - Platform analytics and stats monitoring.
  - Newsletter subscriber management.
- **User Dashboard**:
  - Access to purchased premium picks.
  - Subscription status and history.
  - Profile management and settings.

### 📰 Content & Engagement
- **Betting Insights (Blog)**: Educational articles and news about the betting world.
- **Newsletter**: Automated or manual updates for subscribers.
- **Testimonials**: Verified customer reviews to build trust.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **State Management**: Redux Toolkit (RTK Query)
- **Styling**: Tailwind CSS & DaisyUI
- **UI Components**: Swiper, Slick Carousel, React Hot Toast
- **Charts**: Recharts & Chart.js

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (v5)
- **Language**: TypeScript
- **Validation**: Zod
- **File Handling**: Express-fileupload

### Database & Services
- **Database**: MongoDB (Mongoose ODM)
- **Payments**: Stripe API
- **Email**: Nodemailer
- **Authentication**: JWT & NextAuth

---

## 📂 Project Structure

```text
C:\projects\2026 - feb\badb-final-version
├── backend/                # Express & TypeScript Backend
│   ├── src/
│   │   ├── modules/        # Feature-based modular logic (Auth, Picks, Sub, etc.)
│   │   ├── model/          # Mongoose Schemas
│   │   ├── utils/          # Global utilities (Stripe, Email, JWT)
│   │   └── handlers/       # Global error & validation handlers
├── frontend/               # Next.js Frontend
│   ├── app/                # App Router (Pages & Layouts)
│   ├── components/         # Reusable UI components
│   ├── feature/            # RTK Query API slices
│   ├── store/              # Redux Store configuration
│   └── public/             # Static assets (Images, JSON)
```

---

## 🔄 Website Flow & Logic

### 1. Public Visitor Flow
- **Landing Page**: View featured picks, stats overview, trusted partners, and package options.
- **Free Picks**: Browse daily free recommendations without an account.
- **Insights**: Read blog articles and betting strategies.
- **Call to Action**: Newsletter signup or "Get Started" to create an account.

### 2. User Journey (Subscriber)
- **Registration**: User signs up -> Verifies email -> Logs in.
- **Subscription**: User selects a package (e.g., Weekly NBA) -> Paid via Stripe -> Redirected to Success page.
- **Dashboard Access**: User logs into the dashboard to see "My Picks" (unlocked premium content).
- **Persistence**: Subscription status is tracked via Stripe webhooks to ensure access expires correctly.

### 3. Admin Management Flow
- **Content Creation**: Admin adds new sports picks, providing teams, odds, and their expert analysis.
- **Article Management**: Admin writes and publishes betting insights using a rich-text editor (React Quill).
- **User Oversight**: Admin can view all registered users and their subscription status.
- **Result Updating**: Once a game is finished, Admin updates the pick status (Win/Loss) which reflects in the platform's stats.

---

## 🔧 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB
- Stripe Account (for API keys)

### Setup Backend
1. `cd backend`
2. `npm install`
3. Configure `.env` (use `.env.example` as a template)
4. `npm run start:dev`

### Setup Frontend
1. `cd frontend`
2. `npm install`
3. Configure `.env.local`
4. `npm run dev`

---

## 📄 License
This project is licensed under the ISC License.

---

