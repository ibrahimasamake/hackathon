# Backend Structure

```txt
apps/backend/src/main/java/com/farmers/app
  auth/
  users/
  farmers/
  products/
  orders/
  storage/
  admin/
  common/{config,exception,security,dto,util}
```

## Rules
- Controller -> Service -> Repository layering
- DTO contracts at API boundary
- No entity exposure in response contracts
- Flyway for schema + seed migrations
- JWT auth with refresh-token revocation
