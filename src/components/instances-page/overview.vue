<template>
    <div class="px-1 py-2">
        <p class="m-0 mb-3 font-mono" style="font-size: 1rem;">Overview</p>
        <div class="flex gap-2">
            <div class="flex flex-column flex-auto">
                <p class="m-0 font-mono text-xs mb-2">Instances</p>
                <div class="flex gap-2">
                    <countItem str="Running" num="2" color="var(--green-400)"></countItem>
                    <countItem str="Stopped" num="8" color="var(--red-400)"></countItem>
                </div>
            </div>
            <div class="flex flex-column flex-auto">
                <p class="m-0 font-mono text-xs mb-2">Redirects</p>
                <div class="flex gap-2">
                    <countItem str="Enabled" num="4" color="var(--surface-400)"></countItem>
                    <countItem str="Disabled" num="0" color="var(--surface-400)"></countItem>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import countItem from "@/components/instances-page/countItem.vue";

export default {
    components: {
        countItem
    }
}
</script>