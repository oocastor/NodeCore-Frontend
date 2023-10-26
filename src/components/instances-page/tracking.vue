<template>
    <Dialog v-model:visible="trackingPanel" modal :draggable="false" :header="$t('main-page.tracking-comp.tracking')"
        style="max-width: 1000px; width: 100%;" class="relative">
        <div class="p-1 mb-2 flex align-items-center">
            <span class="p-input-icon-left w-5">
                <i class="pi pi-search"></i>
                <InputText v-model="filter.text" placeholder="Search" class="w-full" />
            </span>
            <div class="ml-auto flex flex-column gap-2">
                <div class="p-inputgroup">
                    <Button icon="pi pi-arrow-up" @click="sort.ascending = true" :class="`p-button-text surface-border border-left-none ${!sort.ascending ? 'surface-section' : 'text-white bg-primary-900'}`"></Button>
                    <Button icon="pi pi-arrow-down" @click="sort.ascending = false" :class="`p-button-text surface-border border-left-none ${sort.ascending ? 'surface-section' : 'text-white bg-primary-900'}`"></Button>
                </div>
            </div>
            <div style="height: 30px; width: 1px; background-color: var(--surface-200); margin: 0 10px;"></div>
            <div class=" flex flex-column gap-2">
                <div class="p-inputgroup">
                    <Button :icon="`pi ${filter.authorized == 2 ? 'pi-lock-open' : filter.authorized == 1 ? 'pi-lock' : 'pi-lock'}`" @click="filter.authorized = filter.authorized == 2 ? 0 : filter.authorized += 1" :class="`p-button-text surface-border border-left-none ${filter.authorized == 0 ? 'surface-section' : 'text-white bg-primary-900'}`"></Button>
                </div>
            </div>
        </div>
        <DataTable :value="trackingData" :totalRecords="totalRecords" breakpoint="0px" lazy @page="onPage($event)" paginator
            :rows="20" :loading="loading" :globalFilterFields="['ip']" class="px-2">
            <Column field="ip" header="IP">
                <template #body="{ data }">
                    {{ data.ip }}
                </template>
            </Column>
            <Column field="target" header="Target">
                <template #body="{ data }">
                    {{ data.target }}
                </template>
            </Column>
            <Column field="date" header="Date">
                <template #body="slotProps">
                    {{ formatDate(slotProps.data.date) }}
                </template>
            </Column>
            <Column field="time" header="Time">
            </Column>
            <Column field="authorized" header="Status">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.authorized ? 'Authorized' : 'Unauthorized'"
                        :severity="slotProps.data.authorized ? 'success' : 'danger'" />
                </template>
            </Column>
            <template #empty>
                <p class="text-400 font-bold text-center">No tracking data found.</p>
            </template>
        </DataTable>
    </Dialog>
</template>

<script>
/* eslint-disable */

import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

export default {
    data() {
        return {
            trackingPanel: false,
            trackingData: [],
            totalRecords: 0,
            loading: false,
            filter: {
                text: "",
                authorized: 0
            },
            sort: {
                ascending: false,
            },
            page: 0
        }
    },
    watch: {
        sort: {
            deep: true,
            handler() {
                this.getData();
            }
        },
        filter: {
            deep: true,
            handler() {
                this.getData();
            }
        }
    },
    components: {
        Dialog,
        DataTable,
        Column,
        Tag,
        InputText,
        Button
    },
    methods: {
        onPage(e) {
            this.page = e.page;
            this.getData();
        },
        getData() {
            this.loading = true;
            this.$STORAGE.socket.emit(
                "tracking:data",
                { filter: this.filter, page: this.page, sort: this.sort },
                (data) => {
                    this.trackingData = data.payload.trackingData.map(m => {
                        m.date = new Date(m.timestamp);
                        m.time = new Date(m.timestamp).toLocaleTimeString("de-DE");
                        return m;
                    });
                    this.totalRecords = data.payload.totalRecords;
                    this.loading = false;
                }
            );
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString("de-DE", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            });
        },
        toggleTrackingDialog() {
            this.trackingPanel = !this.trackingPanel;
            this.getData();
        }
    },
    created() {
        this.getData();
    }
}
</script>

<style lang="scss">
.p-column-filter-overlay {
    .p-dropdown {
        padding: 8px 4px !important;
    }

    .p-calendar>.p-inputtext {
        padding: 8px 4px !important;
    }
}
</style>