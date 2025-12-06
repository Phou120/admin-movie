import { createRouter, createWebHistory } from "vue-router";
import Layout from "./components/layouts/Layout.vue";
import LoginPage from "./modules/admin/auth/Login.vue";
import { authGuard } from "./common/guards/auth.guard";

// Website
import WebsiteHome from "./modules/website/home/Home.vue";

// Dashboard
import AdminDashboard from "./modules/admin/dashboard/DashBoard.vue";

// Available Admin Modules
import BankPage from "./modules/admin/bank/bank.vue";
import BankCurrencyPage from "./modules/admin/bank-currency/bank-currency.vue";
import CategoryPage from "./modules/admin/category/category.vue";
import RolePage from "./modules/admin/role/role.vue";
import TaxPage from "./modules/admin/tax/tax.vue";
import UserPage from "./modules/admin/user/user.vue";
import PermissionPage from "./modules/admin/permission/permission.vue";
import ProfilePage from "./modules/admin/user/profile/profile.vue";

// Banner
import BannerPage from "./modules/admin/banner/banner.vue";
import TagPage from "./modules/admin/tag/tag.vue";
import CurrencyPage from "./modules/admin/currency/currency.vue";
import ExchangeRatePage from "./modules/admin/exchange-rate/ExchangeRate.vue";
import PackagePage from "./modules/admin/packages/Packages.vue";

const routes = [
  // Public Routes
  {
    path: "/",
    name: "website",
    component: WebsiteHome,
    meta: {
      skipAuthCheck: true,
    },
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
    meta: {
      skipAuthCheck: true,
    },
  },

  // Admin Layout Routes
  {
    path: "/",
    name: "layout",
    component: Layout,
    children: [
      // Dashboard
      {
        path: "/dashboard",
        name: "dashboard",
        component: AdminDashboard,
      },
      {
        path: "/banner",
        name: "banner",
        component: BannerPage,
      },

      // User Management
      {
        path: "/user",
        name: "user",
        component: UserPage,
      },

      // Content Management
      {
        path: "/category",
        name: "category",
        component: CategoryPage,
      },

      {
        path: "/package",
        name: "package",
        component: PackagePage,
      },

      // Financial Management
      {
        path: "/bank",
        name: "bank",
        component: BankPage,
      },
      {
        path: "/bank-currency/:id",
        name: "bank-currency",
        component: BankCurrencyPage,
      },
      {
        path: "/currency",
        name: "currency",
        component: CurrencyPage,
      },
      {
        path: "/exchange-rate",
        name: "exchange-rate",
        component: ExchangeRatePage,
      },

      {
        path: "/tax",
        name: "tax",
        component: TaxPage,
      },

      {
        path: "/tag",
        name: "tag",
        component: TagPage,
      },

      // System Management
      {
        path: "/role",
        name: "role",
        component: RolePage,
      },

      {
        path: "/permission",
        name: "permission",
        component: PermissionPage,
      },

      {
        path: "/profile",
        name: "profile",
        component: ProfilePage,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

authGuard(router);

export default router;
