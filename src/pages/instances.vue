<template>
    <div class="flex flex-column h-full">
        <div class="w-full h-4rem surface-card flex justify-content-between align-items-center px-3">
            <div class="text-4xl font-grandHotel">nodeup</div>
            <Avatar class="bg-primary" label="Ca" @click="toggleAvatarMenu"></Avatar>
        </div>
        <Menu ref="menu" :model="items" :popup="true"></Menu>
        <div class="flex-auto flex w-full flex-column mx-auto" style="max-width: 900px;">
            <div class=" relativ justify-content-between my-3 mx-4 gap-3 flex fadein animation-duration-200">
                <div
                    class="w-6 p-4 surface-card h-full border-round-md flex flex-column justify-content-center align-items-center">
                    <div class="flex font align-items-baseline text-200 gap-2 mb-3">
                        <p class="md:text-5xl text-2xl m-0 font-bold text-color">4000</p>
                        <p class="text-xl m-0 hidden md:block">/</p>
                        <p class="text-xl m-0 hidden md:block">8000</p>
                        <p class="m-0">RAM</p>
                    </div>
                    <ProgressBar class="w-11 h-1rem border-round-md" value="50" :showValue="false"></ProgressBar>
                </div>
                <div
                    class="w-6 p-4 surface-card h-full border-round-md flex flex-column justify-content-center align-items-center">
                    <div class="flex font align-items-baseline text-200 gap-2 mb-3">
                        <p class="md:text-5xl text-2xl m-0 font-bold text-color">15</p>
                        <p class="text-xl m-0 hidden md:block">/</p>
                        <p class="text-xl m-0 hidden md:block">100</p>
                        <p class="m-0">CPU</p>
                    </div>
                    <ProgressBar class="w-11 h-1rem border-round-md w-12" value="15" :showValue="false"></ProgressBar>
                </div>
            </div>
            <div
                class="flex-auto relativ justify-content-between mb-3 mx-4 gap-3 flex flex-column md:flex-row fadein animation-duration-200">
                <div class="w-full md:w-4 surface-card md:h-full border-round-md relativ p-2">
                    <template v-for="i in 5" :key="i">
                        <div class="w-full h-5rem border-round-sm mb-2 p-3 bg-instance-item cursor-pointer flex align-items-center gap-3 select-none">
                            <Avatar icon="pi pi-server green-600" :style="{backgroundColor: Math.random() > 0.5 ? 'var(--primary-color)' : ''}"/>
                            <p class="flex-auto text-sm">Studienplan</p>
                            <Button icon="pi pi-angle-right" class="p-button-xs p-button-rounded surface-200 text-white"></Button>
                        </div>
                    </template>
                </div>
                <div class="w-full md:w-8 surface-card h-full border-round-md">

                </div>
            </div>
            <div class="w-full h-3rem flex justify-content-center align-items-center gap-1">
                <i class="pi pi-link text-300"></i> <a href="#" class="no-underline text-300">oocastor</a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "instances",

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
.bg-instance-item {
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