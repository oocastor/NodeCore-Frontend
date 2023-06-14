<template>
    <p class="m-0 mb-3 text-200">{{ $t('main-page.overview') }}</p>
    <div class="p-3 surface-card border-round">
        <div class="flex gap-2">
            <div class="flex flex-column flex-auto">
                <p class="m-0 text-xs mb-3">{{ $t('main-page.instances') }}</p>
                <div class="flex gap-2">
                    <countItem :str="$t('main-page.running')" :num="instances.filter(f => f.status == 1).length" color="var(--green-400)"></countItem>
                    <countItem :str="$t('main-page.stopped')" :num="instances.filter(f => f.status != 1).length" color="var(--red-400)"></countItem>
                </div>
            </div>
            <div class="flex flex-column flex-auto">
                <p class="m-0 text-xs mb-3">{{ $t('main-page.redirects') }}</p>
                <div class="flex gap-2">
                    <countItem :str="$t('main-page.enabled')" :num="redirects.filter(f => f.status == 1).length" color="var(--surface-400)"></countItem>
                    <countItem :str="$t('main-page.disabled')" :num="redirects.filter(f => f.status != 1).length" color="var(--surface-400)"></countItem>
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