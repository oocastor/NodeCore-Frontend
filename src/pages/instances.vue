<template>
    <div class="flex flex-column h-full" style="min-width: 400px;">
        <div class="w-full surface-card flex justify-content-between align-items-center px-3" style="min-height: 60px;">
            <div class="text-4xl font-grandHotel">nodeup</div>
            <Avatar class="surface-section cursor-pointer" icon="pi pi-user" @click="toggleAvatarMenu"></Avatar>
        </div>
        <Menu ref="menu" :model="items" :popup="true"></Menu>
        <div class="flex-auto flex w-full flex-column mx-auto" style="max-width: 900px;">
            <div class="relativ justify-content-between my-3 mx-4 gap-3 flex fadein animation-duration-100">
                <serverInfo :current="this.sys.mem.used" :max="this.sys.mem.total" str="RAM" op="GB"></serverInfo>
                <serverInfo :current="this.sys.cpu" max="100" str="CPU" op="%"></serverInfo>
            </div>
            <div class="surface-card border-round-md md:hidden p-2 mb-3 mx-4 fadein animation-duration-100">
                <overview :redirects="redirects" :instances="instances"></overview>
            </div>
            <div class="flex-auto relativ mb-3 mx-4 gap-3 flex flex-row fadein animation-duration-100">
                <div class="w-full md:w-4 md:h-full flex flex-column gap-3 fadein animation-duration-100"
                    v-if="(screen.width < 770 && view == 0) || screen.width >= 770">
                    <div class="surface-card p-2 border-round-md relativ">
                        <div class="w-full mt-2 mb-3 flex justify-content-between align-items-center">
                            <p class="m-0 ml-1 font-mono" style="font-size: 1rem;">Instances</p>
                            <Button icon="pi pi-plus" class="-m-1 -mt-2 bg-white-a15 text-color"
                                style="transform: scale(0.7);" @click="openInstanceUpdateView();"></Button>
                        </div>
                        <objListItem v-for="i in instances" :key="i" icon="pi-server" :name="i.name" :status="i.status"
                            @click="openInstanceView(i._id)">
                        </objListItem>
                        <p class="text-xs text-300 text-center" v-if="!instances.length">no instances found</p>
                    </div>
                    <div class="surface-card p-2 border-round-md relativ">
                        <div class="w-full mt-2 mb-3 flex justify-content-between align-items-center">
                            <p class="m-0 ml-1 font-mono" style="font-size: 1rem;">Redirects</p>
                            <Button icon="pi pi-plus" class="-m-1 -mt-2 bg-white-a15 text-color"
                                style="transform: scale(0.7);" @click="openRedirectView();"></Button>
                        </div>
                        <objListItem v-for="(re, i) in redirects" :key="i" icon="pi-arrow-right-arrow-left text-xs"
                            :name="re.name" :status="re.status" @click="openRedirectView(re);">
                        </objListItem>
                        <p class="text-xs text-300 text-center" v-if="!redirects.length">no redirects found</p>
                    </div>
                </div>
                <div class="w-full md:w-8 flex-column surface-card h-min border-round-md flex gap-2 p-2 fadein animation-duration-100"
                    v-if="screen.width >= 770 || view != 0">
                    <overview v-if="view == 0" :redirects="redirects" :instances="instances"></overview>
                    <instanceView v-if="view == 1" :selectedInstanceId="selectedInstanceId" :instances="instances"
                        :openInstanceUpdateView="openInstanceUpdateView"></instanceView>
                    <redirectUpdateView v-if="view == 2" ref="redirectUpdateView"></redirectUpdateView>
                    <instanceUpdateView ref="instanceUpdateView" v-if="view == 3"></instanceUpdateView>
                </div>
            </div>
            <div class="w-full h-3rem flex justify-content-center align-items-center gap-1">
                <i class="pi pi-link text-300"></i> <a href="#" class="no-underline text-300">oocastor</a>
            </div>
        </div>
    </div>
    <Toast :style="screen.width < 500 ? { width: '70%' } : {}" />
    <settings ref="settings"></settings>
</template>

<script>
/* eslint-disable */
import Menu from "primevue/menu";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import Toast from 'primevue/toast';

import serverInfo from "@/components/instances-page/serverInfo.vue";
import objListItem from "@/components/instances-page/objListItem.vue";
import countItem from "@/components/instances-page/countItem.vue";
import instanceView from "@/components/instances-page/instanceView.vue";
import instanceUpdateView from "@/components/instances-page/instanceUpdateView.vue";
import redirectUpdateView from "@/components/instances-page/redirectUpdateView.vue";
import overview from "@/components/instances-page/overview.vue";
import settings from "@/components/instances-page/settings.vue"

import * as Vue from "vue";

import { logout } from "@/bin/auth";

export default {
    name: "instances",

    components: {
        Button,
        Menu,
        Avatar,
        Toast,
        serverInfo,
        objListItem,
        countItem,
        instanceView,
        redirectUpdateView,
        instanceUpdateView,
        overview,
        settings
    },

    data() {
        let items = [
            {
                icon: 'pi pi-cog',
                label: "Settings",
                command: () => this.$refs.settings.toggleSettingsDialog()
            },
            {
                icon: 'pi pi-refresh',
                label: "Reload",
                command: () => location.reload()
            },
            {
                icon: 'pi pi-sign-out',
                label: "Logout",
                command: () => logout()
            },
        ];

        return {
            items,
            logout,
            int: null,
            sys: {
                cpu: "0.00",
                mem: {
                    total: "0.00",
                    used: "0.00"
                }
            },
            redirects: [],
            instances: [],
            selectedInstanceId: null,
            view: 0,
            screen: {
                width: 0,
                height: 0
            }
        }
    },
    methods: {
        toggleAvatarMenu(e) {
            this.$refs.menu.toggle(e);
        },
        fetchSysInfo() {
            this.$STORAGE.socket.emit("sysInfo:get", (data) => this.sys = data);
        },
        fetchRedirectEnitites() {
            this.$STORAGE.socket.emit("redirect:list", (data) => this.redirects = data.payload);
        },
        fetchInstanceEnitites() {
            this.$STORAGE.socket.emit("instance:list", (data) => this.instances = data.payload);
        },
        changeView(i) {
            if (i == 0) {
                this.update();
            }
            this.view = i;
        },
        openRedirectView(re) {
            this.changeView(2);
            Vue.nextTick(() => {
                this.$refs.redirectUpdateView?.setPayload(re);
            });
        },
        openInstanceView(id) {
            this.changeView(1);
            this.selectedInstanceId = id;
        },
        openInstanceUpdateView(i) {
            this.changeView(3);
            Vue.nextTick(() => {
                this.$refs.instanceUpdateView?.setPayload(i);
            });
        },
        showToast(data) {
            let { severity, title, msg } = data;
            this.$toast.add({ severity, summary: title, detail: msg, life: 3000 });
        },
        update() {
            this.fetchSysInfo();
            this.fetchRedirectEnitites();
            this.fetchInstanceEnitites();
        },
        getScreenSize() {
            this.screen = {
                width: window.innerWidth,
                height: window.innerHeight
            }
        }
    },
    created() {
        this.update();
        this.int = setInterval(this.update, this.$STORAGE.updateInterval);
        this.$EVENT.on("changeView", this.changeView);
        this.$EVENT.on("showToast", this.showToast);
        this.$EVENT.on("update", this.update);

        this.getScreenSize();
        window.addEventListener("resize", this.getScreenSize)
    },
    destroyed() {
        clearInterval(this.int);
        this.$EVENT.off("changeView", this.changeView);
        this.$EVENT.off("showToast", this.showToast);
        this.$EVENT.off("update", this.update);
        window.removeEventListener("resize", this.getScreenSize)
    }
}
</script>

<style lang="scss" scoped>
.bg-white-a15 {
    background-color: rgba(255, 255, 255, 0.15);
}
</style>