# Project Name: BADB Final Version

## Overview
BADB Final Version is a comprehensive web application for sports betting picks, featuring a robust backend built with Node.js, Express, and TypeScript, and a modern frontend using Next.js with Redux Toolkit Query. The platform includes features such as user authentication, premium subscription management, affiliate programs, blog articles, and real-time betting picks.

---

## Project Structure

### Backend (`/backend`)
- **Language/Framework**: TypeScript, Node.js, Express
- **Database**: MongoDB with Mongoose
- **Validation**: Zod
- **Authentication**: JWT, bcrypt, express-session (optional), cookie-parser
- **Payments**: Stripe integration for subscriptions and picks
- **Logging**: Morgan and custom Winston-based logger
- **Security**: Helmet, CORS, HPP, Express-Mongo-Sanitize, Rate Limiting

### Frontend (`/frontend`)
- **Framework**: Next.js (App Router)
- **State Management**: Redux Toolkit & RTK Query
- **Styling**: Tailwind CSS
- **Authentication**: Cookie-based JWT handling
- **Components**: Modular React components for dashboard, blog, home, and more

---

## Data Models & Schemas

### 1. User (`user.schema.ts`)
- `firstName`, `lastName`, `email`, `phoneNumber`, `password`
- `isEmailVerified`, `isActive`
- `role`: `ADMIN`, `USER`
- `affiliateCode`, `referredByAffiliateId`, `referredByAffiliateCode`

### 2. Picks (`picks.model.ts`)
- `sportId`, `sportKey`, `sport_title`, `home_team`, `away_team`, `commence_time`
- `price`, `odds`, `selected_team`
- `market_type`: `moneyline`, `spread`, `totals`
- `units`, `confidence`, `premium`, `status`, `result`

### 3. Subscription (`subscription.model.ts`)
- `userId`: ref to User
- `packageName`: `DAILY`, `WEEKLY`, `MONTHLY`, `SEASONAL`
- `selectedSport`: Array of `NFL`, `NBA`, `MLB`, `NHL`
- `price`, `status`: `PENDING`, `PAID`, `FAILED`, `CANCELLED`, `EXPIRED`, etc.
- `subscriptionStart`, `subscriptionEnd`, `nextBilling`
- `stripeSubscriptionId`, `stripeSessionId`, `paymentLink`

### 4. Affiliate (`affiliate.model.ts`)
- `userId`: ref to User
- `status`: `PENDING`, `APPROVED`, `DECLINED`
- `affiliateCode`: unique tracking code
- `website`, `socialLinks`, `notes`, `approvedAt`

### 5. Testimonial (`testimonial.model.ts`)
- `userId`: ref to User
- `name`, `email`, `location`, `title`
- `review`, `rating` (1-5)
- `status`: `PENDING`, `APPROVED`, `REJECTED`

---

## Application Flow

### 1. User Journey
1. **Registration**: User signs up -> verification email sent -> user verifies email.
2. **Subscription**: User navigates to packages -> chooses a plan -> pays via Stripe -> becomes a premium member.
3. **Picks**: User views free picks (public) or premium picks (dashboard).
4. **Dashboard**: User manages profile, views purchase history, and active subscriptions.

### 2. Admin Flow
1. **Manage Users**: View and manage all registered users.
2. **Manage Picks**: Create, update, and settle betting picks (win/loss).
3. **Manage Articles**: Create and edit blog posts.
4. **Affiliate Management**: Track referrals and manage commissions.
5. **Newsletter**: Create and send email campaigns to subscribers.

---

## Setup & Installation

### Backend
1. `cd backend`
2. `npm install`
3. Configure `.env` (refer to `.env.example`)
4. `npm run dev`

### Frontend
1. `cd frontend`
2. `npm install`
3. Configure `.env.local`
4. `npm run dev`
