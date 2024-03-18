<template>
    <div
        class="flex-1 surface-section py-3 border-round-md flex flex-column align-items-center justify-content-center select-none">
        <p class="text-5xl m-0 font-bold" :style="passStyleToNum">{{ num }}</p>
        <div class="h-3rem md:h-2rem flex align-items-center">
            <p class="text-sm m-0 mt-2 text-gray-400 px-3 text-center">{{ str }}</p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        num: Number,
        str: String,
        passStyleToNum: String
    }
}
</script>

<style lang="scss" scoped></style>