<template>
  <div class="flex flex-column h-full" style="min-width: 300px">
    <div class="w-full surface-card flex justify-content-between align-items-center px-3" style="min-height: 60px">
      <div class="text-2xl font-monomaniac mb-2">
        Node<span class="text-primary">Core</span> <span class="text-xs text-500">v {{ projectData.version }}</span>
      </div>
      <Avatar class="surface-section cursor-pointer" icon="pi pi-ellipsis-h" @click="toggleAvatarMenu"></Avatar>
    </div>
    <Menu ref="menu" :model="items" :popup="true"></Menu>

    <div class="flex-auto flex w-full flex-column mx-auto px-4 mt-3 gap-3" style="max-width: 1000px">
      <p class="m-0 text-200">{{ $t("main-page.system") }}</p>
      <div class="relativ justify-content-between gap-2 flex fadein animation-duration-100">
        <serverInfo :data="this.sys.mem" :max="this.sys.maxMemory" :str="$t('main-page.ram')" op="GB">
        </serverInfo>
        <serverInfo :data="this.sys.cpu" max="100" :str="$t('main-page.cpu')" op="%"></serverInfo>
      </div>

      <div class="md:hidden fadein animation-duration-100">
        <overview :redirects="redirects" :instances="instances"></overview>
        <chart :toggleVisibility="true" v-if="trackingEnabled"></chart>
      </div>

      <div class="flex-auto relativ gap-3 flex flex-row fadein animation-duration-100">
        <div class="w-full md:w-4 md:h-full flex flex-column gap-3 fadein animation-duration-100"
          v-if="(screen.width < 770 && view == 0) || screen.width >= 770">
          <p class="m-0 text-200">{{ $t("main-page.entities") }}</p>

          <div class="surface-card p-2 border-round-md relativ">
            <div class="w-full mb-2 flex align-items-center">
              <p class="m-0 ml-1 text-sm">{{ $t("main-page.instances") }}</p>
              <Button icon="pi pi-filter"
                :class="`ml-1 -m-1 p-button-text ${selectedGroups.length ? 'text-primary' : 'text-gray-200'}`"
                style="transform: scale(0.7)" @click="($event) => { $refs.filterPanel.toggle($event) }"></Button>
              <Button icon="pi pi-plus" class="ml-auto -m-1 bg-white-a15 text-color" style="transform: scale(0.7)"
                @click="openInstanceUpdateView()"></Button>
            </div>
            <div class="overflow-y-auto overflow-x-hidden" style="max-height: 500px;">
              <div v-if="instances.length">
                <template v-for="(instances, group) in filteredGroups" :key="group">
                  <div class="w-full surface-100 my-4 mx-auto relative flex align-items-center" style="height: 1px;">
                    <Chip :label="group" class="text-xs absolute surface-100"></Chip>
                  </div>
                  <objListItem v-for="inst in instances" :key="inst._id" icon="pi pi-desktop" :name="inst.name"
                    :status="inst.status" @click="openInstanceView(inst._id)">
                  </objListItem>
                </template>
              </div>
              <p class="text-xs text-300 text-center" v-if="!instances.length">
                {{ $t("main-page.no-instances-text") }}
              </p>
            </div>
            <OverlayPanel ref="filterPanel">
              <p class="mt-0">{{ $t('main-page.filter') }}</p>
              <Listbox style="width: 200px;" :options="getGroupsOnly" v-model="selectedGroups" multiple
                :emptyMessage="$t('main-page.noTagsFound')" @change="storeFilter();"></Listbox>
            </OverlayPanel>
          </div>

          <div class="surface-card p-2 border-round-md relativ">
            <div class="w-full mb-2 flex justify-content-between align-items-center">
              <p class="m-0 ml-1 text-sm">{{ $t("main-page.redirects") }}</p>
              <Button icon="pi pi-plus" class="-m-1 bg-white-a15 text-color" style="transform: scale(0.7)" @click="
                networkReady
                  ? openRedirectView()
                  : showNotification({
                    error: true,
                    msg: 'Proxy is disabled or no domains are set',
                    payload: null,
                  })
                "></Button>
            </div>
            <div class="overflow-y-auto overflow-x-hidden" style="max-height: 500px;">
              <objListItem v-for="(re, i) in redirects" :key="i" icon="pi pi-directions" :name="re.name"
                :status="re.status" @click="openRedirectView(re)">
              </objListItem>
              <p class="text-xs text-300 text-center" v-if="!redirects.length">
                {{ $t("main-page.no-redirects-text") }}
              </p>
            </div>
          </div>
        </div>

        <div class="w-full md:w-8 flex-column h-min border-round-md flex fadein animation-duration-100 overflow-hidden"
          v-if="screen.width >= 770 || view != 0">
          <overview v-if="view == 0" :redirects="redirects" :instances="instances"></overview>
          <chart v-if="view == 0 && trackingEnabled"></chart>
          <instanceView v-if="view == 1" :selectedInstanceId="selectedInstanceId"
            :openInstanceUpdateView="openInstanceUpdateView" :openRedirectView="openRedirectView" :redirects="redirects"
            ref="instanceView"></instanceView>
          <redirectUpdateView v-if="view == 2" :instances="instances" ref="redirectUpdateView"></redirectUpdateView>
          <instanceUpdateView ref="instanceUpdateView" v-if="view == 3"></instanceUpdateView>
        </div>
      </div>

      <div class="w-full flex flex-column align-items-center">
        <div class="flex justify-content-center align-items-center gap-1">
          <i class="pi pi-github text-300 mr-1"></i>
          <a href="https://github.com/oocastor" class="no-underline text-300">oocastor |</a>
          <a href="https://github.com/DerSchoepfer" class="no-underline text-300">DerSchoepfer</a>
        </div>
        <p class="text-xs text-300">Build Version {{ projectData.version }}</p>
      </div>
    </div>
  </div>
  <Toast style="width: 70%; max-width: 400px" />
  <Toast group="sticky" style="width: 90%; max-width: 400px; opacity: 1;">
    <template #message="{ message }">
      <div class="bg-gray-600 w-full border-round-md">
        <div class="p-3">
          <p class="m-0 mb-2">{{ message.summary }}</p>
          <p class="text-sm m-0 font-light">{{ message.detail }}</p>
        </div>
        <ProgressBar mode="indeterminate"
          style="height: 8px; width: 100%; border-top-right-radius: 0; border-top-left-radius: 0px;"></ProgressBar>
      </div>
    </template>
  </Toast>
  <settings ref="settings"></settings>
  <tracking ref="tracking"></tracking>
</template>

<script>
/* eslint-disable */
import Menu from "primevue/menu";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import Toast from "primevue/toast";
import Listbox from "primevue/listbox";
import OverlayPanel from "primevue/overlaypanel";
import Checkbox from 'primevue/checkbox';
import Chip from 'primevue/chip';
import ProgressBar from 'primevue/progressbar';

import projectData from "../../package.json";
import serverInfo from "@/components/instances-page/serverInfo.vue";
import objListItem from "@/components/instances-page/objListItem.vue";
import countItem from "@/components/instances-page/countItem.vue";
import instanceView from "@/components/instances-page/instanceView.vue";
import instanceUpdateView from "@/components/instances-page/instanceUpdateView.vue";
import redirectUpdateView from "@/components/instances-page/redirectUpdateView.vue";
import overview from "@/components/instances-page/overview.vue";
import settings from "@/components/instances-page/settings.vue";
import tracking from "@/components/instances-page/tracking.vue";
import chart from "@/components/instances-page/chart.vue";

import * as Vue from "vue";
import VueCookies from 'vue-cookies';

import { logout } from "@/bin/auth";

export default {
  name: "instances",

  components: {
    ProgressBar,
    Button,
    Menu,
    Avatar,
    Toast,
    Listbox,
    OverlayPanel,
    Checkbox,
    Chip,
    serverInfo,
    objListItem,
    countItem,
    instanceView,
    redirectUpdateView,
    instanceUpdateView,
    overview,
    settings,
    tracking,
    chart,
  },

  data() {
    return {
      items: [],
      projectData,
      logout,
      sys: {
        cpu: ["0.0"],
        mem: ["0.0"],
        maxMemory: "0.0"
      },
      redirects: [],
      instances: [],
      selectedInstanceId: null,
      view: 0,
      screen: {
        width: 0,
        height: 0,
      },
      networkReady: false,
      trackingEnabled: false,
      selectedGroups: [],
      stickyNotifications: []
    };
  },
  watch: {
    "$i18n.locale"() {
      Vue.nextTick(() => {
        this.setMenuItems();
      });
    }
  },
  computed: {
    groupInstances() {
      let grouped = {};
      this.instances.forEach((i) => {
        if (!i.tags?.length) {
          if (!grouped["Untagged"]) {
            grouped["Untagged"] = [];
          }
          grouped["Untagged"].push(i);
        } else {
          i.tags.forEach((t) => {
            if (!grouped[t]) {
              grouped[t] = [];
            }
            grouped[t].push(i);
          });
        }
      });
      return grouped;
    },
    getGroupsOnly() {
      return Object.keys(this.groupInstances);
    },
    filteredGroups() {
      let filtered = {};
      for (let g of this.selectedGroups) {
        if (Object.keys(this.groupInstances)?.length && !this.groupInstances[g]) {
          this.selectedGroups = this.selectedGroups.filter((e) => e !== g);
          continue;
        }
        filtered[g] = this.groupInstances[g];
      }
      //show all if no groups are selected
      return !this.selectedGroups.length ? { "All": this.instances } : filtered;
    }
  },
  methods: {
    setMenuItems() {
      this.items = [
        {
          icon: "pi pi-cog",
          label: this.$t('menu.settings'),
          command: () => this.$refs.settings.toggleSettingsDialog(),
        },
        {
          icon: "pi pi-arrow-right-arrow-left",
          label: this.$t('main-page.tracking-comp.tracking'),
          command: () => this.$refs.tracking.toggleTrackingDialog(),
        },
        {
          icon: "pi pi-refresh",
          label: this.$t('menu.reload'),
          command: () => location.reload(),
        },
        {
          icon: "pi pi-sign-out",
          label: this.$t('menu.logout'),
          command: () => logout(),
        },
      ];
    },
    toggleAvatarMenu(e) {
      this.$refs.menu.toggle(e);
    },
    fetchSysInfo() {
      this.$STORAGE.socket.emit("sysInfo:get", (data) => (this.sys = data));
    },
    fetchRedirectEnitites() {
      this.$STORAGE.socket.emit(
        "redirect:list",
        (data) => (this.redirects = data.payload)
      );
    },
    fetchInstanceEnitites() {
      this.$STORAGE.socket.emit(
        "instance:list",
        (data) => (this.instances = data.payload)
      );
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
      Vue.nextTick(() => {
        this.$refs.instanceView?.update();
      });
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
    showNotification(ack) {
      let msgs = Array.isArray(ack.msg) ? ack.msg : [ack.msg];
      msgs.forEach((m) => {
        this.$toast.add({
          severity: ack.error ? "error" : "success",
          summary: ack.error ? "Error" : "Success",
          detail: m,
          life: 3000,
        });
      });
    },
    update() {
      this.fetchSysInfo();
      this.fetchRedirectEnitites();
      this.fetchInstanceEnitites();
      this.checkNetworkStatus();
      this.checkTrackingStatus();
      this.getStickyNotifications();
    },
    getScreenSize() {
      this.screen = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    checkNetworkStatus() {
      this.$STORAGE.socket.emit(
        "network:ready",
        (data) => (this.networkReady = data.payload)
      );
    },
    storeFilter() {
      VueCookies.set("filter", this.selectedGroups);
    },
    checkTrackingStatus() {
      this.$STORAGE.socket.emit(
        "tracking:get",
        (data) => (this.trackingEnabled = data.payload.enabled)
      );
    },
    getStickyNotifications() {
      this.$STORAGE.socket.emit("notifications:get", (data) => {
        let { payload } = data;

        if(JSON.stringify(this.stickyNotifications) != JSON.stringify(payload)) {
          this.$toast.removeGroup("sticky");
          payload.forEach(e => {
            this.$toast.add({
              summary: e.title,
              detail: e.message,
              closable: false,
              group: "sticky"
            });
          });
          this.stickyNotifications = payload;
        }
      });
    }
  },
  created() {
    this.setMenuItems();
    this.selectedGroups = VueCookies.get("filter") || [];

    this.update();
    this.$EVENT.on("changeView", this.changeView);
    this.$EVENT.on("showToast", this.showToast); //TODO: replace with showNotification
    this.$EVENT.on("showNotification", this.showNotification);
    this.$EVENT.on("update", this.update);

    this.getScreenSize();
    window.addEventListener("resize", this.getScreenSize);

    this.$STORAGE.socket.on("msg:get", this.showNotification);
  },
  unmounted() {
    this.$EVENT.off("changeView", this.changeView);
    this.$EVENT.off("showToast", this.showToast); //TODO: replace with showNotification
    this.$EVENT.off("showNotification", this.showNotification);
    this.$EVENT.off("update", this.update);
    window.removeEventListener("resize", this.getScreenSize);

    this.$STORAGE.socket.off("msg:get", this.showNotification);
  },
};
</script>

<style lang="scss">
.bg-white-a15 {
  background-color: rgba(255, 255, 255, 0.15) !important;
}

.text-overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
