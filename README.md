# User Service and Authentication
  
[![Node.js Version](https://img.shields.io/badge/node.js-18.x-brightgreen)](https://nodejs.org/)
[![Supabase](https://img.shields.io/badge/supabase-required-blue)](https://supabase.io/)
[![Resend](https://img.shields.io/badge/resend-required-blue)](https://resend.com/)
[![JWT](https://img.shields.io/badge/jwt-required-blue)](https://jwt.io/)
[![Docker](https://img.shields.io/badge/docker-available-blue)](https://www.docker.com/)

The **User Service** is a microservice designed for handling user authentication and management. It includes functionalities like user signup, login, password reset, and profile management. This service can be deployed independently and easily integrated with other microservices.

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Clone the Repository](#clone-the-repository)
  - [Install Dependencies](#install-dependencies)
- [Environment Variables](#environment-variables)
- [Running the Service](#running-the-service)
  - [Locally](#locally)
  - [Using Docker](#using-docker)
- [API Endpoints](#api-endpoints)
  - [Authentication Endpoints](#authentication-endpoints)
  - [User Management Endpoints](#user-management-endpoints)
  - [Admin Endpoints](#admin-endpoints)
- [Testing](#testing)
- [Common Errors and Troubleshooting](#common-errors-and-troubleshooting)
- [License](#license)

---

## Features

- **User Authentication**: Secure login and signup functionality.
- **Password Management**: Password hashing, password reset, and email verification.
- **Role-based Access Control**: Middleware to restrict access to admin-only routes.
- **Token-Based Authentication**: Uses JWT (JSON Web Tokens) for access and refresh tokens.
- **Environment Configuration**: Easily configurable through environment variables.

---

## Prerequisites

- **Node.js** (version 18.x or later)
- **npm** (Node Package Manager)
- **Docker** (optional, for containerization)
- **Supabase**: Required for database interactions. You'll need a Supabase account and project.

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/user-service.git
cd user-service
```

### Install Dependencies
  
```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the root directory of the project and add the following environment variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key

# JWT Configuration
JWT_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret

# Email Configuration
RESEND_API_KEY=your-resend-api-key
RESEND_DEFAULT_EMAIL=your-resend-email
RECIPIENT_TEST_EMAIL=your-test-email
```

---

## Running the Service

### Locally

To run the service locally, use the following command:

```bash
npm run dev
```

### Using Docker

To run the service using Docker, use the following commands:

```bash
docker build -t user-service .
docker run -p 3000:3000 user-service
```

---

## API Endpoints

### Authentication Endpoints

- **POST /auth/login**: Authenticate a user and generate access and refresh tokens.
- **POST /auth/logout**: Invalidate the refresh token.
- **POST /auth/forgot-password**: Send a password reset link to the user's email.
- **POST /api/auth/verify-reset-code**: Verify the password reset code.

### User Management Endpoints

- **POST /user/signup**: Register a new user.
- **GET /user/reset-password**: Reset the user's password.
- **GET /user/**: Get the user's profile.

### Admin Endpoints

- **GET /admin/users**: Get all users.
- **GET /admin/user/:id**: Get a user by ID.

---

## Testing

To run the tests, use the following command:

```bash
npm test
```

---

## Common Errors and Troubleshooting

- **Nothing yet!**

---

## License
