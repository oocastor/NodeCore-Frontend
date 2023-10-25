<template>
    <Dialog v-model:visible="trackingPanel" modal :draggable="false" :header="$t('main-page.tracking-comp.tracking')"
        style="max-width: 1000px; width: 100%;" class="relative">
        <DataTable :value="trackingData" v-if="trackingData.length" v-model:filters="filters" filterDisplay="menu"
            :globalFilterFields="['ip', 'target', 'timestap']" breakpoint="0px">
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
            <Column field="date" header="Date" dataType="date" filterField="date" sortable>
                <template #body="slotProps">
                    {{ formatDate(slotProps.data.date) }}
                </template>
                <template #filter="{ filterModel }">
                    <Calendar v-model="filterModel.value" dateFormat="dd.mm.yy" placeholder="dd.mm.yyyy"
                        mask="99.99.9999" />
                </template>
            </Column>
            <Column field="time" header="Time" sortable>
            </Column>
            <Column field="authorized" header="Status" sortable>
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
            trackingPanel: false,
            trackingData: [],
            filters: {
                ip: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
                target: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
                date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
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
                    this.trackingData = data.payload.map(m => {
                        m.date = new Date(m.timestamp);
                        m.time = new Date(m.timestamp).toLocaleTimeString("de-DE");
                        return m;
                    });
                    console.log(data.payload)
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
    .p-calendar > .p-inputtext {
        padding: 8px 4px !important;
    }
}
</style>