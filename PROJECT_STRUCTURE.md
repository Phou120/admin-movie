# Admin Movie System - Project Structure Documentation

## 📋 Project Overview

This is a **Vue 3 + TypeScript + Vite** based admin dashboard application for managing a movie/content management system with financial features. The project uses **Ant Design Vue** as the UI framework and follows a modular architecture pattern.

### 🛠 Tech Stack

- **Framework**: Vue 3 with Composition API (`<script setup>`)
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Library**: Ant Design Vue 4.x
- **HTTP Client**: Axios
- **State Management**: Vue 3 reactivity
- **Routing**: Vue Router 4
- **Package Manager**: pnpm
- **Styling**: SCSS (Sass)

## 📁 Directory Structure

```
admin-movie/
├── public/                     # Static public assets
├── src/                       # Source code
│   ├── assets/               # Static assets
│   │   ├── images/          # Images and logos
│   │   ├── style/           # Global SCSS styles
│   │   └── global.css       # Global CSS imports
│   ├── common/              # Shared utilities and configurations
│   │   ├── configuration/   # App configurations
│   │   │   └── axios.config.ts    # Axios HTTP client setup
│   │   ├── enums/           # TypeScript enums
│   │   │   └── status.enum.ts     # Status enumerations
│   │   ├── guards/          # Route guards
│   │   │   └── auth.guard.ts      # Authentication guard
│   │   ├── interface/       # TypeScript interfaces
│   │   │   └── pagination.interface.ts  # Pagination interface
│   │   └── utils/           # Utility functions
│   │       ├── notification.util.ts  # Notification utilities
│   │       ├── format-date.util.ts   # Date formatting
│   │       └── format-number.util.ts # Number formatting
│   ├── components/          # Reusable Vue components
│   │   ├── layouts/         # Layout components
│   │   │   ├── Layout.vue   # Main admin layout
│   │   │   ├── Navbar.vue   # Top navigation
│   │   │   └── Sidebar.vue  # Sidebar navigation
│   │   └── AddButton.vue    # Reusable add button
│   ├── modules/             # Feature modules
│   │   ├── website/         # Public website pages
│   │   │   ├── home/        # Homepage
│   │   │   └── test/        # Test page
│   │   └── admin/           # Admin panel modules
│   │       ├── auth/        # Authentication
│   │       ├── dashboard/   # Admin dashboard
│   │       ├── user/        # User management
│   │       ├── role/        # Role management
│   │       ├── permission/  # Permission management
│   │       ├── category/    # Content categories
│   │       ├── banner/      # Banner management
│   │       ├── tag/         # Tag management
│   │       ├── bank/        # Bank management
│   │       ├── currency/    # Currency management
│   │       ├── bank-currency/  # Bank-currency relationships
│   │       ├── exchange-rate/  # Exchange rates
│   │       ├── tax/         # Tax management
│   │       ├── packages/    # Package management
│   │       └── views/       # Additional views
│   ├── App.vue              # Root Vue component
│   ├── main.ts              # Application entry point
│   └── router.ts            # Vue Router configuration
├── .env                     # Environment variables
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore rules
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── pnpm-lock.yaml          # pnpm lock file
├── tsconfig.json           # TypeScript configuration
├── tsconfig.app.json       # App-specific TypeScript config
├── tsconfig.node.json      # Node-specific TypeScript config
└── vite.config.ts          # Vite build configuration
```

## 🏗 Architecture Patterns

### 1. Module-Based Architecture

Each admin module follows a consistent structure:

```
src/modules/admin/[module-name]/
├── [module-name].vue          # Main page component
├── components/               # Module-specific components
├── composible/               # API and business logic
│   └── index.ts             # Main composable function
├── interface/               # TypeScript interfaces
├── entity/                  # Data entities/models
└── [additional-files]       # Other module-specific files
```

### 2. Composable Pattern

The project uses Vue 3's Composition API with composables:

- **Location**: `src/modules/admin/[module]/composible/index.ts`
- **Purpose**: Encapsulates business logic and API calls
- **Benefits**: Reusable logic, clean separation of concerns
- **Example**: `BankComposible`, `UserComposible`, etc.

### 3. Interface-Driven Development

Strong TypeScript typing throughout:

- **Interfaces**: Defined in `interface/` folders within modules
- **Global Types**: Shared interfaces in `src/common/interface/`
- **Naming Convention**: `I*` prefix for interfaces, `*Entity` for models

### 4. API Integration

- **HTTP Client**: Axios with centralized configuration
- **Authentication**: JWT token injection via interceptors
- **Error Handling**: Centralized error handling
- **Headers**: Includes Lao language support (`lang: "lo"`)

## 🔧 Key Configuration Files

### package.json
```json
{
  "name": "apply_online",
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview"
  }
}
```

### vite.config.ts
- Simple Vite configuration with Vue plugin
- No additional optimizations configured

### .env
```
VITE_API_BASE_URL=http://127.0.0.1:3000/api/
```

### tsconfig.json
- References separate configs for app and Node environments
- Uses Vue's recommended TypeScript configuration
- Strict mode enabled

## 🚀 Features

### Core Admin Features

1. **Authentication & Authorization**
   - JWT-based login system
   - Role-based access control
   - Permission management
   - Auth route guards

2. **User Management**
   - CRUD operations for users
   - Profile management
   - Role assignment

3. **Content Management**
   - Categories
   - Banners
   - Tags
   - Package management

4. **Financial Management**
   - Bank management
   - Currency management
   - Exchange rates
   - Tax configuration

5. **System Features**
   - Dashboard with analytics
   - View tracking
   - Multilingual support (Lao)

### UI/UX Features

- **Responsive Design**: Mobile-friendly layouts
- **Dark/Light Mode**: Via Ant Design Vue theming
- **Data Tables**: Sortable, filterable tables
- **Forms**: Validation and error handling
- **Notifications**: Toast notifications for user feedback

## 📦 Development Workflow

### Installation
```bash
pnpm install
```

### Development Server
```bash
pnpm dev
```

### Build for Production
```bash
pnpm build
```

### Preview Production Build
```bash
pnpm preview
```

## 🎯 Notable Patterns

### 1. Language Support
- Primary language: Lao (`"lo"`)
- Suggests target market is Laos

### 2. File Uploads
- Supports image uploads
- Uses FormData for multipart requests
- Proper MIME type handling

### 3. Pagination
- Standardized pagination interface
- Consistent across all list views

### 4. Error Handling
- Global error interceptors
- User-friendly error messages
- Validation feedback

## 🔍 Module Details

### Admin Modules Overview

| Module | Purpose | Key Features |
|--------|---------|--------------|
| auth | User authentication | Login, logout, token refresh |
| dashboard | Admin dashboard | Statistics, charts, quick actions |
| user | User management | CRUD, profile, permissions |
| role | Role management | Role definitions, permissions |
| permission | Permission system | Fine-grained permissions |
| category | Content categories | Hierarchical categories |
| banner | Banner management | Image uploads, scheduling |
| tag | Tag system | Tag management for content |
| bank | Bank management | Bank information |
| currency | Currency management | Multi-currency support |
| bank-currency | Relationships | Bank-currency mappings |
| exchange-rate | Exchange rates | Currency conversion |
| tax | Tax management | Tax rates and calculations |
| packages | Package management | Service packages |
| views | View tracking | Page view analytics |

## 📝 Best Practices

### 1. Code Organization
- Feature-based module structure
- Consistent naming conventions
- Clear separation of concerns

### 2. TypeScript Usage
- Strict type checking
- Interface definitions for all data structures
- Type-safe API calls

### 3. Vue 3 Patterns
- Composition API with `<script setup>`
- Reactive data management
- Composables for reusable logic

### 4. API Design
- RESTful endpoints
- Consistent response formats
- Proper HTTP status codes

## 🚀 Future Enhancements

Potential areas for expansion:

1. **Testing**: Unit tests with Vitest, E2E tests with Cypress
2. **State Management**: Pinia for complex state scenarios
3. **Internationalization**: Vue I18n for multi-language support
4. **PWA**: Progressive Web App capabilities
5. **Performance**: Code splitting, lazy loading
6. **Monitoring**: Error tracking, analytics integration

## 📚 Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Ant Design Vue](https://antdv.com/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

*Generated on: 2025-12-06*
*Project Version: 0.0.0*