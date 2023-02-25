<template>
    <div class="w-full flex flex-column p-2 gap-3">
        <div class="flex justify-content-between">
            <p class="text-3xl m-0 font-bold">Settings</p>
            <div class="flex gap-3">
                <i class="pi pi-times text-xl text-gray-400 cursor-pointer"></i>
            </div>
        </div>
        <p class="text-gray-400 font-mono m-0 text-base">Studienplan (Instance)</p>
        <Fieldset>
            <template #legend>
                Public
                <InputSwitch v-model="network.isAccessable" style="transform: scale(0.9); margin: 0 0 -2px 10px;" />
            </template>
            <div class="-mt-3 flex flex-column gap-3">
                <div>
                    <p class="m-0 mb-2 text-sm">Subdomain</p>
                    <div class="flex w-full align-items-center gap-2" style="height: 40px;">
                        <InputText v-model="network.redirect.sub" type="text" class="w-4" style="height: inherit;" :disabled="!network.isAccessable">
                        </InputText>
                        <p>.</p>
                        <Dropdown v-model="network.redirect.domain" :options="available" class="w-8"
                            style="height: inherit;" :disabled="!network.isAccessable" optionLabel="name">
                        </Dropdown>
                    </div>
                </div>
                <div>
                    <p class="m-0 mb-2 text-sm">Port</p>
                    <div class="flex w-full align-items-center gap-2" style="height: 40px;">
                        <InputText v-model="network.redirect.port" type="text" class="flex-auto" style="height: inherit;" :disabled="!network.isAccessable">
                        </InputText>
                        <Button label="Unused" class="p-button-sm bg-white-a15 hover:" style="height: inherit;"
                            :disabled="!network.isAccessable" @click="getUnusedPort();"></Button>
                    </div>
                </div>
            </div>
        </Fieldset>
        <Fieldset legend=".env" :toggleable="true" :collapsed="true">
            <p class="m-0 mb-4 text-sm">Set required environment variables for your <Tag value="node.js"
                    class="text-white bg-gray-900"></Tag> instance.</p>
            <Textarea class="w-full h-10rem bg-white-a05 border-none font-mono" autoResize="false"></Textarea>
        </Fieldset>
    </div>
</template>

<script>
import Fieldset from "primevue/fieldset";
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import InputSwitch from 'primevue/inputswitch';
import Dropdown from 'primevue/dropdown';
import { ref } from "vue";

export default {
    components: {
        Fieldset,
        InputText,
        Button,
        InputSwitch,
        Dropdown
    },
    data() {
        let available = [
            { name: "oocastor.dev" },
            { name: "schneider-jonas.dev" },
            { name: "songdle.app" },
        ]
        let network = ref({
            isAccessable: true,
            redirect: {
                sub: "test",
                domain: available[0],
                port: "1000"
            }
        })

        return {
            network,
            available
        }
    },
    methods: {
        getUnusedPort() {
            this.network.redirect.port = Math.round(Math.random() * 9000) + 1000;
        }
    }
}
</script>

<style lang="scss" scoped>
.bg-white-a05 {
    background-color: rgba(255, 255, 255, .05);
}

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