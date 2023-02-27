<template>
    <div class="w-full flex flex-column p-2 gap-3">
        <div class="flex justify-content-between">
            <p class="text-3xl m-0 font-bold">{{ isCreation ? "New Redirect" : "Update Redirect" }}</p>
            <div class="flex gap-3">
                <i class="pi pi-times text-xl text-gray-400 cursor-pointer" @click="cancelCreationProcess($event)"></i>
            </div>
        </div>
        <Fieldset legend="Info">
            <p class="m-0 mb-2 text-sm">Name</p>
            <InputText v-model="redirect.name" type="text" class="w-full" style="height: 40px;">
            </InputText>
        </Fieldset>
        <Fieldset legend="Network">
            <div class="flex flex-column gap-3">
                <div>
                    <p class="m-0 mb-2 text-sm">Subdomain</p>
                    <div class="flex w-full align-items-center gap-2" style="height: 40px;">
                        <InputText v-model="redirect.network.sub" type="text" class="w-4" style="height: inherit;"
                        >
                        </InputText>
                        <p>.</p>
                        <Dropdown v-model="redirect.network.domain" :options="available" class="w-8"
                            style="height: inherit;" optionLabel="name">
                        </Dropdown>
                    </div>
                </div>
                <div>
                    <p class="m-0 mb-2 text-sm">Port</p>
                    <div class="flex w-full align-items-center gap-2" style="height: 40px;">
                        <InputText v-model="redirect.network.port" type="text" class="flex-auto"
                            style="height: inherit;">
                        </InputText>
                        <Button label="Unused" class="p-button-sm bg-white-a15 hover:" style="height: inherit;"
                        @click="getUnusedPort();"></Button>
                    </div>
                </div>
            </div>
        </Fieldset>
        <Fieldset :toggleable="true" :collapsed="true" v-if="!isCreation">
            <template #legend>
                <p class="m-0 text-red-500">Critical Area</p>
            </template>
            <div class="flex align-items-center">
                <p class="m-0 text-sm flex-auto">Delete current instance</p>
                <Button label="Delete" @click="deleteInstance($event)" icon="pi pi-trash"
                    class="bg-red-500 text-white border-none"></Button>
            </div>
        </Fieldset>
        <div class="flex justify-content-end gap-2">
            <Button label="Save"></Button>
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
import { ref } from "vue";

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
        isCreation: Boolean
    },
    data() {
        let available = [
            { name: "oocastor.dev" },
            { name: "schneider-jonas.dev" },
            { name: "songdle.app" },
        ]
        let redirect = ref({
            name: "Test",
            network: {
                sub: "test",
                domain: available[0],
                port: "1000"

            }
        })

        return {
            redirect,
            available
        }
    },
    methods: {
        getUnusedPort() {
            this.redirect.network.port = Math.round(Math.random() * 9000) + 1000;
        },
        cancelCreationProcess(event) {
            this.$confirm.require({
                target: event.currentTarget,
                message: 'Are you sure?',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    console.log("Creation canceled!")
                }
            });
        },
        deleteInstance(event) {
            this.$confirm.require({
                target: event.currentTarget,
                message: 'Are you sure you want to proceed?',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    console.log("Delete instance!")
                }
            });
        }
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