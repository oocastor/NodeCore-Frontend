<template>
    <div class="flex flex-column h-full">
        <div class="w-full h-4rem surface-card flex justify-content-between align-items-center px-3">
            <div class="text-4xl font-grandHotel">nodeup</div>
            <Avatar class="bg-primary" label="Ca" @click="toggleAvatarMenu"></Avatar>
        </div>
        <Menu ref="menu" :model="items" :popup="true"></Menu>
        <div class="flex-auto flex w-full flex-column mx-auto" style="max-width: 900px;">
            <div class=" relativ justify-content-between my-3 mx-4 gap-3 flex fadein animation-duration-200">
                <serverInfo v-for="i in 2" :key="i" current="500" max="1000" str="RAM"></serverInfo>
            </div>
            <div
                class="flex-auto relativ justify-content-between mb-3 mx-4 gap-3 flex flex-column md:flex-row fadein animation-duration-200">
                <div class="w-full md:w-4 surface-card md:h-full border-round-md relativ p-2">
                    <instanceItem v-for="i in 5" :key="i" name="Studienplan" :active="Math.random() > 0.5"></instanceItem>
                </div>
                <div class="w-full md:w-8 surface-card h-min border-round-md flex gap-2 p-2">
                    <instancesCount v-for="i in 3" :key="i" str="Running" :num="i" color="var(--green-400)"></instancesCount>
                </div>
            </div>
            <div class="w-full h-3rem flex justify-content-center align-items-center gap-1">
                <i class="pi pi-link text-300"></i> <a href="#" class="no-underline text-300">oocastor</a>
            </div>
        </div>
    </div>
</template>

<script>
import serverInfo from "@/components/instances-page/serverInfo.vue";
import instanceItem from "@/components/instances-page/instanceItem.vue";
import instancesCount from "@/components/instances-page/instancesCount.vue";

export default {
    name: "instances",

    components: {
        serverInfo,
        instanceItem,
        instancesCount
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
.bg-list-item {
    background-color: rgba(255, 255, 255, 0.05);
    transition: all 100ms;

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        transform: scale(1.025);
    }
}

.p-button-xs {
    transform: scale(0.75) !important;
}
</style>