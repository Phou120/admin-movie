# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
pnpm dev

# Build for production (type-checks with vue-tsc -b then builds)
pnpm build

# Preview production build
pnpm preview
```

**Note:** This project does not have a test framework configured.

## Tech Stack

- **Vue 3.5** with Composition API and `<script setup>` syntax
- **TypeScript** with strict type checking (uses project references: `tsconfig.app.json`, `tsconfig.node.json`)
- **Ant Design Vue 4.x** for UI components
- **Vue Router 4** for routing
- **Axios** for HTTP requests
- **Socket.io-client** for real-time payment notifications
- **Vue I18n** for internationalization (primary: Lao, secondary: English)
- **Quill** and **TinyMCE** as rich text editors (`@tinymce/tinymce-vue`)
- **SASS** for styling
- **Vite** as build tool

## Architecture Overview

### Module Structure

The application has two main module areas:

**Admin Panel** (`src/modules/admin/`):
```
src/modules/admin/
├── [module-name]/
│   ├── [module].vue           # Main list/page component
│   ├── components/            # Module-specific components (modals, forms)
│   ├── composible/            # Business logic & API calls
│   └── interface/             # TypeScript interfaces
```

**Public Website** (`src/modules/website/`):
```
src/modules/website/
├── [page-name]/               # Public pages (home, about-us, contact, register)
│   └── [Page].vue             # Page component
└── components/                # Website-specific layout components
    ├── WebsiteLayout.vue      # Main website layout wrapper
    ├── AppHeader.vue          # Global header with nav and language switcher
    └── AppFooter.vue          # Global footer
```

Each admin module is self-contained with its own composible (business logic), components, and interfaces.

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
- Automatically injects JWT token from localStorage via `Authorization: Bearer {token}`
- Automatically adds `lang` header from localStorage (defaults to `"lo"` for Lao)
- Uses `VITE_API_BASE_URL` environment variable
- Handles global error logging

For file uploads, set `Content-Type: "multipart/form-data"` and use FormData.

### Authentication & Authorization

- **JWT-based** with token stored in localStorage
- **Route guard** at `src/common/guards/auth.guard.ts` protects all routes except public pages
- **Role-based access**: `admin`, `super-admin`, `customer` roles
- **Sidebar navigation** dynamically shows/hides menu items based on user role
- **Default authenticated landing page**: `/customer` route
- **Special auth behavior**: Logged-in users accessing `/login` are redirected to `customer` route

### Routing Structure

Routes are defined in `src/router.ts`:

**Public Routes** (with `skipAuthCheck: true` meta):
- `/`, `/about-us`, `/contact`, `/register` - Website pages
- `/login`, `/forgot-password`, `/verify-otp`, `/reset-password` - Authentication pages

**Protected Routes** (nested under `Layout` component):
- `/dashboard`, `/user`, `/customer`, `/video`, etc. - Admin pages requiring authentication
- Lazy loading is used for some components

Route patterns:
- List: `/[resource]`
- Create: `/[resource]/create` or `/[resource]/add`
- Edit: `/[resource]/edit/:id`
- View: `/[resource]/view/:id`
- Nested resource: `/[parent]/:parentId/[child]` (e.g., `/member/:memberId/payments`)

### State Management

**No Pinia or Vuex** - The application uses:
- Vue 3 reactivity (`ref`, `reactive`)
- Component-level state
- localStorage for persistence (user data, tokens, preferences)

### Real-time Features

- **Socket.io** integration for payment notifications
- Global socket instance at `src/common/utils/socket.util.ts` connects to `VITE_API_BASE_URL`
- Sound notifications when payments are received
- Composable at `src/common/composables/useSocketNotification.ts` handles notification logic

### Internationalization

- **Primary language**: Lao
- **Secondary**: English
- Locale files in `src/locales/`
- Language switcher component available
- API calls include `lang: "lo"` header for multi-language support

### Component Organization

**Admin Layout Components** (`src/components/layouts/`):
- `Layout.vue` - Main layout wrapper for admin panel
- `Navbar.vue` - Top navigation bar
- `Sidebar.vue` - Dynamic sidebar with role-based menu items

**Website Layout Components** (`src/modules/website/components/`):
- `WebsiteLayout.vue` - Main layout wrapper for public pages (includes AppHeader/AppFooter)
- `AppHeader.vue` - Global header with logo, navigation, language switcher, auth buttons
- `AppFooter.vue` - Global footer with copyright

**Reusable Components** (`src/components/`):
- `AddButton.vue` - Standardized add button
- `LanguageSwitcher.vue` - Language toggle
- `TextEditor.vue` - Rich text editor component (uses Quill)

**Common Directory** (`src/common/`):
- `configuration/` - Axios instance and app configuration
- `guards/` - Route guards (authentication)
- `composables/` - Shared composables (e.g., socket notifications)
- `utils/` - Utility functions (date/number formatting, notifications, socket)
- `interface/` - Shared TypeScript interfaces (e.g., pagination)
- `enums/` - Shared enums (e.g., status)

### Styling

- **Global styles**: Both `src/assets/global.css` and `src/assets/style/global.scss` are imported in `main.ts`
- **Ant Design Vue** provides the primary component styling
- **Quill** rich text editor styles are imported from `quill/dist/quill.snow.css`

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

**Array handling in FormData**: When sending arrays (e.g., multiple categories), use bracket notation:
```typescript
if (formUpdate.category_id && Array.isArray(formUpdate.category_id)) {
  formUpdate.category_id.forEach((categoryId: number, index: number) => {
    formData.append(`category_id[${index}]`, categoryId.toString());
  });
}
```

**Update pattern for optional file replacement**:
- `undefined` = skip field (keep existing file)
- `null` = explicitly remove file (send string `"null"` in FormData)
- `File` object = replace with new file

**FormData updates**: Append `_method: "PUT"` when the backend requires method override for POST requests.

### Pagination Pattern

All list views follow the same pattern:
```typescript
const fetchAll = async (page: number, limit: number, search: string = "") => {
  const response = await apiClient.get("/resource", {
    params: { page, limit, search }
  });
  return response.data;
};
```

**Expected API response structure:**
- List endpoints: `{ data: [], total: number }`
- Single item/detail endpoints: `{ data: {} }`
- Use `response.data.data` to access the actual array or object

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
| `customer/member` | User profile and member management |
| `payment` | Payment processing with real-time notifications |
| `banner/category/package` | Content and service management |
| `qr-code` | QR code generation and management |
| `views` | Page view analytics tracking |

**Website Modules** (public pages under `src/modules/website/`):
| Module | Purpose |
|--------|---------|
| `home` | Landing page |
| `about-us` | About information page |
| `contact` | Contact form page |
| `register` | User registration page |

### Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL

### Common Utilities

- `src/common/utils/format-date.util.ts` - Date formatting with Day.js
- `src/common/utils/format-number.util.ts` - Number formatting
- `src/common/utils/notification.util.ts` - User notifications
- `src/common/utils/socket.util.ts` - Global Socket.io connection instance
