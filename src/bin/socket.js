import SocketIO from 'socket.io-client';
import router from "@/router/index";
import {app} from "@/main";

const socket = SocketIO('http://localhost:3001');

socket.on("goto:login", (data) => {
    let event = app.config.globalProperties.$EVENT;
    let {msg} = data;
    router.push("/login");
    event.emit("loginError", msg);
});

export {
    socket
}