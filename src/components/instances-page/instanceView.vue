<template>
    <div v-if="selectedInstance">
        <p class="m-0 text-200 mb-3 text-overflow">{{ $t('main-page.instances-comp.instance') }} ({{ selectedInstance.name
        }})</p>
        <div class="w-full flex flex-column gap-3 surface-card border-round p-3">
            <div class="flex justify-content-between">
                <div class="status_indicator" :style="{ '--ind-color': statusColor }">
                    <div class="dot"></div>
                    <p>{{ statusLabel }}</p>
                </div>
                <div class="flex gap-3">
                    <i class="pi pi-cog text-xl text-gray-400 cursor-pointer"
                        @click="openInstanceUpdateView(selectedInstance);"></i>
                    <i class="pi pi-times text-xl text-gray-400 cursor-pointer"
                        @click=" this.$EVENT.emit('changeView', 0);"></i>
                </div>
            </div>
            <div class="flex justify-content-between align-items-center">
                <p class="text-3xl m-0 font-bold text-overflow w-9">{{ selectedInstance.name }}</p>
                    <p class="text-sm m-0 text-gray-400 font-mono">{{ $t('main-page.instances-comp.version') }} {{
                    selectedInstance.version }}</p>
            </div>
            <div class="flex align-item-center">
                <Chip label="Production" class="text-xs bg-grey-600"></Chip>
                <!-- <div class="flex gap-2 align-item-center" v-if="selectedInstance.network.isAccessable">
                    <i class="pi pi-link text-300"></i>
                    <a class="no-underline text-gray-400 font-mono"
                        :href="`https://${selectedInstance.network.redirect.sub}.${selectedInstance.network.redirect.domain}`"
                        v-if="selectedInstance.network.redirect.sub != '@'">{{
                            selectedInstance.network.redirect.sub }}.{{ selectedInstance.network.redirect.domain }}</a>
                    <a class="no-underline text-gray-400 font-mono"
                        :href="`https://${selectedInstance.network.redirect.domain}`" v-else>{{
                            selectedInstance.network.redirect.domain }}</a>
                </div> -->
            </div>
            <span class="p-buttonset w-full flex">
                <Button :loading="selectedInstance.status == 2"
                    :label="selectedInstance.status == 0 ? $t('main-page.instances-comp.start') : $t('main-page.instances-comp.restart')"
                    icon="pi pi-refresh" class="p-button-sm flex-auto bg-white-a15 text-white"
                    @click=" startAction(this.selectedInstance.status == 1 ? 2 : 1);"></Button>
                <Button :label="$t('main-page.instances-comp.stop')" icon="pi pi-stop"
                    class="p-button-sm flex-auto bg-white-a15 text-white" @click=" startAction(0);"></Button>
                <Button :label="$t('main-page.instances-comp.update')" icon="pi pi-download"
                    class="p-button-sm flex-auto bg-white-a15 text-white" @click=" startAction(3);"></Button>
            </span>
            <p class="m-0 mt-2 text-sm font-mono">{{ $t('main-page.instances-comp.stats') }}</p>
            <div class="flex gap-2">
                <countItem :str="$t('main-page.ram')" :num="selectedInstance.pm2?.monit.memory || 0" color="var(--white)">
                </countItem>
                <countItem :str="$t('main-page.cpu')" :num="selectedInstance.pm2?.monit.cpu || 0" color="var(--white)">
                </countItem>
            </div>
            <p class="m-0 mt-2 text-sm font-mono">{{ $t('main-page.instances-comp.logs') }}</p>
            <Textarea class="w-full h-10rem bg-white-a05 border-none overflow-y-scroll font-mono" autoResize="false"
                readonly :value="selectedInstance.pm2?.log || ''"></Textarea>
        </div>
    </div>
</template>

<script>
/* eslint-disable */

import Button from "primevue/button";
import Textarea from "primevue/textarea";
import Chip from 'primevue/chip';

import countItem from "@/components/instances-page/countItem.vue";

export default {
    data() {
        return {
            selectedInstance: null
        }
    },
    components: {
        countItem,
        Button,
        Textarea,
        Chip
    },
    props: {
        selectedInstanceId: String,
        openInstanceUpdateView: Function
    },
    computed: {
        statusColor() {
            const documentStyle = getComputedStyle(document.documentElement);
            let i = this.selectedInstance.status;
            let color = i == 1 ? "--green-600" :
                i == -1 ? "--red-600" :
                    i == 0 ? "--red-600" :
                        i == 2 ? "--orange-600" :
                            i == 3 ? "--blue-600" : "--red-600";
            return documentStyle.getPropertyValue(color);
        },
        statusLabel() {
            let i = this.selectedInstance.status;
            return this.$t(i == 1 ? 'main-page.instances-comp.running' :
                i == -1 ? 'main-page.instances-comp.error' :
                    i == 0 ? 'main-page.instances-comp.stopped' :
                        i == 2 ? 'main-page.instances-comp.restarting' :
                            i == 3 ? 'main-page.instances-comp.updating' : 'main-page.instances-comp.error')
        }
    },
    methods: {
        startAction(i) {
            this.$STORAGE.socket.emit("instance:action", { _id: this.selectedInstance._id, status: i }, (data) => {
                let { error, msg } = data;
                if (error) {
                    this.$EVENT.emit("showToast", { severity: "error", title: "Error", msg });
                } else {
                    this.$EVENT.emit("showToast", { severity: "success", title: "Done", msg });
                }
                this.$EVENT.emit("update");
            });
        },
        update() {
            this.$STORAGE.socket.emit("instance:get", { _id: this.selectedInstanceId }, (data) => {
                let { error, payload } = data;
                if (!error) this.selectedInstance = payload;
            })
        }
    },
    created() {
        this.$EVENT.on("update", this.update);
    },
    unmounted() {
        this.$EVENT.off("update", this.update);
    },
}
</script>

<style lang="scss" scoped>
.bg-white-a15 {
    background-color: rgba(255, 255, 255, 0.15) !important;
}

.bg-white-a05 {
    background-color: rgba(255, 255, 255, 0.05) !important;
}

.status_indicator {
    --ind-size: 10px;
    --ind-color: rgb(253, 65, 55);

    display: flex;
    align-items: center;
    gap: 10px;

    .dot {
        padding: var(--ind-size);
        border-radius: 50%;
        background-color: var(--ind-color);

        position: relative;

        &::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            padding: var(--ind-size);
            border-radius: 50%;
            background-color: var(--ind-color);
            opacity: 0.5;
            animation: pulse 2s infinite;
        }
    }

    p {
        font-size: 0.8rem;
        margin: 0 0 2px 0;
        color: var(--ind-color);
        text-transform: uppercase;
    }
}

@keyframes pulse {
    0% {
        transform: scale(1);
    }

    100% {
        transform: scale(2.5);
        opacity: 0;
    }
}
</style>