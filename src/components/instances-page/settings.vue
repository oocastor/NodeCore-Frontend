<template>
  <Dialog v-model:visible="settingsDialog" modal :draggable="false" :header="$t('main-page.settings-comp.settings')"
    style="max-width: 1000px; width: 100%;" class="relative">
    <div class="block md:hidden">
      <p class="m-0 mb-2 w-3 text-sm">Menu</p>
      <div class="flex gap-2 mb-4 overflow-x-scroll no-scrollbar" v-dragscroll>
        <template v-for="(b, i) in menu.items" :key="b">
          <Button :icon="b.icon" :label="b.label"
            :class="` surface-50 hover:surface-100 text-white flex-auto flex-shrink-0 ${menu.id == i ? 'surface-200' : ''}`"
            style="border: none; box-shadow: none;" @click="menu.id = i;"></Button>
        </template>
      </div>
    </div>
    <div class="flex gap-3 md:h-full align-items-start">
      <div class="md:flex flex-column w-3 hidden" style="min-width: 200px;">
        <p class="m-0 mb-2 text-sm">Menu</p>
        <div class="flex flex-column flex-auto gap-1 surface-50 border-round p-2">
          <template v-for="(b, i) in menu.items" :key="b">
            <Button :icon="b.icon" :label="b.label"
              :class="`surface-50 hover:surface-100 text-white ${menu.id == i ? 'surface-200' : ''}`"
              style="border: none; box-shadow: none;" @click="menu.id = i;"></Button>
          </template>
        </div>
      </div>
      <div class="flex flex-column gap-4 w-full" style="min-height: 60vh;">
        <!-- GENERAL -->
        <div class="flex flex-column gap-4" v-if="menu.id == 0">
          <Fieldset :legend="$t('main-page.settings-comp.language')">
            <p class="-mt-1 mb-4 font-italic">
              {{ $t("main-page.settings-comp.language-text") }}
            </p>
            <p class="text-sm">
              {{ $t("main-page.settings-comp.language-selected") }}
            </p>
            <Dropdown :options="languages" optionLabel="name" optionValue="code" v-model="selectedLanguage"
              @update:modelValue="changeLanguage" placeholder="Language" class="w-full p-2" />
          </Fieldset>
          <Fieldset :legend="$t('main-page.settings-comp.login')">
            <p class="-mt-1 mb-4 font-italic">
              {{ $t("main-page.settings-comp.login-text") }}
            </p>
            <p class="text-sm">{{ $t("main-page.settings-comp.username") }}</p>
            <InputText class="w-full" v-model="account.user"></InputText>
            <p class="text-sm">{{ $t("main-page.settings-comp.password") }}</p>
            <InputText class="w-full" v-model="account.pwd" type="password"></InputText>
            <Button :label="$t('main-page.settings-comp.save')" icon="pi pi-save" class="w-full mt-4"
              @click="updateAccount()"></Button>
          </Fieldset>
          <Fieldset :legend="$t('main-page.settings-comp.path')">
            <p class="-mt-1 mb-4 font-italic">
              {{ $t("main-page.settings-comp.path-text") }}
            </p>
            <p class="text-sm">{{ $t("main-page.settings-comp.path") }}</p>
            <InputText class="w-full" v-model="path" spellcheck="false"></InputText>
            <Button label="Save" icon="pi pi-save" class="w-full mt-4" @click="setPath()"></Button>
          </Fieldset>
        </div>
        <!-- PROXY -->
        <div class="flex flex-column gap-4" v-if="menu.id == 1">
          <Fieldset :legend="$t('main-page.settings-comp.domains')">
            <div class="flex justify-content-between align-items-center -mt-1 mb-4">
              <p class="w-8 font-italic">
                {{ $t("main-page.settings-comp.domains-text") }}
              </p>
              <Button icon="pi pi-plus" :label="$t('main-page.settings-comp.add')" class="p-button-sm"
                @click="$refs.addDomOvPa.toggle($event)"></Button>
            </div>
            <div class="w-full flex flex-column justify-content-center gap-2">
              <template v-for="ad in availableDomains" :key="ad">
                <div class="border-round-sm surface-section flex justify-content-between align-items-center">
                  <p class="m-0 mb-1 ml-3 font-mono select-none">{{ ad }}</p>
                  <Button icon="pi pi-times" class="surface-200 text-white border-none"
                    @click="deleteDomain(ad)"></Button>
                </div>
              </template>
              <p class="m-0 text-300 font-italic" v-if="availableDomains.length == 0">
                - empty -
              </p>
            </div>
            <OverlayPanel ref="addDomOvPa">
              <p class="mt-0">{{ $t("main-page.settings-comp.add-domain") }}</p>
              <div class="p-inputgroup">
                <InputText v-model="newDomainInput"></InputText>
                <Button icon="pi pi-plus" @click="addNewDomain()"></Button>
              </div>
            </OverlayPanel>
          </Fieldset>
          <Fieldset :legend="$t('main-page.settings-comp.proxy')">
            <p class="-mt-1 mb-4 font-italic">
              {{ $t("main-page.settings-comp.proxy-text")
              }}<a class="text-primary no-underline" href="https://www.npmjs.com/package/acme-client">acme-client.js/Let's
                Encrypt</a>.
            </p>
            <div class="flex align-items-center justify-content-between my-4">
              <p class="text-sm m-0">{{ $t("main-page.settings-comp.proxy") }}</p>
              <ToggleButton v-model="proxy.enabled"></ToggleButton>
            </div>
            <div class="flex align-items-center justify-content-between my-4">
              <p class="text-sm m-0">
                {{ $t("main-page.settings-comp.certificates") }}
              </p>
              <div class="p-inputgroup w-min">
                <Button :label="$t('main-page.settings-comp.force')" class="bg-gray-700 text-white border-none"
                  @click="updateCerts(true)"></Button>
                <Button :label="$t('main-page.settings-comp.update')" @click="updateCerts(false)"></Button>
              </div>
            </div>
            <p class="text-sm">
              {{ $t("main-page.settings-comp.maintainer-mail") }}
            </p>
            <InputText class="w-full" spellcheck="false" v-model="proxy.maintainerEmail" :disabled="!this.proxy.enabled">
            </InputText>
            <Button :label="$t('main-page.settings-comp.save')" icon="pi pi-save" class="w-full mt-4"
              @click="updateProxy"></Button>
          </Fieldset>
          <!-- TRACKING -->
          <Fieldset :legend="$t('main-page.settings-comp.tracking')">
            <p class="-mt-1 my-4 font-italic">
              {{ $t("main-page.settings-comp.tracking-text")
              }}
            </p>
            <div class="flex align-items-center justify-content-between my-4">
              <p class="text-sm m-0">{{ $t("main-page.settings-comp.tracking") }}</p>
              <ToggleButton v-model="tracking.enabled"></ToggleButton>
            </div>
            <div class="flex align-items-center justify-content-between my-4">
              <p class="text-sm m-0">{{ $t("main-page.settings-comp.anonymiseIP") }}</p>
              <ToggleButton v-model="tracking.anonymiseIP" :disabled="!tracking.enabled"></ToggleButton>
            </div>
            <div class="flex gap-2 justify-content-between">
              <p>Save for days</p>
              <InputNumber v-model="tracking.saveDays" spellcheck="false" :useGrouping="false" :min="0" :max="90" :disabled="!tracking.enabled">
              </InputNumber>
            </div>
            <Button :label="$t('main-page.settings-comp.save')" icon="pi pi-save" class="w-full mt-4" @click="updateTracking"></Button>
          </Fieldset>


        </div>
        <!-- GITHUB -->
        <div class="flex flex-column gap-4" v-if="menu.id == 2">
          <Fieldset :legend="$t('main-page.settings-comp.github')">
            <p class="-mt-1 mb-4 font-italic">
              {{ $t("main-page.settings-comp.github-text") }}
            </p>
            <p class="flex text-sm">
              PAT <span class="ml-auto text-400">(Personal Access Token)</span>
            </p>
            <InputText class="w-full" v-model="github.pat" type="password"></InputText>
            <div class="flex gap-2 mt-4">
              <Button :label="$t('main-page.settings-comp.save')" icon="pi pi-save" class="w-6"
                @click="updateGithubAcc()"></Button>
              <Button :label="$t('main-page.settings-comp.delete')" icon="pi pi-trash" type="password"
                class="w-6 bg-red-500 text-white border-none" @click="{
                  this.github = { pat: '' };
                  updateGithubAcc();
                }
                  "></Button>
            </div>
          </Fieldset>
        </div>
        <!-- DATABASES -->
        <div class="flex flex-column gap-4" v-if="menu.id == 3">
          <Fieldset :legend="$t('main-page.settings-comp.databases')">
            <div class="flex justify-content-between align-items-center -mt-1 mb-4">
              <p class="font-italic">
                {{ $t("main-page.settings-comp.databases-text") }}
              </p>
            </div>
            <div class="w-full flex flex-column justify-content-center gap-2">
              <Fieldset legend="MySQL">
                <div class="w-full flex flex-column justify-content-center gap-2">
                  <div class="flex align-items-center justify-content-between">
                    <div class="w-12" v-if="databases.mysql.installed">
                      <div class="flex align-items-center justify-content-between">
                        <div>
                          {{ "MySQL Version " + databases.mysql.version }}
                        </div>

                        <Button :label="$t('main-page.settings-comp.uninstall-mysql')"
                          class="bg-red-500 text-white border-none" @click="uninstallMySQL"></Button>
                      </div>
                    </div>
                    <div class="w-full" v-else>
                      <Button :label="$t('main-page.settings-comp.install-mysql')" icon="pi pi-database" class="w-12"
                        @click="installMySQL"></Button>
                    </div>
                  </div>
                </div>
                <div class="w-full flex flex-column justify-content-center gap-2 mt-4">
                  <div class="flex align-items-center justify-content-between">
                    <div class="w-full" v-if="databases.mysql.installed &&
                      !databases.mysql.superuser.created
                      ">
                      <p class="text-sm">
                        {{ $t("main-page.settings-comp.mysql-user") }}
                      </p>
                      <InputText class="w-full" spellcheck="false" v-model="databases.mysql.superuser.username">
                      </InputText>
                      <p class="text-sm">
                        {{ $t("main-page.settings-comp.mysql-password") }}
                      </p>

                      <div class="p-inputgroup flex-1">
                        <InputText class="w-full" :type="mysqlPasswordVisibility ? 'text' : 'password'" spellcheck="false"
                          v-model="databases.mysql.superuser.password"></InputText>
                        <Button :icon="mysqlPasswordVisibility
                          ? 'pi pi-eye'
                          : 'pi pi-eye-slash'
                          " @click="
    mysqlPasswordVisibility = !mysqlPasswordVisibility
    " severity="secondary" />
                        <Button icon="pi pi-replay" severity="warning" @click="
                          databases.mysql.superuser.password = generatePassword()
                          " />
                      </div>
                      <p class="text-sm w-full">
                        {{ $t("main-page.settings-comp.mysql-host") }}
                      </p>
                      <InputText class="w-full" spellcheck="false" v-model="databases.mysql.superuser.host"></InputText>
                      <Button :label="$t('main-page.settings-comp.create-mysql-superuser')
                        " icon="pi pi-user" class="w-12 mt-4" :disabled="!(
    databases.mysql.superuser.username &&
    databases.mysql.superuser.username.length > 6 &&
    databases.mysql.superuser.password &&
    databases.mysql.superuser.password.length > 7 &&
    databases.mysql.superuser.host
  )
    " @click="createMySQLSuperUser"></Button>
                    </div>
                    <div class="w-12" v-else>
                      <div class="flex align-items-center justify-content-between">
                        <p class="text-sm">
                          {{ $t("main-page.settings-comp.mysql-user") }}
                        </p>
                        <div>
                          {{ databases.mysql.superuser.username }}
                        </div>
                      </div>
                      <div class="flex align-items-center justify-content-between">
                        <p class="text-sm">
                          {{ $t("main-page.settings-comp.mysql-password") }}
                        </p>
                        <div>
                          {{ databases.mysql.superuser.password }}
                        </div>
                      </div>
                      <div class="flex align-items-center justify-content-between">
                        <p class="text-sm">
                          {{ $t("main-page.settings-comp.mysql-host") }}
                        </p>
                        <div>
                          {{ databases.mysql.superuser.host }}
                        </div>
                      </div>
                      <Button :label="$t('main-page.settings-comp.delete-mysql-superuser')"
                        class="bg-red-500 text-white border-none w-full" @click="deleteMySQLSuperUser"></Button>
                    </div>
                  </div>
                </div>
              </Fieldset>
            </div>
          </Fieldset>
        </div>

      </div>
    </div>
  </Dialog>
</template>

<script>
import VueCookies from "vue-cookies";

import Dialog from "primevue/dialog";
import Fieldset from "primevue/fieldset";
import OverlayPanel from "primevue/overlaypanel";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";
import ToggleButton from "primevue/togglebutton";
import Dropdown from "primevue/dropdown";

export default {
  data() {
    return {
      settingsDialog: false,
      menu: {
        id: 1,
        items: [
          { label: "General", icon: "pi pi-cog", id: 0 },
          { label: "Proxy", icon: "pi pi-directions", id: 1 },
          { label: "GitHub", icon: "pi pi-github", id: 2 },
          { label: "Database", icon: "pi pi-database", id: 3 }
        ]
      },
      availableDomains: [],
      newDomainInput: "",
      mysqlPasswordVisibility: false,
      databases: {
        mysql: {
          installed: false,
          version: null,
          superuser: {
            created: false,
            name: null,
            password: null,
            host: null,
          },
          databases: [],
        },
        mongodb: {
          installed: false,
          version: null,
          superuser: {
            name: null,
            password: null,
          },
          databases: [],
        },
      },
      tracking: {
        enabled: false,
        anonymiseIP: false,
        saveDays: 7,
      },
      github: {
        pat: "",
      },
      account: {
        user: "",
        pwd: "",
      },
      path: "",
      proxy: {
        maintainerEmail: "",
        enabled: false,
      },
      selectedLanguage: this.$i18n.locale,
      languages: [
        { name: "English", code: "en" },
        { name: "Deutsch", code: "de" },
        { name: "Français", code: "fr" },
        { name: "Español", code: "es" },
        { name: "Nederlands", code: "nl" },
      ],
    };
  },
  components: {
    Dialog,
    Fieldset,
    OverlayPanel,
    InputText,
    Button,
    ToggleButton,
    Dropdown,
    InputNumber,
  },
  watch: {
    "proxy.cluster"() {
      if (!this.proxy.cluster) this.proxy.workers = 1;
    },
  },
  methods: {
    changeLanguage(language) {
      this.$i18n.locale = language;
      VueCookies.set("lang", language);
    },
    fetchAvailableDomains() {
      this.$STORAGE.socket.emit(
        "domain:list",
        (data) => (this.availableDomains = data.payload)
      );
    },
    addNewDomain() {
      this.$STORAGE.socket.emit(
        "domain:add",
        { domain: this.newDomainInput },
        (data) => {
          let { error, msg } = data;
          if (error) {
            this.$EVENT.emit("showToast", {
              severity: "error",
              title: "Error",
              msg,
            });
          } else {
            this.$EVENT.emit("showToast", {
              severity: "success",
              title: "Done",
              msg,
            });
          }
          this.fetchAvailableDomains();
          this.$refs.addDomOvPa.hide();
          this.newDomainInput = "";
        }
      );
    },
    deleteDomain(domain) {
      this.$STORAGE.socket.emit("domain:delete", { domain }, (data) => {
        let { error, msg } = data;
        if (error) {
          this.$EVENT.emit("showToast", {
            severity: "error",
            title: "Error",
            msg,
          });
        } else {
          this.$EVENT.emit("showToast", {
            severity: "success",
            title: "Done",
            msg,
          });
        }
        this.fetchAvailableDomains();
      });
    },
    fetchGithubAcc() {
      this.$STORAGE.socket.emit(
        "github:get",
        (data) => (this.github = data.payload)
      );
    },
    installMySQL() {
      this.$STORAGE.socket.emit("databases:install:mysql", (data) => {
        this.$EVENT.emit("showNotification", data);
        this.fetchMySQLData();
      });
    },
    uninstallMySQL() {
      this.$STORAGE.socket.emit("databases:uninstall:mysql", (data) => {
        this.$EVENT.emit("showNotification", data);
        this.fetchMySQLData();
      });
    },
    createMySQLSuperUser() {
      this.$STORAGE.socket.emit(
        "databases:mysql:createSuperUser",
        {
          username: this.databases.mysql.superuser.username,
          password: this.databases.mysql.superuser.password,
          host: this.databases.mysql.superuser.host,
        },
        (data) => {
          this.$EVENT.emit("showNotification", data);
          this.fetchMySQLData();
        }
      );
    },
    deleteMySQLSuperUser() {
      this.$STORAGE.socket.emit(
        "databases:mysql:deleteSuperUser",
        {
          username: this.databases.mysql.superuser.username,
          password: this.databases.mysql.superuser.password,
          host: this.databases.mysql.superuser.host,
        },
        (data) => {
          this.$EVENT.emit("showNotification", data);
          this.fetchMySQLData();
        }
      );
    },
    installMongoDB() {
      this.$STORAGE.socket.emit("databases:install:mongodb", () => {
        this.fetchMySQLData();
      });
    },
    uninstallMongoDB() {
      this.$STORAGE.socket.emit("databases:uninstall:mongodb", () => {
        this.fetchMySQLData();
      });
    },
    fetchMySQLData() {
      this.$STORAGE.socket.emit("databases:get:mysqlData", (data) => {
        console.log(data);
        this.databases.mysql = data.payload;
      });
    },
    generatePassword(length = 12) {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+=-";
      let password = "";
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
      }
      return password;
    },
    updateGithubAcc() {
      this.$STORAGE.socket.emit("github:set", this.github, (data) => {
        let { error, msg } = data;
        if (error) {
          this.$EVENT.emit("showToast", {
            severity: "error",
            title: "Error",
            msg,
          });
        } else {
          this.$EVENT.emit("showToast", {
            severity: "success",
            title: "Done",
            msg,
          });
        }
      });
    },
    updateAccount() {
      this.$STORAGE.socket.emit("account:set", this.account, (data) => {
        let { error, msg } = data;
        if (error) {
          this.$EVENT.emit("showToast", {
            severity: "error",
            title: "Error",
            msg,
          });
        } else {
          this.$EVENT.emit("showToast", {
            severity: "success",
            title: "Done",
            msg,
          });
        }
      });
    },
    fetchPath() {
      this.$STORAGE.socket.emit(
        "path:get",
        (data) => (this.path = data.payload)
      );
    },
    setPath() {
      this.$STORAGE.socket.emit("path:set", { path: this.path }, (data) => {
        let { error, msg } = data;
        if (error) {
          this.$EVENT.emit("showToast", {
            severity: "error",
            title: "Error",
            msg,
          });
        } else {
          this.$EVENT.emit("showToast", {
            severity: "success",
            title: "Done",
            msg,
          });
        }
      });
    },
    updateProxy() {
      this.$STORAGE.socket.emit("proxy:set", this.proxy, (data) => {
        let { error, msg } = data;
        if (error) {
          this.$EVENT.emit("showToast", {
            severity: "error",
            title: "Error",
            msg,
          });
        } else {
          this.$EVENT.emit("showToast", {
            severity: "success",
            title: "Done",
            msg,
          });
        }
      });
    },
    fetchProxy() {
      this.$STORAGE.socket.emit(
        "proxy:get",
        (data) => (this.proxy = data.payload)
      );
    },
    updateCerts(force = false) {
      this.$STORAGE.socket.emit("proxy:updateCerts", { force }, (data) => {
        let { error, msg } = data;
        if (error) {
          this.$EVENT.emit("showToast", {
            severity: "error",
            title: "Error",
            msg,
          });
        } else {
          this.$EVENT.emit("showToast", {
            severity: "success",
            title: "Done",
            msg,
          });
        }
      });
    },
    toggleSettingsDialog(b = undefined) {
      if (b) this.settingsDialog = b;
      else this.settingsDialog = !this.settingsDialog;
      if (this.settingsDialog) this.update();
    },
    update() {
      this.fetchAvailableDomains();
      this.fetchGithubAcc();
      this.fetchPath();
      this.fetchProxy();
      this.fetchMySQLData();
      this.fetchTracking();
    },
    fetchTracking() {
      this.$STORAGE.socket.emit(
        "tracking:get",
        (data) => (this.tracking = data.payload)
      );
    },
    updateTracking() {
      this.$STORAGE.socket.emit("tracking:set", this.tracking, (data) => {
        let { error, msg } = data;
        if (error) {
          this.$EVENT.emit("showToast", {
            severity: "error",
            title: "Error",
            msg,
          });
        } else {
          this.$EVENT.emit("showToast", {
            severity: "success",
            title: "Done",
            msg,
          });
        }
      });
    }
  },
  created() {
    this.update();
  },
};
</script>