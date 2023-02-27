<template>
    <div class="flex-1 surface-section h-7rem border-round-md flex flex-column align-items-center justify-content-center select-none">
        <p class="text-5xl m-0 font-bold" :style="{color}">{{ num }}</p>
        <p class="text-md m-0 mt-2 text-white">{{ str }}</p>
    </div>
</template>

<script>
export default {
    props: {
        num: String,
        str: String,
        color: String
    }
}
</script>

<style lang="scss" scoped>
</style>