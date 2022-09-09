import { createApp } from "vue";

import store from "@/store/index";
import router from "@/router/index";
import Vant from "vant";
import { io } from "socket.io-client";
import "vant/lib/index.css";
import App from "./App.vue";
import "./style.css";

// interface ServerToClientEvents {
//   noArg: () => void;
//   basicEmit: (a: number, b: string, c: Buffer) => void;
//   withAck: (d: string, callback: (e: number) => void) => void;
// }
// interface ClientToServerEvents {
//   hello: () => void;
// }

const app = createApp(App);
const mySocket = io("http://localhost:3100");
// const mySocket = io("http://localhost:3100");

// const mySocket = firsetSocket.connected
//   ? firsetSocket
//   : io("http://localhost:3100");
// console.log(111, mySocket.connected, firsetSocket.connected);
// app.provide("$socket", );
app.provide("$socket", mySocket);
app.use(router);
app.use(store);
app.use(Vant);
app.mount("#app");
