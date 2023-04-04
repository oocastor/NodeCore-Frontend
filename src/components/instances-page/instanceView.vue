<template>
    <div class="w-full flex flex-column p-2 gap-3">
        <div class="flex justify-content-between">
            <div class="flex align-items-center gap-3">
                <p class="text-3xl m-0 font-bold">{{ selectedInstance.name }}</p>
                <Chip label="running" icon="pi pi-check" class="text-xs bg-green-600" v-if="selectedInstance.status == 1"></Chip>
                <Chip label="stopped" icon="pi pi-times" class="text-xs bg-red-600" v-if="selectedInstance.status == 0"></Chip>
                <Chip label="updating" icon="pi pi-stopwatch" class="text-xs bg-orange-600" v-if="selectedInstance.status == 2"></Chip>
            </div>
            <div class="flex gap-3">
                <i class="pi pi-cog text-xl text-gray-400 cursor-pointer"
                    @click="openInstanceUpdateView(selectedInstance);"></i>
                <i v-if="false" class="pi pi-times text-xl text-gray-400 cursor-pointer"></i>
            </div>
        </div>
        <div class="flex gap-2 align-item-center" :style="{ 'opacity': selectedInstance.network.isAccessable ? 1 : 0 }">
            <i class="pi pi-link text-300"></i>
            <a class="no-underline text-gray-400 font-mono"
                :href="`https://${selectedInstance.network.redirect.sub}.${selectedInstance.network.redirect.domain}`">{{
                    selectedInstance.network.redirect.sub }}.{{ selectedInstance.network.redirect.domain }}</a>
        </div>
        <span class="p-buttonset w-full flex">
            <Button :loading="true" label="Restart" icon="pi pi-refresh"
                class="p-button-sm flex-auto bg-white-a15 text-white"></Button>
            <Button label="Stop" icon="pi pi-stop" class="p-button-sm flex-auto bg-white-a15 text-white"></Button>
            <Button label="Update" icon="pi pi-download" class="p-button-sm flex-auto bg-white-a15 text-white"></Button>
        </span>
        <p class="m-0 mt-2 text-sm font-mono">Stats</p>
        <div class="flex gap-2">
            <countItem str="RAM" :num="0" color="var(--white)"></countItem>
            <countItem str="CPU" :num="0" color="var(--white)"></countItem>
        </div>
        <p class="m-0 mt-2 text-sm font-mono">Logs</p>
        <Textarea class="w-full h-10rem bg-white-a05 border-none" autoResize="false" readonly></Textarea>
    </div>
</template>

<script>
import Button from "primevue/button";
import Textarea from "primevue/textarea";
import Chip from 'primevue/chip';

import countItem from "@/components/instances-page/countItem.vue";

export default {
    components: {
        countItem,
        Button,
        Textarea,
        Chip
    },
    props: {
        selectedInstance: Object,
        openInstanceUpdateView: Function
    }
}
</script>

<style lang="scss" scoped>
.bg-white-a15 {
    background-color: rgba(255, 255, 255, 0.15);
}

.bg-white-a05 {
    background-color: rgba(255, 255, 255, 0.05);
}</style>