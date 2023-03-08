<template>
    <div class="w-full flex flex-column p-2 gap-3">
        <div class="flex justify-content-between">
            <p class="text-3xl m-0 font-bold">{{ isCreation ? "New Instance" : "Update Instance" }}</p>
            <div class="flex gap-3">
                <i class="pi pi-times text-xl text-gray-400 cursor-pointer" @click="cancelCreationProcess($event)"></i>
            </div>
        </div>
        <Fieldset legend="Project">
            <p class="m-0 mb-2 text-sm">Name</p>
            <InputText v-model="instance.name" type="text" class="w-full" style="height: 40px;">
            </InputText>
            <p class="mt-3 mb-2 text-sm">Import</p>
            <div class="flex gap-2">
                <Button label="Github"></Button>
                <Button label="Upload" disabled></Button>
            </div>
        </Fieldset>
        <Fieldset :collapsed="!instance.network.isAccessable">
            <template #legend>
                <div class="flex align-items-center gap-2">
                    <p class="m-0">Public</p>
                    <InputSwitch v-model="instance.network.isAccessable" style="transform: scale(0.85);" />
                </div>
            </template>
            <div class="flex flex-column gap-3">
                <div>
                    <p class="m-0 mb-2 text-sm">Subdomain</p>
                    <div class="flex w-full align-items-center gap-2" style="height: 40px;">
                        <InputText v-model="instance.network.redirect.sub" type="text" class="w-4" style="height: inherit;"
                            :disabled="!instance.network.isAccessable">
                        </InputText>
                        <p>.</p>
                        <Dropdown v-model="instance.network.redirect.domain" :options="available" class="w-8"
                            style="height: inherit;" :disabled="!instance.network.isAccessable" optionLabel="name">
                        </Dropdown>
                    </div>
                </div>
                <div>
                    <p class="m-0 mb-2 text-sm">Port</p>
                    <div class="flex w-full align-items-center gap-2" style="height: 40px;">
                        <InputText v-model="instance.network.redirect.port" type="text" class="flex-auto" style="height: inherit;"
                            :disabled="!instance.network.isAccessable">
                        </InputText>
                        <Button label="Unused" class="p-button-sm bg-white-a15 hover:" style="height: inherit;"
                            :disabled="!instance.network.isAccessable" @click="getUnusedPort();"></Button>
                    </div>
                </div>
            </div>
        </Fieldset>
        <Fieldset legend="Cmd" :toggleable="true" :collapsed="true">
            <p class="m-0 mb-4 text-sm">Define required setup commands for your <Tag value="node.js"
                    class="text-white bg-gray-900"></Tag> instance.</p>
            <Textarea class="w-full h-10rem surface-50 border-none font-mono" autoResize="false" autocorrect="off" spellcheck="false"></Textarea>
        </Fieldset>
        <Fieldset legend=".env" :toggleable="true" :collapsed="true">
            <p class="m-0 mb-4 text-sm">Set required environment variables for your <Tag value="node.js"
                    class="text-white bg-gray-900"></Tag> instance.</p>
            <Textarea class="w-full h-10rem surface-50 border-none font-mono" autoResize="false" autocorrect="off" spellcheck="false"></Textarea>
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
import Textarea from "primevue/textarea";
import Tag from "primevue/tag";
import { ref } from "vue";

export default {
    components: {
        Fieldset,
        InputText,
        Button,
        InputSwitch,
        Dropdown,
        ConfirmPopup,
        Textarea,
        Tag
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
        let instance = ref({
            name: "Test",
            network: {
                isAccessable: false,
                redirect: {
                    sub: "test",
                    domain: available[0],
                    port: "1000"
                },
            cmd: [],
            env: []
            }
        })

        return {
            instance,
            available
        }
    },
    methods: {
        getUnusedPort() {
            this.instance.network.redirect.port = Math.round(Math.random() * 9000) + 1000;
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