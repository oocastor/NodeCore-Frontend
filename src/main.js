/* eslint-disable */

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import VueCookies from 'vue-cookies'

import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import {socket} from "@/bin/socket.js";
import {checkForAuthToken} from "@/bin/auth.js";
import {Event} from "@/bin/event";

//TODO: import components in each vue separately
import { loadComponents } from './bin/component.js';

import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import '/node_modules/primeflex/primeflex.css';

//import 'primevue/resources/themes/md-dark-deeppurple/theme.css';
//import 'primevue/resources/themes/arya-green/theme.css';
import 'primevue/resources/themes/soho-dark/theme.css';

const app = createApp(App);

app.use(router);

app.use(VueCookies, { expires: '7d'})

app.use(PrimeVue);
app.use(ConfirmationService);
app.use(ToastService);

//TODO: rework storage method
app.config.globalProperties.$STORAGE = {authed: false, socket};
app.config.globalProperties.$EVENT = new Event();

checkForAuthToken();
loadComponents(app);

app.mount('#app');

export {
    app
}