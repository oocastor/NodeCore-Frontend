<template>
    <p class="m-0 mb-3 text-200 text-overflow">{{ this.redirect.method == "UPDATE" ?
        `${$t('main-page.redirects-comp.redirect')} (${this.redirect.name})` :
        $t('main-page.redirects-comp.redirect') }}</p>
    <div class="w-full flex flex-column p-3 gap-3 surface-card border-round">
        <div class="flex justify-content-between">
            <p class="text-3xl m-0 font-bold">{{ this.redirect.method != "UPDATE" ?
                $t('main-page.redirects-comp.new-redirect') : $t('main-page.redirects-comp.edit-redirect') }}
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
            <div class="p-inputgroup flex-1">
                <InputText v-model="redirectName" type="text" class="w-full" style="height: 40px;"
                    :placeholder="$t('main-page.redirects-comp.placeholder-name')" @click="disableAutoName">
                </InputText>
                <Button icon="pi pi-trash" class="p-button-sm p-button-text surface-section surface-border border-left-none" @click="{disableAutoName(); this.redirect.name = '';}"></Button>
            </div>
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
                    <p class="m-0 mb-2 text-sm">{{ $t('main-page.redirects-comp.port') }}</p>
                    <div class="flex w-full align-items-center gap-2" style="height: 40px;">
                        <div class="p-inputgroup flex-1">
                            <InputNumber v-model="redirect.network.port" :useGrouping="false" type="text" class="flex-auto"
                                style="height: inherit;"></InputNumber>
                            <Button icon="pi pi-desktop"
                                :class="`p-button-sm p-button-text surface-border border-left-none ${autoName ? 'bg-primary-900 text-white' : 'surface-section'}`"
                                @click="$refs.instanceFinder.toggle($event)"></Button>
                            <Button :label="$t('main-page.redirects-comp.unused')"
                                class="p-button-sm p-button-text surface-section surface-border border-left-none"
                                style="height: inherit;" @click="{ getUnusedPort(); disableAutoName(); }"></Button>
                        </div>
                    </div>
                    <OverlayPanel ref="instanceFinder">
                        <p class="mt-0">{{ $t('main-page.instances') }}</p>
                        <Listbox style="width: 250px;" :options="flattenedInstances" v-model="selected"
                            @click="selectInstance" :emptyMessage="$t('main-page.no-instances-text')">
                            <template #option="slotProps">
                                <div class="flex gap-3 align-items-center">
                                    <i class="pi pi-desktop"></i>
                                    <p class="m-0 mb-1">{{ slotProps.option.name.length > 12 ?
                                        slotProps.option.name.slice(0, 12) + "..." : slotProps.option.name }} <span
                                            class="text-sm text-400 ml-1" v-if="slotProps.option.network.redirect.port">({{
                                                slotProps.option.network.redirect.port }})</span></p>
                                </div>
                            </template>
                        </Listbox>
                    </OverlayPanel>
                </div>
            </div>
        </Fieldset>
        <Fieldset :toggleable="true" :collapsed="true" v-if="this.redirect.method == 'UPDATE'">
            <template #legend>
                <p class="m-0 text-red-500">{{ $t('main-page.redirects-comp.critical-area') }}</p>
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
import OverlayPanel from 'primevue/overlaypanel';
import Listbox from 'primevue/listbox';

export default {
    components: {
        Fieldset,
        InputText,
        Button,
        InputSwitch,
        InputNumber,
        Dropdown,
        ConfirmPopup,
        OverlayPanel,
        Listbox
    },
    props: {
        instances: Array,
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
            writing: false,
            selected: null,
            autoName: false
        }
    },
    computed: {
        redirectName: {
            set(value) {
                this.redirect.name = value;
            },
            get() {
                if (this.autoName && this.selected) {
                    let name = `${this.redirect.network.sub} ➙ ${this.selected.name}`;
                    this.redirect.name = name;
                    return name;
                } else {
                    return this.redirect.name;
                }
            }
        },
        flattenedInstances() {
            return this.instances.filter(f => f.network.redirect.port).map(i => {
                return {
                    _id: i._id,
                    name: i.name,
                    network: i.network
                }
            });
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
            this.getUnusedPort();
            this.redirect.network.domain = this.available[0];
        },
        setPayload(re) {
            if (re) {
                this.redirect = JSON.parse(JSON.stringify(re)); //deep copy
                this.redirect.method = "UPDATE";
            } else {
                this.reset();
                delete this.redirect._id;
            }
        },
        selectInstance() {
            if (this.selected) {
                this.redirect.network.port = this.selected.network.redirect.port;
                //fill name if field is empty
                if (!this.redirect.name) this.autoName = true;
            } else {
                //reset panel
                this.getUnusedPort();
                this.redirect.network.domain = this.available[0];
                this.redirect.sub = "";
                this.redirect.name = "";
                this.disableAutoName();
            }
        },
        disableAutoName() {
            this.autoName = false;
            this.selected = null;
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