<template>
    <p class="m-0 mb-3 text-200">Overview</p>
    <div class="p-3 surface-card border-round">
        <div class="flex gap-2">
            <div class="flex flex-column flex-auto">
                <p class="m-0 text-xs mb-3">Instances</p>
                <div class="flex gap-2">
                    <countItem str="Running" :num="instances.filter(f => f.status == 1).length" color="var(--green-400)"></countItem>
                    <countItem str="Stopped" :num="instances.filter(f => f.status != 1).length" color="var(--red-400)"></countItem>
                </div>
            </div>
            <div class="flex flex-column flex-auto">
                <p class="m-0 text-xs mb-3">Redirects</p>
                <div class="flex gap-2">
                    <countItem str="Enabled" :num="redirects.filter(f => f.status == 1).length" color="var(--surface-400)"></countItem>
                    <countItem str="Disabled" :num="redirects.filter(f => f.status != 1).length" color="var(--surface-400)"></countItem>
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
    },
    props: {
        instances: Array,
        redirects: Array
    }
}
</script>