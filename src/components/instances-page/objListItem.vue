<template>
    <div
        class="w-full h-4rem border-round-sm mb-2 p-3 bg-instance-item cursor-pointer flex align-items-center gap-3 select-none">
        <Avatar :icon="icon" :style="{ backgroundColor: getColorByStatus(status) }" class="flex-none" />
        <p class="flex-auto text-sm name">{{ name }}</p>
        <Button icon="pi pi-angle-right" class="p-button-xs p-button-rounded surface-100 text-white flex-none"></Button>
    </div>
</template>

<script>
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';

export default {
    props: {
        name: String,
        status: Number,
        icon: String
    },
    components: {
        Button,
        Avatar
    },
    methods: {
        getColorByStatus(status) {
            switch (status) {
                case 0:
                    return "var(--red-600)"

                case 1:
                    return "var(--green-600)"

                case 2:
                    return "var(--orange-600)"

                case 3:
                    return "var(--blue-600)"

                default:
                    return ""
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.bg-instance-item {
    background-color: var(--surface-section);
    transition: all 100ms;

    &:hover {
        transform: scale(1.025);
    }
}

.p-button-xs {
    transform: scale(0.67) !important;
}
</style>