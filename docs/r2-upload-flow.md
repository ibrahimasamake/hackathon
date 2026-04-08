# R2 Upload Flow

## Object Key Convention
`farmers/{farmerId}/products/{productId}/{uuid}-{filename}`

## Supported Upload Modes
1. Direct backend upload (default in this app):
   - Frontend sends multipart form data to `POST /api/storage/product-image/upload`
   - Backend uploads to R2 and stores metadata in `product_images`
2. Presigned flow (Sougba-compatible):
   - `POST /api/storage/product-image/upload-url`
   - Upload binary to presigned URL
   - `POST /api/storage/product-image/confirm`

## Validation
- Allowed mime types from `R2_ALLOWED_MIME`
- Max size from `R2_MAX_FILE_MB`
- Ownership check: farmer can only upload to own product

## Sougba-Compatible Environment Keys
The backend accepts both key styles:
- `R2_ACCESS_KEY_ID` or `R2_ACCESS_KEY`
- `R2_SECRET_ACCESS_KEY` or `R2_SECRET_KEY`
- `R2_PUBLIC_BASE_URL` or `R2_PUBLIC_URL`

Recommended values for Sougba integration:
- `R2_BUCKET=files-sougba`
- `R2_PUBLIC_URL=https://files.sougba.com`
- `R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com`
