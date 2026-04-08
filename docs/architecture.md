# Architecture

## Overview
- Frontend: Angular 21 standalone app in root (`src/`)
- Backend: Spring Boot 3 (Java 21) in `apps/backend`
- Database: PostgreSQL with Flyway migrations
- Storage: Cloudflare R2 metadata + secure upload flow
- Delivery: PWA-first web app with installable manifest and service worker

## Core Principles
- Feature-first modules
- DTO boundaries between API and domain
- Role-based security (ADMIN, FARMER, BUYER)
- Typed forms and strict models
- Reusable UI atoms in `shared/ui`

## Main Flows
1. Auth register/login/refresh with JWT access + refresh tokens
2. Farmer profile and product CRUD
3. Public marketplace search/filter/sort/paginate
4. Buyer order request lifecycle
5. Admin moderation and stats
6. Product image upload URL + confirm metadata persistence
