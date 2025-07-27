import { createRouter, createWebHistory } from "vue-router";
import CustomerPage from "./modules/customer/customer.vue";
import StudentPage from "./modules/student/student.vue";
import Layout from "./components/layouts/Layout.vue";
import LoginPage from "./modules/auth/Login.vue";
import { authGuard } from "./common/guards/auth.guard";
import HomePage from "./modules/home/Home.vue";
import CourseCategoryPage from "./modules/course-category/CourseCategory.vue";
import BashBoardPage from "./modules/dashboard/DashBoard.vue";
import CoursePage from "./modules/course/Course.vue";
import CourseDetail from "./modules/course/CourseDetail.vue";

const routes = [
  {
    path: "/",
    name: "layout",
    component: Layout,
    children: [
      {
        path: "/bashBoard",
        name: "bashBoard",
        component: BashBoardPage,
      },
      {
        path: "/customer",
        name: "customer",
        component: CustomerPage,
      },
      {
        path: "/student",
        name: "student",
        component: StudentPage,
      },
      {
        path: "/course-category",
        name: "course-category",
        component: CourseCategoryPage,
      },
      {
        path: "/course",
        name: "course",
        component: CoursePage,
      },
      {
        path: "/course_detail/:id",
        name: "detail",
        component: CourseDetail,
      },
    ],
  },
  {
    path: "/home",
    name: "home",
    component: HomePage,
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
    path: "/register",
    name: "register",
    component: () => import("./modules/customer/Register.vue"),
    meta: {
      skipAuthCheck: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

authGuard(router);

export default router;
