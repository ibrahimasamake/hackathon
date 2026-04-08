# Frontend Structure

```txt
src/app/
  core/
  shared/ui/
  features/{auth,marketplace,products,farmer-profile,dashboard,orders,admin}
  layout/
```

## Rules
- Standalone components only
- OnPush change detection
- Typed reactive forms
- Route-level lazy loading
- Signals for local state
- Shared primitives in `shared/ui`
