<template>
    <p class="m-0 mb-3 text-200">{{ $t('main-page.overview') }}</p>
    <div class="flex flex-column sm:flex-row gap-2">
        <div class="sm:w-6 w-full p-3 surface-card border-round flex flex-column">
            <p class="m-0 text-sm text-400">{{ $t('main-page.instances') }}</p>
            <div class="mt-3 flex gap-3 align-items-center justify-content-center flex-auto">
                <div class="flex gap-2 align-items-center justify-content-center flex-auto flex-wrap text-center">
                    <p class="m-0 text-5xl font-bold w-3rem">{{ instances.filter(f => f.status == 1).length }}</p>
                    <p class="m-0 text-green-400 label">{{ $t('main-page.running') }}</p>
                </div>
                <div class="divider"></div>
                <div class="flex gap-2 align-items-center justify-content-center flex-auto flex-wrap text-center">
                    <p class="m-0 text-5xl font-bold w-3rem">{{ instances.filter(f => f.status != 1).length }}</p>
                    <p class="m-0 text-red-400 label">{{ $t('main-page.stopped') }}</p>
                </div>
            </div>
        </div>
        <div class="sm:w-6 w-full p-3 surface-card border-round flex flex-column">
            <p class="m-0 text-sm text-400">{{ $t('main-page.redirects') }}</p>
            <div class="mt-3 flex gap-3 align-items-center justify-content-center flex-auto">
                <div class="flex gap-2 align-items-center justify-content-center flex-auto flex-wrap text-center">
                    <p class="m-0 text-5xl font-bold w-3rem">{{ redirects.filter(f => f.status == 1).length }}</p>
                    <p class="m-0 text-400 label">{{ $t('main-page.enabled') }}</p>
                </div>
                <div class="divider"></div>
                <div class="flex gap-2 align-items-center justify-content-center flex-auto flex-wrap text-center">
                    <p class="m-0 text-5xl font-bold w-3rem">{{ redirects.filter(f => f.status != 1).length }}</p>
                    <p class="m-0 text-400 label">{{ $t('main-page.disabled') }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
import { nextTick } from 'vue';

export default {
    props: {
        instances: Array,
        redirects: Array
    },
    mounted() {
        this.getLargestLabelWidth();
    },
    methods: {
        getLargestLabelWidth() {
            // even out the label widths
            let labels = [...document.querySelectorAll('.label')];
            labels.forEach(label => label.style.width = 'auto');
            let largestLabelWidth = Math.max(...labels.map(label => label.offsetWidth)) + 2;
            labels.forEach(label => label.style.width = `${largestLabelWidth}px`);
        }
    },
    watch: {
        "$i18n.locale"() {
            nextTick(() => {
                this.getLargestLabelWidth();
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.divider {
    width: 2px;
    height: 25px;
    background-color: var(--surface-200);
}

.label {
    max-width: 85px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
</style>