<template>
    <div class="w-full flex flex-column p-2 gap-3">
        <div class="flex justify-content-between">
            <p class="text-3xl m-0 font-bold">Studienplan</p>
            <div class="flex gap-3">
                <i class="pi pi-cog text-xl text-gray-400 cursor-pointer"></i>
                <i v-if="true" class="pi pi-times text-xl text-gray-400 cursor-pointer"></i>
            </div>
        </div>
        <div class="flex gap-2 align-item-center">
            <i class="pi pi-link text-300"></i>
            <a class="no-underline text-gray-400 font-mono" href="https://plan.oocastor.dev">plan.oocastor.dev</a>
        </div>
        <span class="p-buttonset w-full flex">
            <Button :loading="true" label="Restart" icon="pi pi-refresh"
                class="p-button-sm flex-auto bg-white-a15 text-white"></Button>
            <Button label="Stop" icon="pi pi-stop" class="p-button-sm flex-auto bg-white-a15 text-white"></Button>
            <Button label="Update" icon="pi pi-download" class="p-button-sm flex-auto bg-white-a15 text-white"></Button>
        </span>
        <p class="m-0 mt-2 text-sm font-mono">Stats</p>
        <div class="flex gap-2">
            <countItem str="RAM" num="128" color="var(--white)"></countItem>
            <countItem str="CPU" num="1" color="var(--white)"></countItem>
        </div>
        <p class="m-0 mt-2 text-sm font-mono">Logs</p>
        <Textarea class="w-full h-10rem bg-white-a05 border-none" autoResize="false" readonly></Textarea>
    </div>
</template>

<script>
import Button from "primevue/button";
import Textarea from "primevue/textarea";

import countItem from "@/components/instances-page/countItem.vue";

export default {
    components: {
        countItem,
        Button,
        Textarea
    }
}
</script>

<style lang="scss" scoped>
.bg-white-a15 {
    background-color: rgba(255, 255, 255, 0.15);
}

.bg-white-a05 {
    background-color: rgba(255, 255, 255, 0.05);
}
</style>