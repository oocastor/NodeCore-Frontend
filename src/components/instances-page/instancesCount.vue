<template>
    <div class="flex-auto bg-count-item h-7rem border-round-md flex flex-column align-items-center justify-content-center">
        <p class="md:text-5xl text-2xl m-0 font-bold" :style="{color}">{{ num }}</p>
        <p class="text-md m-0 mt-2 text-200 select-none">{{ str }}</p>
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
.bg-count-item {
    background-color: rgba(255, 255, 255, 0.05);
}
</style>