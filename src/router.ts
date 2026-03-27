import { createRouter, createWebHistory } from "vue-router";
import Layout from "./components/layouts/Layout.vue";
import LoginPage from "./modules/admin/auth/Login.vue";
import { authGuard } from "./common/guards/auth.guard";

// Website
// import WebsiteHome from "./modules/website/home/Home.vue";
import AboutUs from "./modules/website/about-us/AboutUs.vue";
import Contact from "./modules/website/contact/Contact.vue";
import Register from "./modules/website/register/Register.vue";

// Auth Pages
import ForgotPassword from "./modules/admin/auth/components/forgotPassword.vue";
import VerifyOTP from "./modules/admin/auth/components/verifyOTP.vue";
import ResetPassword from "./modules/admin/auth/components/resetPassword.vue";

// Dashboard
import DashboardWrapper from "./modules/admin/dashboard/DashboardWrapper.vue";

// Available Admin Modules
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
import ViewPage from "./modules/admin/views/Views.vue";

// Member Module
import MemberPage from "./modules/admin/member/Member.vue";
import ViewMemberPage from "./modules/admin/member/components/ViewMember.vue";

// Banner
import BannerPage from "./modules/admin/banner/banner.vue";
import PackagePage from "./modules/admin/packages/Packages.vue";

// Video Module
import VideoPage from "./modules/admin/video/video.vue";
import AddVideoPage from "./modules/admin/video/components/AddVideo.vue";
import EditVideoPage from "./modules/admin/video/components/EditVideo.vue";
import ViewVideoPage from "./modules/admin/video/components/ViewVideo.vue";

// Payment Module
import PaymentPage from "./modules/admin/payment/payment.vue";
import PaymentListPage from "./modules/admin/payment/payment-list.vue";

// QR Code Module
import QrCodePage from "./modules/admin/qr-code/qr-code.vue";

// Report Modules
import ReportVideoPage from "./modules/admin/report/video/ReportVideo.vue";
import ReportUserPage from "./modules/admin/report/user/ReportUser.vue";
import ReportPackagePage from "./modules/admin/report/package/ReportPackage.vue";
import ReportPaymentPage from "./modules/admin/report/payment/ReportPayment.vue";

// Website
import WebsiteHome from "./modules/website/home/Home.vue";

const routes = [
  // Public Routes
  {
    path: "/",
    name: "home",
    component: WebsiteHome,
    meta: {
      skipAuthCheck: true,
    },
  },
  {
    path: "/about-us",
    name: "about-us",
    component: AboutUs,
    meta: {
      skipAuthCheck: true,
    },
  },
  {
    path: "/contact",
    name: "contact",
    component: Contact,
    meta: {
      skipAuthCheck: true,
    },
  },
  {
    path: "/register",
    name: "register",
    component: Register,
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
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: ForgotPassword,
    meta: {
      skipAuthCheck: true,
    },
  },
  {
    path: "/verify-otp",
    name: "verifyOTP",
    component: VerifyOTP,
    meta: {
      skipAuthCheck: true,
    },
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: ResetPassword,
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
        component: DashboardWrapper,
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
        path: "/view",
        name: "view",
        component: ViewPage,
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
      {
        path: "/video/view/:id",
        name: "view-video",
        component: ViewVideoPage,
      },

      // Report Pages
      {
        path: "/admin/report/report-video",
        name: "report-video",
        component: ReportVideoPage,
      },
      {
        path: "/admin/report/report-user",
        name: "report-user",
        component: ReportUserPage,
      },
      {
        path: "/admin/report/report-package",
        name: "report-package",
        component: ReportPackagePage,
      },
      {
        path: "/admin/report/report-payment",
        name: "report-payment",
        component: ReportPaymentPage,
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
