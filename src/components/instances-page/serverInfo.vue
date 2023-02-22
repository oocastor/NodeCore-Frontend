<template>
    <div
        class="flex-auto p-4 surface-card h-full border-round-md flex flex-column justify-content-center align-items-center">
        <div class="flex font align-items-baseline text-200 gap-2 mb-3">
            <p class="md:text-5xl text-2xl m-0 font-bold text-color">{{ current }}</p>
            <p class="text-xl m-0 hidden md:block">/</p>
            <p class="text-xl m-0 hidden md:block">{{ max }}</p>
            <p class="m-0">{{ str }}</p>
        </div>
        <ProgressBar class="w-11 h-1rem border-round-md" :value="current/max*100" :showValue="false"></ProgressBar>
    </div>
</template>

<script>
export default {
    name: "serverInfo",

    props: {
        current: String,
        max: String,
        str: String
    }
}
</script>