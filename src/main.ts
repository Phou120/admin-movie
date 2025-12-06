import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import Antd from "ant-design-vue";
import "./assets/global.css";
import "./assets/style/global.scss";
import "quill/dist/quill.snow.css";

const app = createApp(App);
app.use(router);
app.use(Antd);
app.mount("#app");
