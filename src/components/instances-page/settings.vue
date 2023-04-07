<template>
    <Dialog v-model:visible="settingsDialog" modal :draggable="false" header="Settings"
        style="max-width: 600px; width: 100%;">
        <div class="flex flex-column gap-4">
            <Fieldset legend="Login">
                <p class="-mt-1 mb-4 font-italic">Change your login for this app.</p>
                <p class="text-sm">Username</p>
                <InputText class="w-full" v-model="account.user"></InputText>
                <p class="text-sm">Password</p>
                <InputText class="w-full" v-model="account.pwd" type="password"></InputText>
                <Button label="Save" icon="pi pi-save" class="w-full mt-4" @click="updateNodeupLogin();"></Button>
            </Fieldset>
            <Fieldset legend="Github">
                <p class="-mt-1 mb-4 font-italic">Add your github account to pull project data directly from your repos.</p>
                <p class="text-sm">Username</p>
                <InputText class="w-full" v-model="github.user"></InputText>
                <p class="flex text-sm">PAT <span class="ml-auto text-400">(personal access token)</span></p>
                <InputText class="w-full" v-model="github.pat" type="password"></InputText>
                <div class="flex gap-2 mt-4">
                    <Button label="Save" icon="pi pi-save" class="w-6" @click="updateGithubAcc();"></Button>
                    <Button label="Delete" icon="pi pi-trash" type="password"
                    class="w-6 bg-red-500 text-white border-none" @click="{
                        this.github = {user: '', pat: ''};
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
        </div>
    </Dialog>
</template>

<script>
import Dialog from 'primevue/dialog';
import Fieldset from 'primevue/fieldset';
import OverlayPanel from 'primevue/overlaypanel';
import InputText from "primevue/inputtext";
import Button from 'primevue/button';

export default {
    data() {
        return {
            settingsDialog: true,
            availableDomains: [],
            newDomainInput: "",
            github: {
                user: "",
                pat: ""
            },
            account: {
                user: "",
                pwd: ""
            }
        }
    },
    components: {
        Dialog,
        Fieldset,
        OverlayPanel,
        InputText,
        Button
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
            this.$STORAGE.socket.emit("login:set", this.github, (data) => {
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
        }
    },
    created() {
        this.fetchAvailableDomains();
        this.fetchGithubAcc();
    }
}
</script>