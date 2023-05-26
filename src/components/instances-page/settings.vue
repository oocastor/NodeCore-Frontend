<template>
    <Dialog v-model:visible="settingsDialog" modal :draggable="false" header="Settings"
        style="max-width: 600px; width: 100%;">
        <div class="flex flex-column gap-4">
            <Fieldset legend="Login">
                <p class="-mt-1 mb-4 font-italic">Change your login data for this app.</p>
                <p class="text-sm">Username</p>
                <InputText class="w-full" v-model="account.user"></InputText>
                <p class="text-sm">Password</p>
                <InputText class="w-full" v-model="account.pwd" type="password"></InputText>
                <Button label="Save" icon="pi pi-save" class="w-full mt-4" @click="updateNodeupLogin();"></Button>
            </Fieldset>
            <Fieldset legend="Github">
                <p class="-mt-1 mb-4 font-italic">Add your github account to pull project data directly from your repos.</p>
                <p class="flex text-sm">PAT <span class="ml-auto text-400">(personal access token)</span></p>
                <InputText class="w-full" v-model="github.pat" type="password"></InputText>
                <div class="flex gap-2 mt-4">
                    <Button label="Save" icon="pi pi-save" class="w-6" @click="updateGithubAcc();"></Button>
                    <Button label="Delete" icon="pi pi-trash" type="password"
                    class="w-6 bg-red-500 text-white border-none" @click="{
                        this.github = {pat: ''};
                        updateGithubAcc();
                    }"></Button>
                </div>
            </Fieldset>
            <Fieldset legend="Domains">
                <div class="flex justify-content-between align-items-center -mt-1 mb-4">
                    <p class="w-8 font-italic">Add your managed domains which points to the server.</p>
                    <Button icon="pi pi-plus" label="Add" class="p-button-sm"
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
                    <p class="mt-0">Add domain</p>
                    <div class="p-inputgroup">
                        <InputText v-model="newDomainInput"></InputText>
                        <Button icon="pi pi-plus" @click="addNewDomain()"></Button>
                    </div>
                </OverlayPanel>
            </Fieldset>
            <Fieldset legend="Path">
                <p class="-mt-1 mb-4 font-italic">Change the path, where the instances are stored.</p>
                <p class="text-sm">Path</p>
                <InputText class="w-full" v-model="path" spellcheck="false"></InputText>
                <Button label="Save" icon="pi pi-save" class="w-full mt-4" @click="setPath();"></Button>
            </Fieldset>
            <Fieldset legend="Proxy">
                <p class="-mt-1 mb-4 font-italic">Configure the proxy which handels the redirects to the instances. SSL Encryption by <a class="text-primary no-underline" href="https://www.npmjs.com/package/acme-client">acme-client.js/Let's Encrypt</a>.</p>
                <div class="flex align-items-center justify-content-between my-4">
                    <p class="text-sm m-0">Proxy</p>
                    <ToggleButton v-model="proxy.enabled"></ToggleButton>
                </div>
                <div class="flex align-items-center justify-content-between my-4">
                    <p class="text-sm m-0">Cluster</p>
                    <InputSwitch v-model="proxy.cluster" :disabled="!this.proxy.enabled"></InputSwitch>
                </div>
                <div class="flex align-items-center justify-content-between my-4">
                    <p class="text-sm m-0">Worker</p>
                    <div class="flex align-items-center">
                        <Button icon="pi pi-minus" style="transform: scale(0.7);" :disabled="!proxy.cluster || !this.proxy.enabled" @click="() => {if(proxy.workers > 1) proxy.workers--}"></Button>
                        <p class="mx-3 text-sm text-300">{{ proxy.workers }}</p>
                        <Button icon="pi pi-plus" style="transform: scale(0.7);" :disabled="!proxy.cluster || !this.proxy.enabled" @click="proxy.workers++"></Button>
                    </div>
                </div>
                
                <p class="text-sm">Maintainer Email</p>
                <InputText class="w-full" spellcheck="false" v-model="proxy.maintainerEmail" :disabled="!this.proxy.enabled"></InputText>
                <Button label="Save" icon="pi pi-save" class="w-full mt-4" @click="updateProxy"></Button>
            </Fieldset>
        </div>
    </Dialog>
</template>

<script>
import Dialog from 'primevue/dialog';
import Fieldset from 'primevue/fieldset';
import OverlayPanel from 'primevue/overlaypanel';
import InputText from "primevue/inputtext";
import Button from 'primevue/button';
import InputSwitch from 'primevue/inputswitch';
import ToggleButton from 'primevue/togglebutton';

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
                cluster: false,
                workers: 1,
                enabled: false
            }
        }
    },
    components: {
        Dialog,
        Fieldset,
        OverlayPanel,
        InputText,
        Button,
        InputSwitch,
        ToggleButton
    },
    watch: {
        "proxy.cluster"() {
            if(!this.proxy.cluster) this.proxy.workers = 1;
        }
    },
    methods: {
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
        toggleSettingsDialog(b = undefined) {
            if (b) this.settingsDialog = b
            else this.settingsDialog = !this.settingsDialog;
        }
    },
    created() {
        this.fetchAvailableDomains();
        this.fetchGithubAcc();
        this.fetchPath();
        this.fetchProxy();
    }
}
</script>