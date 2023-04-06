<template>
    <Dialog v-model:visible="settingsDialog" modal :draggable="false" header="Settings"
        style="max-width: 600px; width: 100%;">
        <Fieldset legend="Domains">
            <div class="flex justify-content-between align-items-center -mt-1 mb-4">
                <p class="">Add domains which directs to the server.</p>
                <Button icon="pi pi-plus" label="Add" class="p-button-sm"
                    @click="$refs.addDomOvPa.toggle($event);"></Button>
            </div>
            <div class="w-full flex flex-column justify-content-center gap-2">
                <template v-for="ad in availableDomains" :key="ad">
                    <div class="border-round-sm surface-section flex justify-content-between align-items-center">
                        <p class="m-0 mb-1 ml-3 font-mono select-none">{{ ad }}</p>
                        <Button icon="pi pi-times" class="surface-200 text-white border-none" @click="deleteDomain(ad)"></Button>
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
            settingsDialog: false,
            availableDomains: [],
            newDomainInput: ""
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
            this.$STORAGE.socket.emit("domain:add", {domain: this.newDomainInput}, (data) => {
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
            this.$STORAGE.socket.emit("domain:delete", {domain}, (data) => {
                let { error, msg } = data;
                if (error) {
                    this.$EVENT.emit("showToast", { severity: "error", title: "Error", msg });
                } else {
                    this.$EVENT.emit("showToast", { severity: "success", title: "Done", msg });
                }
                this.fetchAvailableDomains();
            });
        },
        toggleSettingsDialog(b = undefined) {
            if(b) this.settingsDialog = b
            else this.settingsDialog = !this.settingsDialog;
        }
    },
    created() {
        this.fetchAvailableDomains();
    }
}
</script>