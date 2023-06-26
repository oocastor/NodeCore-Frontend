<template>
    <Dialog v-model:visible="settingsDialog" modal :draggable="false" :header="$t('main-page.settings-comp.settings')"
        style="max-width: 600px; width: 100%;">
        <div class="flex flex-column gap-4">
            <Fieldset :legend="$t('main-page.settings-comp.language')">
                <p class="-mt-1 mb-4 font-italic">{{ $t('main-page.settings-comp.language-text') }}</p>
                <p class="text-sm">{{ $t('main-page.settings-comp.language-selected') }}</p>
                <Dropdown :options="languages" optionLabel="name" optionValue="code" v-model="selectedLanguage"
                    @update:modelValue="changeLanguage" placeholder="Language" class="w-full p-2" />
            </Fieldset>
            <Fieldset :legend="$t('main-page.settings-comp.login')">
                <p class="-mt-1 mb-4 font-italic">{{ $t('main-page.settings-comp.login-text') }}</p>
                <p class="text-sm">{{ $t('main-page.settings-comp.username') }}</p>
                <InputText class="w-full" v-model="account.user"></InputText>
                <p class="text-sm">{{ $t('main-page.settings-comp.password') }}</p>
                <InputText class="w-full" v-model="account.pwd" type="password"></InputText>
                <Button :label="$t('main-page.settings-comp.save')" icon="pi pi-save" class="w-full mt-4"
                    @click="updateNodeupLogin();"></Button>
            </Fieldset>
            <Fieldset :legend="$t('main-page.settings-comp.github')">
                <p class="-mt-1 mb-4 font-italic">{{ $t('main-page.settings-comp.github-text') }}</p>
                <p class="flex text-sm">PAT <span class="ml-auto text-400">(Personal Access Token)</span></p>
                <InputText class="w-full" v-model="github.pat" type="password"></InputText>
                <div class="flex gap-2 mt-4">
                    <Button :label="$t('main-page.settings-comp.save')" icon="pi pi-save" class="w-6"
                        @click="updateGithubAcc();"></Button>
                    <Button :label="$t('main-page.settings-comp.delete')" icon="pi pi-trash" type="password"
                        class="w-6 bg-red-500 text-white border-none" @click="{
                            this.github = { pat: '' };
                            updateGithubAcc();
                        }"></Button>
                </div>
            </Fieldset>
            <Fieldset :legend="$t('main-page.settings-comp.domains')">
                <div class="flex justify-content-between align-items-center -mt-1 mb-4">
                    <p class="w-8 font-italic">{{ $t('main-page.settings-comp.domains-text') }}</p>
                    <Button icon="pi pi-plus" :label="$t('main-page.settings-comp.add')" class="p-button-sm"
                        @click="$refs.addDomOvPa.toggle($event);"></Button>
                </div>
                <div class="w-full flex flex-column justify-content-center gap-2">
                    <template v-for="ad in availableDomains" :key="ad">
                        <div class="border-round-sm surface-section flex justify-content-between align-items-center">
                            <p class="m-0 mb-1 ml-3 font-mono select-none">{{ ad }}</p>
                            <Button icon="pi pi-times" class="surface-200 text-white border-none"
                                @click="deleteDomain(ad)"></Button>
                        </div>
                    </template>
                    <p class="m-0 text-300 font-italic" v-if="availableDomains.length == 0">- empty -</p>
                </div>
                <OverlayPanel ref="addDomOvPa">
                    <p class="mt-0">{{ $t('main-page.settings-comp.add-domain') }}</p>
                    <div class="p-inputgroup">
                        <InputText v-model="newDomainInput"></InputText>
                        <Button icon="pi pi-plus" @click="addNewDomain()"></Button>
                    </div>
                </OverlayPanel>
            </Fieldset>
            <Fieldset :legend="$t('main-page.settings-comp.path')">
                <p class="-mt-1 mb-4 font-italic">{{ $t('main-page.settings-comp.path-text') }}</p>
                <p class="text-sm">{{ $t('main-page.settings-comp.path') }}</p>
                <InputText class="w-full" v-model="path" spellcheck="false"></InputText>
                <Button label="Save" icon="pi pi-save" class="w-full mt-4" @click="setPath();"></Button>
            </Fieldset>
            <Fieldset :legend="$t('main-page.settings-comp.proxy')">
                <p class="-mt-1 mb-4 font-italic">{{ $t('main-page.settings-comp.proxy-text') }}<a
                        class="text-primary no-underline"
                        href="https://www.npmjs.com/package/acme-client">acme-client.js/Let's Encrypt</a>.</p>
                <div class="flex align-items-center justify-content-between my-4">
                    <p class="text-sm m-0">{{ $t('main-page.settings-comp.proxy') }}</p>
                    <ToggleButton v-model="proxy.enabled"></ToggleButton>
                </div>
                <div class="flex align-items-center justify-content-between my-4">
                    <p class="text-sm m-0">{{ $t('main-page.settings-comp.certificates') }}</p>
                    <div class="p-inputgroup w-min">
                        <Button :label="$t('main-page.settings-comp.force')" class="bg-gray-700 text-white border-none"
                            @click="updateCerts(true);"></Button>
                        <Button :label="$t('main-page.settings-comp.update')" @click="updateCerts(false);"></Button>
                    </div>
                </div>
                <p class="text-sm">{{ $t('main-page.settings-comp.maintainer-mail') }}</p>
                <InputText class="w-full" spellcheck="false" v-model="proxy.maintainerEmail"
                    :disabled="!this.proxy.enabled"></InputText>
                <Button :label="$t('main-page.settings-comp.save')" icon="pi pi-save" class="w-full mt-4"
                    @click="updateProxy"></Button>
            </Fieldset>
        </div>
    </Dialog>
</template>

<script>
import VueCookies from 'vue-cookies';

import Dialog from 'primevue/dialog';
import Fieldset from 'primevue/fieldset';
import OverlayPanel from 'primevue/overlaypanel';
import InputText from "primevue/inputtext";
import Button from 'primevue/button';
import ToggleButton from 'primevue/togglebutton';
import Dropdown from 'primevue/dropdown';

export default {
    data() {
        return {
            settingsDialog: false,
            availableDomains: [],
            newDomainInput: "",
            github: {
                pat: ""
            },
            account: {
                user: "",
                pwd: ""
            },
            path: "",
            proxy: {
                maintainerEmail: "",
                enabled: false
            },
            selectedLanguage: this.$i18n.locale,
            languages: [
                { name: 'English', code: 'en' },
                { name: 'Deutsch', code: 'de' },
                { name: 'Français', code: 'fr' },
                { name: 'Español', code: 'es' },
                { name: 'Nederlands', code: 'nl' }
            ]
        }
    },
    components: {
        Dialog,
        Fieldset,
        OverlayPanel,
        InputText,
        Button,
        ToggleButton,
        Dropdown
    },
    watch: {
        "proxy.cluster"() {
            if (!this.proxy.cluster) this.proxy.workers = 1;
        }
    },
    methods: {
        changeLanguage(language) {
            this.$i18n.locale = language;
            VueCookies.set("lang", language);
        },
        fetchAvailableDomains() {
            this.$STORAGE.socket.emit("domain:list", (data) => this.availableDomains = data.payload);
        },
        addNewDomain() {
            this.$STORAGE.socket.emit("domain:add", { domain: this.newDomainInput }, (data) => {
                let { error, msg } = data;
                if (error) {
                    this.$EVENT.emit("showToast", { severity: "error", title: "Error", msg });
                } else {
                    this.$EVENT.emit("showToast", { severity: "success", title: "Done", msg });
                }
                this.fetchAvailableDomains();
                this.$refs.addDomOvPa.hide();
                this.newDomainInput = "";
            });
        },
        deleteDomain(domain) {
            this.$STORAGE.socket.emit("domain:delete", { domain }, (data) => {
                let { error, msg } = data;
                if (error) {
                    this.$EVENT.emit("showToast", { severity: "error", title: "Error", msg });
                } else {
                    this.$EVENT.emit("showToast", { severity: "success", title: "Done", msg });
                }
                this.fetchAvailableDomains();
            });
        },
        fetchGithubAcc() {
            this.$STORAGE.socket.emit("github:get", (data) => this.github = data.payload);
        },
        updateGithubAcc() {
            this.$STORAGE.socket.emit("github:set", this.github, (data) => {
                let { error, msg } = data;
                if (error) {
                    this.$EVENT.emit("showToast", { severity: "error", title: "Error", msg });
                } else {
                    this.$EVENT.emit("showToast", { severity: "success", title: "Done", msg });
                }
            });
        },
        updateNodeupLogin() {
            this.$STORAGE.socket.emit("account:set", this.account, (data) => {
                let { error, msg } = data;
                if (error) {
                    this.$EVENT.emit("showToast", { severity: "error", title: "Error", msg });
                } else {
                    this.$EVENT.emit("showToast", { severity: "success", title: "Done", msg });
                }
            });
        },
        fetchPath() {
            this.$STORAGE.socket.emit("path:get", (data) => this.path = data.payload);
        },
        setPath() {
            this.$STORAGE.socket.emit("path:set", { path: this.path }, (data) => {
                let { error, msg } = data;
                if (error) {
                    this.$EVENT.emit("showToast", { severity: "error", title: "Error", msg });
                } else {
                    this.$EVENT.emit("showToast", { severity: "success", title: "Done", msg });
                }
            });
        },
        updateProxy() {
            this.$STORAGE.socket.emit("proxy:set", this.proxy, (data) => {
                let { error, msg } = data;
                if (error) {
                    this.$EVENT.emit("showToast", { severity: "error", title: "Error", msg });
                } else {
                    this.$EVENT.emit("showToast", { severity: "success", title: "Done", msg });
                }
            });
        },
        fetchProxy() {
            this.$STORAGE.socket.emit("proxy:get", (data) => this.proxy = data.payload);
        },
        updateCerts(force = false) {
            this.$STORAGE.socket.emit("proxy:updateCerts", { force }, (data) => {
                let { error, msg } = data;
                if (error) {
                    this.$EVENT.emit("showToast", { severity: "error", title: "Error", msg });
                } else {
                    this.$EVENT.emit("showToast", { severity: "success", title: "Done", msg });
                }
            });
        },
        toggleSettingsDialog(b = undefined) {
            if (b) this.settingsDialog = b
            else this.settingsDialog = !this.settingsDialog;
            if (this.settingsDialog) this.update();
        },
        update() {
            this.fetchAvailableDomains();
            this.fetchGithubAcc();
            this.fetchPath();
            this.fetchProxy();
        }
    },
    created() {
        this.update();
    }
}
</script>