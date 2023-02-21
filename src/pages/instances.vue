<template>
    <div class="w-full h-4rem surface-card flex justify-content-between align-items-center px-3">
        <div class="text-4xl font-grandHotel">nodeup</div>
        <Avatar class="bg-primary" label="Ca" @click="toggleAvatarMenu"></Avatar>
    </div>
    <Menu ref="menu" :model="items" :popup="true"></Menu>
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