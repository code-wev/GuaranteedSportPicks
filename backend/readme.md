# GuaranteedSportPicks Backend API

## 🚀 Overview

The backend of **GuaranteedSportPicks** is a robust, production-ready API built with **Node.js**, **Express.js**, and **TypeScript**. It serves as the engine for the sports betting insights platform, managing user authentication, sports picks, subscription processing via Stripe, and content for the blog and testimonials.

## ✨ Core Features

-   **Modular Architecture**: Features are organized into self-contained modules (Auth, Picks, Subscription, etc.) for scalability and maintainability.
-   **Security First**:
    -   JWT-based authentication with role-based access (Admin/User).
    -   Secure password hashing with `bcryptjs`.
    -   Middleware for rate limiting, security headers (Helmet), and data sanitization.
-   **Payment Lifecycle**: Full Stripe integration with webhook support for real-time subscription status updates.
-   **Data Validation**: Strict request validation using **Zod** schemas.
-   **Email Services**: Automated email notifications for verification and password recovery using **Nodemailer**.
-   **File Management**: Integrated support for image and file uploads.

---

## 🛠️ Development Tools: Resource Generator CLI

To maintain consistency and speed up development, this project includes a custom CLI tool for generating resource-related files.

### CLI Overview

The Resource Generator CLI automatically generates route, model, controller, interface, and validation files based on a specified resource name.

### CLI Features

- **Generate Controller Files**: Create controller files with basic CRUD operations and response handling.
- **Generate Interface Files**: Create TypeScript interface files defining the structure of the resource.
- **Generate Model Files**: Create Mongoose model files with a defined schema.
- **Generate Route Files**: Create route files with standard RESTful endpoints for the specified resource.
- **Generate Service Files**: Create service files include standard RESTful endpoints for managing resources.
- **Generate Validation Files**: Create Zod validation schemas and middleware for request validation.

## Installation

**To install dependencies using npm**:

```bash
npm install
```

## Usage

**The CLI tool can be executed using the following command**:

```bash
npm run resource <resource-name>
```

### Example

To generate files for a resource named `blog`, run:

```bash
npm run resource blog
```

---

## 📂 Backend Structure

- `src/app.ts`: Main entry point with automated route loading.
- `src/modules/`: Feature modules containing logic for Auth, Picks, Subscription, etc.
- `src/model/`: Mongoose schemas and models.
- `src/utils/`: Utilities for JWT, Stripe, Email, and Logger.
- `src/handlers/`: Global handlers for errors and validations.
- `src/config/`: Application configuration and environment variables.

---

## Contact

For any questions or feedback, please contact [JoySarkar] at [developer.joysarkar@gmail.com].
