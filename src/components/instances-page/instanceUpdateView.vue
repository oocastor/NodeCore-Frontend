<template>
    <p class="m-0 mb-3 text-200 text-overflow">{{ instance.method == 'CREATE' ? "Instance" : `Instance (${instance.name})`
    }}</p>
    <div class="w-full flex flex-column gap-3 surface-card border-round p-3">
        <div class="flex justify-content-between">
            <p class="text-3xl m-0 font-bold">{{ instance.method == 'CREATE' ? "New Instance" : "Edit Instance" }}</p>
            <div class="flex gap-3">
                <i class="pi pi-times text-xl text-gray-400 cursor-pointer" @click="cancelCreationProcess($event)"></i>
            </div>
        </div>
        <Fieldset legend="Project">
            <div class="-mt-3">
                <p class="my-2 text-sm">Name</p>
                <InputText v-model="instance.name" type="text" class="w-full" style="height: 40px;" placeholder="Tomato">
                </InputText>
            </div>
            <div v-if="instance.method == 'CREATE'">
                <p class="mt-3 mb-2 text-sm">Import</p>
                <div class="flex align-items-center gap-2">
                    <Button label="Github" @click="$refs.githubRepoSearch.toggle($event);"></Button>
                    <Button label="Link" class="surface-100 border-100 text-white hover:surface-50"
                        @click="$refs.gitLinkInput.toggle($event)"></Button>
                    <p class="ml-auto text-400 m-0">{{ instance.git?.name ? instance.git.name : "empty" }}</p>
                </div>
                <OverlayPanel ref="githubRepoSearch" style="max-height: 400px; overflow: hidden;">
                    <p class="mt-0">Select Repo</p>
                    <Listbox filter :options="userRepos" optionLabel="name" style="height: 300px; overflow-y: scroll;"
                        v-model="instance.git"></Listbox>
                </OverlayPanel>
                <OverlayPanel ref="gitLinkInput">
                    <p class="mt-0">Enter Link</p>
                    <div class="flex align-items-center gap-2">
                        <InputText v-model="linkInput"></InputText>
                        <Button icon="pi pi-check" @click="() => {
                            $refs.gitLinkInput.hide();
                            instance.git = linkInput == '' ? '' : {
                                name: linkInput,
                                uri: linkInput,
                                extern: true
                            }
                        }"></Button>
                    </div>
                </OverlayPanel>
            </div>
        </Fieldset>
        <Fieldset :collapsed="!instance.network.isAccessable">
            <template #legend>
                <div class="flex align-items-center gap-2">
                    <p class="m-0">Public</p>
                    <InputSwitch v-model="readonlyAccessability" @click="toggleAccessability();"
                        style="transform: scale(0.85);" />
                </div>
            </template>
            <div class="flex flex-column gap-3">
                <div>
                    <p class="m-0 mb-2 text-sm">Subdomain</p>
                    <div class="flex w-full align-items-center gap-2" style="height: 40px;">
                        <InputText v-model="instance.network.redirect.sub" type="text" class="w-4" style="height: inherit;"
                            :disabled="!instance.network.isAccessable" placeholder="tom">
                        </InputText>
                        <p>.</p>
                        <Dropdown v-model="instance.network.redirect.domain" :options="available" class="w-8"
                            style="height: inherit;" :disabled="!instance.network.isAccessable"
                            :loading="!available.length">
                        </Dropdown>
                    </div>
                </div>
                <div>
                    <p class="m-0 mb-2 text-sm">Port</p>
                    <div class="flex w-full align-items-center gap-2" style="height: 40px;">
                        <InputNumber v-model="instance.network.redirect.port" :useGrouping="false" type="text"
                            class="flex-auto" style="height: inherit;" :disabled="!instance.network.isAccessable">
                        </InputNumber>
                        <Button label="Unused" class="p-button-sm" style="height: inherit;"
                            :disabled="!instance.network.isAccessable" @click=" getUnusedPort();"></Button>
                    </div>
                </div>
            </div>
        </Fieldset>
        <Fieldset legend="Cmd" :toggleable="true" :collapsed="true">
            <p class="m-0 mb-4 text-sm">Define required setup commands for your <Tag value="node.js"
                    class="text-white bg-gray-900"></Tag> instance.</p>
            <Textarea class="w-full h-10rem surface-50 border-none font-mono" autoResize="false" autocorrect="off"
                spellcheck="false" v-model="_CMD"></Textarea>
        </Fieldset>
        <Fieldset legend=".env" :toggleable="true" :collapsed="true">
            <p class="m-0 mb-4 text-sm">Set required environment variables for your <Tag value="node.js"
                    class="text-white bg-gray-900"></Tag> instance.</p>
            <Textarea class="w-full h-10rem surface-50 border-none font-mono" autoResize="false" autocorrect="off"
                spellcheck="false" v-model="_ENV"></Textarea>
        </Fieldset>
        <Fieldset :toggleable="true" :collapsed="true" v-if="instance.method == 'UPDATE'">
            <template #legend>
                <p class="m-0 text-red-500">Critical Area</p>
            </template>
            <div class="flex align-items-center">
                <p class="m-0 text-sm flex-auto">Delete current instance</p>
                <Button label="Delete" @click=" deleteInstance($event)" icon="pi pi-trash"
                    class="bg-red-500 text-white border-none"></Button>
            </div>
        </Fieldset>
        <div class="flex justify-content-end gap-2">
            <Button label="Save" @click=" writeInstance();" :loading="writing"></Button>
            <Button label="Cancel" class="surface-100 border-100 text-white hover:surface-50"
                @click=" cancelCreationProcess($event)"></Button>
            <ConfirmPopup></ConfirmPopup>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
import Fieldset from "primevue/fieldset";
import InputText from 'primevue/inputtext';
import InputNumber from "primevue/inputnumber";
import Button from 'primevue/button';
import InputSwitch from 'primevue/inputswitch';
import Dropdown from 'primevue/dropdown';
import ConfirmPopup from 'primevue/confirmpopup';
import Textarea from "primevue/textarea";
import Tag from "primevue/tag";
import Listbox from "primevue/listbox";
import OverlayPanel from "primevue/overlaypanel";

export default {
    components: {
        Fieldset,
        InputText,
        InputNumber,
        Button,
        InputSwitch,
        Dropdown,
        ConfirmPopup,
        Textarea,
        Tag,
        Listbox,
        OverlayPanel
    },
    computed: {
        _CMD: {
            get() {
                return this.instance.cmd.join("\n");
            },
            set(v) {
                this.instance.cmd = v.split(/\n/);
            }
        },
        _ENV: {
            get() {
                return this.instance.env.join("\n");
            },
            set(v) {
                this.instance.env = v.split(/\n/);
            }
        },
        readonlyAccessability() {
            return this.instance.network.isAccessable;
        }
    },
    data() {
        let available = [];
        let userRepos = [];
        let instance = {
            status: 0,
            name: "",
            git: "",
            network: {
                isAccessable: false,
                redirect: {
                    sub: "",
                    domain: null,
                    port: 0
                }
            },
            cmd: [],
            env: [],
            method: "CREATE"
        };
        //blank instance obj
        let blankInstance = JSON.parse(JSON.stringify(instance));

        return {
            instance,
            blankInstance,
            available,
            userRepos,
            writing: false,
            proxy: {}
        }
    },
    methods: {
        writeInstance() {
            console.log(this.instance);
            this.writing = true;
            this.$STORAGE.socket.emit("instance:write", this.instance, (data) => {
                let { error } = data;
                this.$EVENT.emit("showNotification", data);
                if (!error) this.$EVENT.emit("changeView", 0);
                this.writing = false;
            });
        },
        getAvailableDomains() {
            this.$STORAGE.socket.emit("domain:list", (data) => {
                this.available = data.payload;
                if (this.instance.method != 'UPDATE') this.instance.network.redirect.domain = this.available[0];
            });
        },
        getUnusedPort() {
            this.$STORAGE.socket.emit("port:get", (data) => this.instance.network.redirect.port = data.payload);
        },
        getUserRepos() {
            this.$STORAGE.socket.emit("github:repos", (data) => this.userRepos = data.payload);
        },
        cancelCreationProcess(event) {
            // this.$confirm.require({
            //     target: event.currentTarget,
            //     message: 'Are you sure?',
            //     icon: 'pi pi-exclamation-triangle',
            //     accept: () => {
            //         this.$EVENT.emit("changeView", 0);
            //     }
            // });
            this.$EVENT.emit("changeView", 0);
        },
        deleteInstance(event) {
            this.$confirm.require({
                target: event.currentTarget,
                message: 'Are you sure you want to proceed?',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.$STORAGE.socket.emit("instance:delete", this.instance, (data) => {
                        let { error } = data;
                        this.$EVENT.emit("showNotification", data);
                        if (!error) this.$EVENT.emit("changeView", 0);
                    });
                }
            });
        },
        reset() {
            this.instance = JSON.parse(JSON.stringify(this.blankInstance));
        },
        setPayload(i) {
            if (i) {
                this.instance = JSON.parse(JSON.stringify(i)); //deep copy
                this.instance.method = "UPDATE";
            } else {
                this.reset();
                this.resetNetworkTab();
                delete this.instance._id;
            }
        },
        toggleAccessability() {
            if (!this.proxy.enabled) {
                this.instance.network.isAccessable = false;
                this.$EVENT.emit("showNotification", {
                    error: true,
                    msg: "Cannot create redirects with proxy disabled",
                    payload: null
                });
            } else {
                this.instance.network.isAccessable = !this.instance.network.isAccessable;
                this.resetNetworkTab();
            }
        },
        resetNetworkTab() {
            this.getUnusedPort();
            this.instance.network.redirect.domain = this.available[0];
        },
        fetchProxySettings() {
            this.$STORAGE.socket.emit("proxy:get", (data) => this.proxy = data.payload);
        }
    },
    created() {
        this.fetchProxySettings();
        this.getAvailableDomains();
        this.getUserRepos();
    }
}
</script>

<style lang="scss" scoped>
.p-fieldset>.p-fieldset-content {
    padding: 0 !important;
}
</style>

<style lang="scss">
.p-dropdown {
    display: flex;
    align-items: center;
}

.p-inputtext[role=combobox] {
    padding: 0 0 0 5px !important;
}
</style>