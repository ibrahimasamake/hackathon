# API

Base URL: `/api`

## Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

## Farmers
- `GET /farmers/me`
- `PUT /farmers/me`
- `GET /farmers/{id}`

## Products
- `POST /products`
- `PUT /products/{id}`
- `DELETE /products/{id}`
- `GET /products/my`
- `GET /products/{id}`
- `GET /public/products?q=&category=&location=&availability=&sort=&page=&size=`
- `PATCH /products/{id}/publish`
- `PATCH /products/{id}/unpublish`

## Orders
- `POST /orders`
- `GET /orders/my-buyer-requests`
- `GET /orders/my-farmer-requests`
- `PATCH /orders/{id}/accept`
- `PATCH /orders/{id}/reject`
- `PATCH /orders/{id}/complete`

## Storage
- `POST /storage/product-image/upload-url`
- `POST /storage/product-image/confirm`

## Admin
- `GET /admin/stats`
- `GET /admin/users`
- `GET /admin/products`
- `PATCH /admin/products/{id}/flag`
- `PATCH /admin/products/{id}/approve`
