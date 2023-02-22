<template>
    <div
        class="w-full h-5rem border-round-sm mb-2 p-3 bg-list-item cursor-pointer flex align-items-center gap-3 select-none">
        <Avatar icon="pi pi-server green-600"
            :style="{ backgroundColor: active ? 'var(--primary-color)' : '' }" />
        <p class="flex-auto text-sm">{{ name }}</p>
        <Button icon="pi pi-angle-right" class="p-button-xs p-button-rounded surface-200 text-white"></Button>
    </div>
</template>

<script>
export default {
    props: {
        name: String,
        active: Boolean,
    }
}
</script>