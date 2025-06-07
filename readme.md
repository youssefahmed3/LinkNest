# LinkNest

LinkNest is a modern URL shortening service designed to create, manage, and track short URLs efficiently. Built with Next.js and a custom backend, LinkNest offers a rich set of features to make link management simple, secure, and user-friendly.

---

## Features

- ✅ **Short URL Creation**: Easily create short URLs for any long URL.
- ✅ **Unique Visit Tracking**: Track the number of unique visits to each short link.
- ✅ **Automatic Redirects**: Redirect users to the original URL when visiting a short slug.
- ✅ **Link Expiry**: Set expiration dates for links; expired links return a 410 Gone status.
- ✅ **QR Code Generation**: Generate QR codes for every short link for easy sharing.
- ✅ **User Authentication**: Session-based user authentication for personalized link management.
- ✅ **Frontend UI**: Interactive and responsive frontend built with Next.js and Shadcn UI components.

### Planned / Upcoming Features

- 🔲 **Password-Protected Links**: Add optional password protection for sensitive links.
- 🔲 **Custom Slugs**: Allow users to define custom short slugs (e.g., `/devien` instead of random strings).
- 🔲 **IP & Referrer Blocking**: Block specific IPs or referrers to prevent unwanted traffic.
- 🔲 **JWT Auth Middleware**: Enhance security with JWT verification middleware.

---

## Middleware

- ✅ **Logger Middleware**: Logs incoming requests and responses for monitoring.
- ✅ **Zod Validation Middleware**: Validates request body and URL parameters using Zod schema validation.
- ✅ **Rate Limiting Middleware**: Protects the shortening endpoint from abuse by limiting requests.
- ✅ **Link Expiry Check Middleware**: Checks link expiry and returns HTTP 410 Gone if expired.

---

## Tech Stack

- **Frontend**: Next.js, Shadcn UI
- **Backend**: Custom Express API with middleware layers (e.g., validation, logging)
- **Authentication**: Session-based authentication with better-auth (with future plans for JWT)
- **Database**: sqlite with Drizzle as ORM
- **Validation**: Zod
- **Rate Limiting**: express-rate-limit
- **QR Code Generation**: Server-side generation for each short URL

---

## Getting Started

### Prerequisites

- Node.js >= 18.x
- npm or yarn
- Database setup drizzle with a sqlite database
- Environment variables configured (e.g., DB connection, auth secrets)

### Installation

```bash
https://github.com/youssefahmed3/LinkNest.git
cd linknest
npm install
```
#### Frontend Installation 
```bash
cd frontend
npm install
```
#### backend Installation 
```bash
cd backend
npm install
```
## Environment Variables
```bash
NEXT_PUBLIC_BASE_URL
DB_FILE_NAME
BETTER_AUTH_SECRET
BASE_URL
```


