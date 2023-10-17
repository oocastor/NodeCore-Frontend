import SocketIO from 'socket.io-client';
import router from "@/router/index";
import {app} from "@/main";

//const socket = SocketIO("http://localhost:1001");
const socket = SocketIO("https://gaming-hour.com", {
    transports: ['websocket']
});

socket.on("goto:login", (data) => {
    let event = app.config.globalProperties.$EVENT;
    let {msg} = data;
    router.push("/login");
    event.emit("loginError", msg);
});

export {
    socket
}