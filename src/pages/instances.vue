<template>
    <div class="flex flex-column h-full">
        <div class="w-full surface-card flex justify-content-between align-items-center px-3" style="min-height: 60px;">
            <div class="text-4xl font-grandHotel">nodeup</div>
            <Avatar class="bg-primary" label="Ca" @click="toggleAvatarMenu"></Avatar>
        </div>
        <Menu ref="menu" :model="items" :popup="true"></Menu>
        <div class="flex-auto flex w-full flex-column mx-auto" style="max-width: 900px;">
            <div class=" relativ justify-content-between my-3 mx-4 gap-3 flex fadein animation-duration-200">
                <serverInfo v-for="i in 2" :key="i" current="500" max="1000" str="RAM"></serverInfo>
            </div>
            <div
                class="flex-auto relativ md:justify-content-between mb-3 mx-4 gap-3 flex flex-column md:flex-row fadein animation-duration-200">
                <div class="w-full md:w-4 md:h-full surface-card p-2 border-round-md relativ">
                    <div class="w-full mt-2 mb-3 flex justify-content-between align-items-center">
                        <p class="m-0 ml-1 font-mono" style="font-size: 1rem;">Instances</p>
                        <Button icon="pi pi-plus" class="-m-1 -mt-2 bg-white-a15 text-color" style="transform: scale(0.7);"></Button>
                    </div>
                    <instanceItem v-for="i in 5" :key="i" name="Studienplan" :active="Math.random() > 0.5"></instanceItem>
                </div>
                <div class="w-full md:w-8 surface-card h-min border-round-md flex gap-2 p-2">
                    <!-- <countItem v-for="i in 3" :key="i" str="Running" :num="i" color="var(--green-400)"></countItem> -->
                    <instanceView></instanceView>
                </div>
            </div>
            <div class="w-full h-3rem flex justify-content-center align-items-center gap-1">
                <i class="pi pi-link text-300"></i> <a href="#" class="no-underline text-300">oocastor</a>
            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
import serverInfo from "@/components/instances-page/serverInfo.vue";
import instanceItem from "@/components/instances-page/instanceItem.vue";
import countItem from "@/components/instances-page/countItem.vue";
import instanceView from "@/components/instances-page/instanceView.vue";

export default {
    name: "instances",

    components: {
        serverInfo,
        instanceItem,
        countItem,
        instanceView
    },

    data() {
        let items = [
            {
                icon: 'pi pi-refresh',
                label: "Reload",
                command: () => console.log("1")
            },
            {
                icon: 'pi pi-times',
                label: "Close",
                command: () => console.log("2")
            },
        ];

        return {
            items
        }
    },
    methods: {
        toggleAvatarMenu(e) {
            this.$refs.menu.toggle(e);
        }
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