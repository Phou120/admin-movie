import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import Antd from "ant-design-vue";
import i18n from "./locales";
import "./assets/global.css";
import "./assets/style/global.scss";
import "quill/dist/quill.snow.css";
import "flag-icons/css/flag-icons.min.css";

const app = createApp(App);
app.use(router);
app.use(Antd);
app.use(i18n);
app.mount("#app");
