<template>
    <Dialog v-model:visible="trackingPanel" modal :draggable="false" :header="$t('main-page.tracking-comp.tracking')"
        style="max-width: 1000px; width: 100%;" class="relative">
        <DataTable :value="trackingData" v-if="trackingData.length" v-model:filters="filters" filterDisplay="menu"
            :globalFilterFields="['ip', 'target', 'timestap']">
            <Column field="ip" header="IP">
                <template #body="{ data }">
                    {{ data.ip }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" class="p-column-filter"
                        placeholder="Search by name" />
                </template>
            </Column>
            <Column field="target" header="Target">
                <template #body="{ data }">
                    {{ data.target }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" class="p-column-filter"
                        placeholder="Search by name" />
                </template>
            </Column>
            <Column field="timestamp" header="Date">
                <template #body="slotProps">
                    {{ timestapToDate(slotProps.data.timestamp) }}
                </template>
                <template #filter="{ filterModel }">
                    <Calendar v-model="filterModel.value" dateFormat="mm.dd.yy" placeholder="mm.dd.yyyy"
                        mask="99.99.9999" />
                </template>
            </Column>
            <Column field="authorized" header="Status">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.authorized ? 'Authorized' : 'Unauthorized'"
                        :severity="slotProps.data.authorized ? 'success' : 'danger'" />
                </template>
            </Column>
        </DataTable>
    </Dialog>
</template>

<script>
/* eslint-disable */

import { FilterMatchMode, FilterOperator } from 'primevue/api';
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';

export default {
    data() {
        return {
            trackingPanel: true,
            trackingData: [],
            filters: {
                ip: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
                timestap: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            }
        }
    },
    components: {
        Dialog,
        DataTable,
        Column,
        Tag,
        InputText,
        Calendar
    },
    methods: {
        getData() {
            this.$STORAGE.socket.emit(
                "tracking:data",
                (data) => {
                    this.trackingData = data.payload;
                    console.log(data.payload)
                }
            );
        },
        timestapToDate(timestamp) {
            return new Date(timestamp).toLocaleString();
        }
    },
    created() {
        this.getData();
    }
}
</script>

<style>
.p-dropdown {
    padding: 8px 2px !important;
}
</style>