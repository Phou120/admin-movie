import type { Router } from "vue-router";

export function authGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    console.log(from);
    const accessToken = localStorage.getItem("token"); // ດຶງ token ຈາກ localStorage

    // ກວດສອບວ່າໜ້າໃດບໍ່ຕ້ອງການຢືນຢັນຕົວຕົນ (public pages)
    if (to.meta.skipAuthCheck) {
      console.log("⏭ Skipping auth check for public page:", to.name);

      // ຖ້າເປັນໜ້າ login ແລະມີ token ແລ້ວ ໃຫ້ redirect ໄປໜ້າ customer
      if (to.name === "login" && accessToken) {
        console.log(
          "🔄 Already have token, redirecting from login to customer"
        );
        next({ name: "customer" });
        return;
      }

      next(); // ໃຫ້ໄປຕໍ່ສຳລັບ public pages ອື່ນໆ
      return;
    }

    // ສຳລັບໜ້າທີ່ຕ້ອງການ authentication
    if (!accessToken) {
      // ບໍ່ມີ token ໃຫ້ redirect ໄປໜ້າ login
      console.log("🔒 No token found, redirecting to login");
      next({
        name: "login",
      });
    }

    // ມີ token ໃຫ້ໄປຕໍ່ໄດ້
    console.log("✅ Token found, allowing access to:", to.name);
    next();
  });
}