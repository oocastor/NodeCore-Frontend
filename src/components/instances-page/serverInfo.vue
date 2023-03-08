<template>
    <div
        class="flex-1 p-4 surface-card h-full border-round-md flex flex-column select-none">
        <p class="m-0 mb-2 -mt-2 font-mono text-lg">{{ str }}</p>
        <div class="flex font align-items-baseline text-200 gap-2 mb-3">
            <p class="md:text-5xl text-2xl m-0 font-bold text-color">{{ current }}</p>
            <p class="text-xl m-0 hidden md:block">/</p>
            <p class="text-xl m-0 hidden md:block">{{ max }}</p>
            <p class="m-0 text-sm">{{ op }}</p>
        </div>
        <ProgressBar class="w-full h-1rem border-round-md" :value="current/max*100" :showValue="false"></ProgressBar>
    </div>
</template>

<script>
import ProgressBar from 'primevue/progressbar';

export default {
    name: "serverInfo",

    props: {
        current: String,
        max: String,
        op: String,
        str: String
    },

    components: {
        ProgressBar
    }
}
</script>