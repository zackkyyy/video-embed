import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { MediaPlayer, MediaProvider } from "vidstack";

const app = createApp(App);

app.mount("#app");
