<template>
    <div class="w-full flex flex-column p-2 gap-3">
        <div class="flex justify-content-between">
            <p class="text-3xl m-0 font-bold">{{ !update ? "New Redirect" : "Update Redirect" }}</p>
            <div class="flex gap-3">
                <i class="pi pi-times text-xl text-gray-400 cursor-pointer" @click="cancelCreationProcess($event)"></i>
            </div>
        </div>
        <Fieldset legend="Info">
            <p class="m-0 mb-2 text-sm">Name</p>
            <InputText v-model="redirect.name" type="text" class="w-full" style="height: 40px;" placeholder="Potato">
            </InputText>
        </Fieldset>
        <Fieldset legend="Network">
            <div class="flex flex-column gap-3">
                <div>
                    <p class="m-0 mb-2 text-sm">Subdomain</p>
                    <div class="flex w-full align-items-center gap-2" style="height: 40px;">
                        <InputText v-model="redirect.network.sub" type="text" class="w-4" style="height: inherit;"
                            placeholder="pot">
                        </InputText>
                        <p>.</p>
                        <Dropdown v-model="redirect.network.domain" :options="available" class="w-8"
                            style="height: inherit;" :loading="!available.length">
                        </Dropdown>
                    </div>
                </div>
                <div>
                    <p class="m-0 mb-2 text-sm">Port</p>
                    <div class="flex w-full align-items-center gap-2" style="height: 40px;">
                        <InputText v-model="redirect.network.port" type="text" class="flex-auto" style="height: inherit;">
                        </InputText>
                        <Button label="Unused" class="p-button-sm bg-white-a15 hover:" style="height: inherit;"
                            @click="getUnusedPort();"></Button>
                    </div>
                </div>
            </div>
        </Fieldset>
        <Fieldset :toggleable="true" :collapsed="true" v-if="update">
            <template #legend>
                <p class="m-0 text-red-500">Critical Area</p>
            </template>
            <div class="flex align-items-center">
                <p class="m-0 text-sm flex-auto">Delete current redirect</p>
                <Button label="Delete" @click="deleteInstance($event)" icon="pi pi-trash"
                    class="bg-red-500 text-white border-none"></Button>
            </div>
        </Fieldset>
        <div class="flex justify-content-end gap-2">
            <Button label="Save" @click="createRedirect();"></Button>
            <Button label="Cancel" class="surface-100 text-white hover:surface-50"
                @click="cancelCreationProcess($event)"></Button>
            <ConfirmPopup></ConfirmPopup>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
import Fieldset from "primevue/fieldset";
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import InputSwitch from 'primevue/inputswitch';
import Dropdown from 'primevue/dropdown';
import ConfirmPopup from 'primevue/confirmpopup';

export default {
    components: {
        Fieldset,
        InputText,
        Button,
        InputSwitch,
        Dropdown,
        ConfirmPopup,
    },
    props: {
    },
    data() {
        let available = []
        let redirect = {
            name: "",
            network: {
                sub: "",
                domain: null,
                port: ""

            }
        }
        //blank redirect obj
        let blankRedirect = JSON.parse(JSON.stringify(redirect));

        return {
            redirect,
            blankRedirect,
            available,
            update: false
        }
    },
    methods: {
        createRedirect() {
            this.$STORAGE.socket.emit("redirect:create", this.redirect, (data) => {
                let { error, msg } = data;
                if (error) {
                    this.$EVENT.emit("showToast", { severity: "error", title: "Error", msg });
                } else {
                    this.$EVENT.emit("showToast", { severity: "success", title: "Done", msg });
                    this.$EVENT.emit("changeView", 0);
                    this.reset();
                }
            });
        },
        getAvailableDomains() {
            this.$STORAGE.socket.emit("domain:list", (data) => {
                this.available = data.payload;
                if(!this.payload) this.redirect.network.domain = this.available[0];
            });
        },
        getUnusedPort() {
            this.$STORAGE.socket.emit("port:get", (data) => this.redirect.network.port = data.payload);
        },
        cancelCreationProcess(event) {
            this.$confirm.require({
                target: event.currentTarget,
                message: 'Are you sure?',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.$EVENT.emit("changeView", 0);
                }
            });
        },
        deleteInstance(event) {
            this.$confirm.require({
                target: event.currentTarget,
                message: 'Are you sure you want to proceed?',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    //
                }
            });
        },
        reset() {
            this.redirect = JSON.parse(JSON.stringify(this.blankRedirect));
        },
        setPayload(re) {
            if(re) {
                this.redirect = re;
            } else {
                this.reset();
                this.getUnusedPort();
                this.redirect.network.domain = this.available[0];
            }
        }
    },
    created() {
        this.getAvailableDomains();
    },
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