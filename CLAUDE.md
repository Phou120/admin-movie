# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
pnpm dev

# Build for production (runs type check then build)
pnpm build

# Preview production build
pnpm preview
```

## Tech Stack

- **Vue 3.5** with Composition API and `<script setup>` syntax
- **TypeScript** with strict type checking
- **Ant Design Vue 4.x** for UI components
- **Vue Router 4** for routing
- **Axios** for HTTP requests
- **Socket.io-client** for real-time payment notifications
- **Vue I18n** for internationalization (primary: Lao, secondary: English)
- **Vite** as build tool

## Architecture Overview

### Module Structure

The application follows a feature-based module structure under `src/modules/admin/`:

```
src/modules/admin/
├── [module-name]/
│   ├── [module].vue           # Main list/page component
│   ├── components/            # Module-specific components (modals, forms)
│   ├── composible/            # Business logic & API calls
│   └── interface/             # TypeScript interfaces
```

Each module is self-contained with its own composible (business logic), components, and interfaces.

### Composable Pattern

**All business logic and API calls are centralized in `composible/index.ts`** (note: directory is spelled "composible" not "composable").

A composible exports a function that returns API methods:
```typescript
// src/modules/admin/video/composible/index.ts
export function VideoComposible() {
  const fetchAll = async (page, limit, search, ...) => { /* ... */ };
  const createVideo = async (form) => { /* ... */ };
  // ...

  return { fetchAll, createVideo, /* ... */ };
}
```

Usage in components:
```vue
<script setup>
import { VideoComposible } from './composible';

const { fetchAll, createVideo } = VideoComposible();
</script>
```

### HTTP Client Configuration

The centralized Axios instance at `src/common/configuration/axios.config.ts`:
- Automatically injects JWT token from localStorage
- Uses `VITE_API_BASE_URL` environment variable
- Handles global error logging

For file uploads, set `Content-Type: "multipart/form-data"` and use FormData.

### Authentication & Authorization

- **JWT-based** with token stored in localStorage
- **Route guard** at `src/common/guards/auth.guard.ts` protects all routes except login
- **Role-based access**: `admin`, `super-admin`, `customer` roles
- The sidebar navigation dynamically shows/hides menu items based on user role

### Routing Structure

Routes are defined in `src/router.ts`:
- `/login` - Public route (skips auth check)
- All other routes are nested under the `Layout` component
- Admin routes require authentication
- Lazy loading is used for some components

Route patterns:
- List: `/[resource]`
- Create: `/[resource]/create` or `/[resource]/add`
- Edit: `/[resource]/edit/:id`
- View: `/[resource]/view/:id`

### State Management

**No Pinia or Vuex** - The application uses:
- Vue 3 reactivity (`ref`, `reactive`)
- Component-level state
- localStorage for persistence (user data, tokens, preferences)

### Real-time Features

- **Socket.io** integration for payment notifications
- Sound notifications when payments are received
- Composable at `src/common/composables/useSocketNotification.ts`
- Socket utilities at `src/common/utils/socket.util.ts`

### Internationalization

- **Primary language**: Lao
- **Secondary**: English
- Locale files in `src/locales/`
- Language switcher component available
- API calls include `lang: "lo"` header for multi-language support

### Component Organization

**Layout Components** (`src/components/layouts/`):
- `Layout.vue` - Main layout wrapper
- `Navbar.vue` - Top navigation bar
- `Sidebar.vue` - Dynamic sidebar with role-based menu items

**Reusable Components** (`src/components/`):
- `AddButton.vue` - Standardized add button
- `LanguageSwitcher.vue` - Language toggle
- `TextEditor.vue` - Rich text editor component

### File Upload Pattern

For forms with file uploads (images, videos):
```typescript
const formData = new FormData();
formData.append("field", value);
if (file) formData.append("file_field", file);

await apiClient.post("/endpoint", formData, {
  headers: { "Content-Type": "multipart/form-data" }
});
```

For updates, use `_method: "PUT"` in FormData when the backend requires it.

### Pagination Pattern

All list views follow the same pattern:
```typescript
const fetchAll = async (page: number, limit: number, search: string = "") => {
  const response = await apiClient.get("/resource", {
    params: { page, limit, search }
  });
  return response.data; // Expected: { data: [], total: number }
};
```

### Naming Conventions

- **Files**: kebab-case (`bank-currency.vue`, `add-video.vue`)
- **Components**: PascalCase (`BankCurrency`, `AddVideo`)
- **Interfaces**: PascalCase with `I` prefix (`IVideoForm`, `IUser`)
- **Composables**: PascalCase with `Composible` suffix (`VideoComposible`)
- **Utilities**: camelCase (`formatDate`, `formatNumber`)

### Key Modules

| Module | Purpose |
|--------|---------|
| `auth` | Login, password reset, OTP verification |
| `dashboard` | Statistics and overview |
| `video` | Content CRUD with file uploads |
| `user/role/permission` | User and access management |
| `customer/member` | User profile management |
| `bank/currency` | Financial configuration |
| `payment` | Payment processing with real-time notifications |
| `banner/category/package` | Content and service management |

### Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL

### Common Utilities

- `src/common/utils/format-date.util.ts` - Date formatting with Day.js
- `src/common/utils/format-number.util.ts` - Number formatting
- `src/common/utils/notification.util.ts` - User notifications
