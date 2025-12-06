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
        path: "/bashBoard",
        name: "bashBoard",
        component: AdminDashboard,
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
        path: "/tax",
        name: "tax",
        component: TaxPage,
      },

      // System Management
      {
        path: "/role",
        name: "role",
        component: RolePage,
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
