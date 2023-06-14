<template>
    <p class="m-0 mb-3 text-200 text-overflow">{{ this.redirect.method == "UPDATE" ? `${$t('main-page.redirects-comp.redirect')} (${redirect.name})` :
        $t('main-page.redirects-comp.redirect') }}</p>
    <div class="w-full flex flex-column p-3 gap-3 surface-card border-round">
        <div class="flex justify-content-between">
            <p class="text-3xl m-0 font-bold">{{ this.redirect.method != "UPDATE" ? $t('main-page.redirects-comp.new-redirect') : $t('main-page.redirects-comp.update-redirect') }}
            </p>
            <div class="flex gap-3">
                <i class="pi pi-times text-xl text-gray-400 cursor-pointer" @click="cancelCreationProcess($event)"></i>
            </div>
        </div>
        <Fieldset :legend="$t('main-page.redirects-comp.info')">
            <div class="flex justify-content-between align-items-center -mt-3">
                <p class="ma-0 text-sm">{{ $t('main-page.enabled') }}</p>
                <InputSwitch v-model="redirect.status" :trueValue="1" :falseValue="0"></InputSwitch>
            </div>
            <p class="my-2 text-sm">{{ $t('main-page.redirects-comp.name') }}</p>
            <InputText v-model="redirect.name" type="text" class="w-full" style="height: 40px;" :placeholder="$t('main-page.redirects-comp.placeholder-name')">
            </InputText>
        </Fieldset>
        <Fieldset :legend="$t('main-page.redirects-comp.network')">
            <div class="flex flex-column gap-3">
                <div>
                    <p class="m-0 mb-2 text-sm">{{ $t('main-page.instances-comp.subdomain') }}</p>
                    <div class="flex w-full align-items-center gap-2" style="height: 40px;">
                        <InputText v-model="redirect.network.sub" type="text" class="w-4" style="height: inherit;"
                            placeholder="www">
                        </InputText>
                        <p>.</p>
                        <Dropdown v-model="redirect.network.domain" :options="available" class="w-8"
                            style="height: inherit;" :loading="!available.length">
                        </Dropdown>
                    </div>
                </div>
                <div>
                    <p class="m-0 mb-2 text-sm">{{$t('main-page.redirects-comp.port')}}</p>
                    <div class="flex w-full align-items-center gap-2" style="height: 40px;">
                        <InputNumber v-model="redirect.network.port" :useGrouping="false" type="text" class="flex-auto"
                            style="height: inherit;">
                        </InputNumber>
                        <Button :label="$t('main-page.redirects-comp.unused')" class="p-button-sm" style="height: inherit;"
                            @click="getUnusedPort();"></Button>
                    </div>
                </div>
            </div>
        </Fieldset>
        <Fieldset :toggleable="true" :collapsed="true" v-if="this.redirect.method == 'UPDATE'">
            <template #legend>
                <p class="m-0 text-red-500">{{$t('main-page.redirects-comp.critical-area')}}</p>
            </template>
            <div class="flex align-items-center">
                <p class="m-0 text-sm flex-auto">{{ $t('main-page.redirects-comp.delete-redirect') }}</p>
                <Button :label="$t('main-page.redirects-comp.delete')" @click="deleteInstance($event)" icon="pi pi-trash"
                    class="bg-red-500 text-white border-none"></Button>
            </div>
        </Fieldset>
        <div class="flex justify-content-end gap-2">
            <Button :label="$t('main-page.redirects-comp.save')" @click="writeRedirect()" :loading="writing"></Button>
            <Button :label="$t('main-page.redirects-comp.cancel')" class="surface-100 text-white hover:surface-50"
                @click="cancelCreationProcess($event)"></Button>
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

export default {
    components: {
        Fieldset,
        InputText,
        Button,
        InputSwitch,
        InputNumber,
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
                port: 0

            },
            status: 0,
            method: "CREATE"
        }
        //blank redirect obj
        let blankRedirect = JSON.parse(JSON.stringify(redirect));

        return {
            redirect,
            blankRedirect,
            available,
            writing: false
        }
    },
    methods: {
        writeRedirect() {
            this.writing = true;
            this.$STORAGE.socket.emit("redirect:write", this.redirect, (data) => {
                let { error } = data;
                this.$EVENT.emit("showNotification", data);
                if (!error) this.$EVENT.emit("changeView", 0);
                this.writing = false;
            });
        },
        getAvailableDomains() {
            this.$STORAGE.socket.emit("domain:list", (data) => {
                this.available = data.payload;
                if (this.redirect.method != "UPDATE") this.redirect.network.domain = this.available[0];
            });
        },
        getUnusedPort() {
            this.$STORAGE.socket.emit("port:get", (data) => this.redirect.network.port = data.payload);
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
                    this.$STORAGE.socket.emit("redirect:delete", this.redirect, (data) => {
                        let { error } = data;
                        this.$EVENT.emit("showNotification", data);
                        if (!error) this.$EVENT.emit("changeView", 0);
                    });
                }
            });
        },
        reset() {
            this.redirect = JSON.parse(JSON.stringify(this.blankRedirect));
        },
        setPayload(re) {
            if (re) {
                this.redirect = JSON.parse(JSON.stringify(re)); //deep copy
                this.redirect.method = "UPDATE";
            } else {
                this.reset();
                this.getUnusedPort();
                this.redirect.network.domain = this.available[0];
                delete this.redirect._id;
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