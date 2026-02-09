import { createRouter, createWebHistory } from "vue-router";
import Layout from "./components/layouts/Layout.vue";
import LoginPage from "./modules/admin/auth/Login.vue";
import { authGuard } from "./common/guards/auth.guard";

// Website
// import WebsiteHome from "./modules/website/home/Home.vue";

// Dashboard
import AdminDashboard from "./modules/admin/dashboard/DashBoard.vue";

// Available Admin Modules
import BankPage from "./modules/admin/bank/bank.vue";
import BankCurrencyPage from "./modules/admin/bank-currency/bank-currency.vue";
import CategoryPage from "./modules/admin/category/category.vue";
import RolePage from "./modules/admin/role/role.vue";
import AddRolePage from "./modules/admin/role/components/addRole.vue";
import UpdateRolePage from "./modules/admin/role/components/updateRole.vue";
import UserPage from "./modules/admin/user/user.vue";
import AddUserPage from "./modules/admin/user/components/addUser.vue";
import UpdateUserPage from "./modules/admin/user/components/updateUser.vue";
import PermissionPage from "./modules/admin/permission/permission.vue";
import ProfilePage from "./modules/admin/user/profile/profile.vue";
import CustomerPage from "./modules/admin/customer/Customer.vue";
import AddCustomerPage from "./modules/admin/customer/components/AddCustomer.vue";
import EditCustomerPage from "./modules/admin/customer/components/EditCustomer.vue";
import ViewCustomerPage from "./modules/admin/customer/components/ViewCustomer.vue";

// Member Module
import MemberPage from "./modules/admin/member/Member.vue";
import ViewMemberPage from "./modules/admin/member/components/ViewMember.vue";

// Banner
import BannerPage from "./modules/admin/banner/banner.vue";
import CurrencyPage from "./modules/admin/currency/currency.vue";
import PackagePage from "./modules/admin/packages/Packages.vue";

// Video Module
import VideoPage from "./modules/admin/video/video.vue";
import AddVideoPage from "./modules/admin/video/components/AddVideo.vue";
import EditVideoPage from "./modules/admin/video/components/EditVideo.vue";

// Payment Module
import PaymentPage from "./modules/admin/payment/payment.vue";
import PaymentListPage from "./modules/admin/payment/payment-list.vue";

// QR Code Module
import QrCodePage from "./modules/admin/qr-code/qr-code.vue";

const routes = [
  // Public Routes
  // {
  //   path: "/",
  //   name: "website",
  //   component: WebsiteHome,
  //   meta: {
  //     skipAuthCheck: true,
  //   },
  // },
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
      {
        path: "/user/add",
        name: "addUser",
        component: AddUserPage,
      },
      {
        path: "/user/:id/edit",
        name: "updateUser",
        component: UpdateUserPage,
      },
      {
        path: "/customer",
        name: "customer",
        component: CustomerPage,
      },
      {
        path: "/customer/add",
        name: "add-customer",
        component: AddCustomerPage,
      },
      {
        path: "/customer/edit/:id",
        name: "edit-customer",
        component: EditCustomerPage,
      },
      {
        path: "/customer/view/:id",
        name: "view-customer",
        component: ViewCustomerPage,
      },

      // Member Management
      {
        path: "/member",
        name: "member",
        component: MemberPage,
      },
      {
        path: "/member/view/:id",
        name: "view-member",
        component: ViewMemberPage,
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

      // Payment Management
      {
        path: "/payment",
        name: "payment",
        component: PaymentListPage,
      },
      {
        path: "/member/:memberId/payments",
        name: "member-payments",
        component: PaymentPage,
      },
      {
        path: "/payment/:id",
        name: "payment-detail",
        component: () =>
          import("./modules/admin/payment/components/PaymentDetailView.vue"),
      },

      // QR Code Management
      {
        path: "/qr-code",
        name: "qr-code",
        component: QrCodePage,
      },

      // Video Management
      {
        path: "/video",
        name: "video",
        component: VideoPage,
      },
      {
        path: "/video/create",
        name: "create-video",
        component: AddVideoPage,
      },
      {
        path: "/video/edit/:id",
        name: "edit-video",
        component: EditVideoPage,
      },

      // System Management
      {
        path: "/role",
        name: "role",
        component: RolePage,
      },
      {
        path: "/role/add",
        name: "addRole",
        component: AddRolePage,
      },
      {
        path: "/role/:id/edit",
        name: "updateRole",
        component: UpdateRolePage,
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
