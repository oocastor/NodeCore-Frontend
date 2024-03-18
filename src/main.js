/* eslint-disable */

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import VueCookies from 'vue-cookies';

import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import VueDragscroll from "vue-dragscroll";

import {socket} from "@/bin/socket.js";
import {checkForAuthToken} from "@/bin/auth.js";
import {Event} from "@/bin/event";
import i18n from "@/bin/i18n";

import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import '/node_modules/primeflex/primeflex.css';

//import 'primevue/resources/themes/md-dark-deeppurple/theme.css';
import 'primevue/resources/themes/arya-green/theme.css';
// import 'primevue/resources/themes/soho-dark/theme.css';

const app = createApp(App);

app.use(router);

app.use(VueCookies, { expires: '7d'})

app.use(PrimeVue);
app.use(ConfirmationService);
app.use(ToastService);
app.use(i18n);
app.use(VueDragscroll);

//TODO: rework storage method
app.config.globalProperties.$STORAGE = {authed: false, socket};

let event = new Event();
app.config.globalProperties.$EVENT = event;

setInterval(() => event.emit("update"), 2000);

checkForAuthToken();

app.mount('#app');

export {
    app
}