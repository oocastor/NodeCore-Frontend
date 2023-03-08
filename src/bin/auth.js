import { app } from "@/main.js";
import VueCookies from 'vue-cookies';
import router from "@/router/index";

function loginWithPw(user) {
    if(user.name == "" || user.pw == "") return;
    const storage = app.config.globalProperties.$STORAGE;

    storage.socket.emit("auth:pw", user, (token) => {
        if(user.rememberMe) VueCookies.set("token", token);
        storage.token = token;
        storage.authed = true;
        router.push("/");
    });
}

function checkForAuthToken() {
    const storage = app.config.globalProperties.$STORAGE;

    let token = VueCookies.get("token");
    if (!token) return;

    storage.socket.emit("auth:token", token, (newToken) => {
        storage.authed = true;
        router.push("/");
        VueCookies.set("token", newToken);
    });
}

function logout () {
    const storage = app.config.globalProperties.$STORAGE;
    storage.token = "";
    storage.authed = false;
    VueCookies.remove("token");
    router.push("/login");
}

export {
    checkForAuthToken,
    loginWithPw,
    logout
}