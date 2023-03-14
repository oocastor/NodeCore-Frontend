/* eslint-disable */

import { createWebHistory, createRouter } from "vue-router";
import * as Vue from "vue";
import {app} from "@/main.js";

import Instances from "@/pages/instances.vue";
import Login from "@/pages/login.vue";

const routes = [
    {
        path: "/",
        name: "Instances",
        component: Instances,
        meta: {
            title: "Instances",
            needsAuth: true
        }
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
        meta: {
            title: "Login",
            needsAuth: false
        }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    Vue.nextTick(() => {
        document.title = `nodeup | ${to.meta.title}`;
    });
    if(!app.config.globalProperties.$STORAGE.authed && to.path !== "/login") {
        next({ path: "/login" })
        return;
    }
    next();
});

export default router;