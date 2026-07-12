# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies (project uses pnpm)
pnpm install

# Start development server
pnpm dev

# Build for production (type-checks with vue-tsc -b then builds)
# The -b flag is the build mode for incremental type checking
pnpm build

# Preview production build
pnpm preview
```

**Note:** This project uses **pnpm** as the package manager. This project does not have a test framework, ESLint, or Prettier configured.

## Tech Stack

- **Vue 3.5** with Composition API and `<script setup>` syntax
- **TypeScript** with strict type checking (uses project references: `tsconfig.app.json`, `tsconfig.node.json`)
- **Ant Design Vue 4.x** for UI components
- **Vue Router 4** for routing
- **Axios** for HTTP requests
- **Socket.io-client** for real-time payment notifications
- **Vue I18n** for internationalization (primary: Lao, secondary: English)
- **ECharts** with echarts-for-vue for dashboard visualization
- **Quill** and **TinyMCE** as rich text editors (`@tinymce/tinymce-vue`)
- **SASS** (`sass-embedded`) for styling
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

**Spelling note**: Most admin modules use `composible/` (misspelling), but a few use `composables/` (e.g., `src/common/composables/`, `src/modules/admin/payment/composables/`, `src/components/charts/composables/`). Follow the existing spelling in whichever directory you're working in.

**Cross-module usage**: Website modules can import and reuse admin module composables:
```vue
<!-- In src/modules/website/home/Home.vue -->
<script setup>
import { useBanner } from "../../admin/banner/composible";
const { fetchAll } = useBanner();
</script>
```

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

- **JWT-based** with token stored in localStorage as `token`
- **Route guard** at `src/common/guards/auth.guard.ts` protects all routes except public pages
- **Role-based access**: `admin`, `super-admin`, `customer` roles
- **User roles** stored in localStorage as `user_roles` key - can be JSON array or comma-separated string
- **Sidebar navigation** dynamically shows/hides menu items based on user role via `isAdminOrSuperAdmin` computed property
- **Default authenticated landing page**: `/customer` route
- **Special auth behavior**: Logged-in users accessing `/login` are redirected to `customer` route
- **Route-to-menu mapping**: Sidebar uses `routeToMenuKey` mapping object to highlight active menu item based on current route name

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
- Global socket instance at `src/common/utils/socket.util.ts` connects to `VITE_API_BASE_URL` using WebSocket transport
- **useSocketNotification composable** at `src/common/composables/useSocketNotification.ts`:
  - Auto-connects on first import (singleton pattern)
  - Listens to `payment_notification` events from backend
  - Maintains notifications list (max 50, prevents duplicates)
  - Provides reactive `unreadCount` and `recentNotifications` computed properties
  - Emits `payment_notification` custom window event for component listening
- **Audio notifications**: `playPaymentSound()` in `src/common/utils/notification.util.ts`
  - Pre-loads notification audio file from `src/assets/sounds/`
  - Handles browser autoplay restrictions with automatic unlock on user interaction
  - Audio is "unlocked" on first click, keypress, touch, or mousedown event

### Internationalization

- **Primary language**: Lao (`"lo"`)
- **Secondary**: English (`"en"`)
- Locale files in `src/locales/` (`en.json`, `lo.json`, `index.ts`)
- Locale preference persisted in localStorage as `locale` key (defaults to `"lo"`)
- Vue I18n configured in Composition API mode (`legacy: false`)
- Language switcher component available in AppHeader
- API calls include `lang: "lo"` header from localStorage for multi-language support
- Fallback locale is set to `"lo"`

### Component Organization

- **Admin layout**: `src/components/layouts/` — `Layout.vue` (sidebar + navbar + content), `Navbar.vue`, `Sidebar.vue`
- **Website layout**: `src/modules/website/components/` — `WebsiteLayout.vue`, `AppHeader.vue`, `AppFooter.vue`
- **Reusable**: `src/components/` — `AddButton.vue`, `LanguageSwitcher.vue`, `TextEditor.vue` (Quill)
- **Common**: `src/common/` — `configuration/`, `guards/`, `composables/`, `utils/`, `interface/`, `enums/`

### Styling

- **Global styles**: Both `src/assets/global.css` and `src/assets/style/global.scss` are imported in `main.ts`
- **Ant Design Vue** provides the primary component styling
- **Quill** rich text editor styles are imported from `quill/dist/quill.snow.css`

### Static Assets in Vite

**Video and image assets** stored in `src/assets/` must be referenced using relative imports from the component's location:
```typescript
// ✅ Correct - relative path from the component file
import step1Video from "../../../assets/videos/step1.mp4";

// ❌ Wrong - no @ alias is configured in vite.config.ts
import step1Video from "@/assets/videos/step1.mp4";
```

For videos requiring autoplay, browser policies require the `muted` attribute:
```vue
<video autoplay muted loop :src="videoSource" />
```

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

**Single file upload utility**: Some modules (e.g., banner) provide an `upload` helper:
```typescript
const { upload } = useBanner();
const imageUrl = await upload(file); // Returns URL string
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

**Loading state patterns**: Use granular loading states for better UX:
```typescript
const loadingBanners = ref(false);
const loadingVideos = ref(false);

async function loadBanners() {
  loadingBanners.value = true;
  try {
    // API call
  } finally {
    loadingBanners.value = false;
  }
}
```

This allows independent loading indicators for different data sources on the same page.

### Naming Conventions

- **Files**: kebab-case (`bank-currency.vue`, `add-video.vue`)
- **Components**: PascalCase (`BankCurrency`, `AddVideo`)
- **Interfaces**: PascalCase with `I` prefix (`IVideoForm`, `IUser`)
- **Composables**: PascalCase with `Composible` suffix (`VideoComposible`)
- **Utilities**: camelCase (`formatDate`, `formatNumber`)

### Key Modules

Admin modules are in `src/modules/admin/` (auth, dashboard, video, user, role, permission, customer, member, payment, banner, category, packages, qr-code, views, report). Website public pages are in `src/modules/website/` (home, about-us, contact, register, test). Browse the directories for specifics.

### External Documentation

- `openspec/` — OpenSpec change management directory. Contains:
  - `openspec/API_DOCUMENTATION.md`, `API_QUICK_REFERENCE.md`, `API_EXAMPLES.md` — backend API contract for report endpoints (request/response shapes, auth requirements, status enums, mock data)
  - `openspec/changes/` — in-flight change proposals with designs and tasks (e.g., `admin-report-pages/`, `customer-status-badge-redesign/`)
  - `openspec/specs/` — capability specifications
- `docs/dashboard-api-spec.md` — dashboard API specification
- `PROJECT_STRUCTURE.md` — long-form directory tree (overlaps with this file; treat CLAUDE.md as the source of truth and PROJECT_STRUCTURE.md as a deeper listing)
- `README.md` — Vue/Vite template boilerplate only; no project-specific content

### Deployment

- Deployed to **Netlify** (`netlify.toml`). Build command: `pnpm build`, publish directory: `dist`, Node 20, `NETLIFY_USE_PNPM=true`. SPA fallback redirects all routes to `/index.html`.

### Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL (e.g., `http://localhost:8000/api/`)

### TypeScript Configuration

- Uses TypeScript project references with `tsconfig.json`, `tsconfig.app.json`, and `tsconfig.node.json`
- Strict mode enabled with additional linting rules:
  - `noUnusedLocals` - Flags unused local variables
  - `noUnusedParameters` - Flags unused function parameters
  - `noFallthroughCasesInSwitch` - Requires explicit break/return in all switch cases
  - `erasableSyntaxOnly` - Only allows TypeScript syntax that can be erased
  - `noUncheckedSideEffectImports` - Validates side-effect imports
- Build command `pnpm build` runs `vue-tsc -b` for type checking before building

### Common Utilities

Utilities in `src/common/utils/`: `format-date.util.ts` (Day.js), `format-number.util.ts`, `notification.util.ts`, `socket.util.ts`.
