<template>
    <p class="text-200">Analytics</p>
    <div class="surface-card border-round-md p-3 pt-2" v-if="expanded">
        <div class="flex justify-content-between align-items-center mb-2">
            <p class="text-sm text-400 pr-2">This graph shows the traffic on your defined redirects.
            </p>
            <Button class="p-button-sm p-button-text" icon="pi pi-times" @click="expanded = !expanded" v-if="toggleVisibility"></Button>
        </div>
        <Chart type="line" :data="chartData" :options="chartOptions" class="h-25rem" />
    </div>
    <div class="surface-card border-round-md px-3 py-2 flex justify-content-between align-items-center" v-if="!expanded">
        <p class="text-sm text-400">Show analytics graph</p>
        <Button class="p-button-sm p-button-text" icon="pi pi-angle-down" @click="expanded = !expanded"></Button>
    </div>
</template>

<script>
/* eslint-disable */

import Button from 'primevue/button';
import Chart from 'primevue/chart';

export default {
    data() {
        return {
            expanded: true,
            prevData: null,
            chartData: null,
            chartOptions: null,
            //predifined colors for the chart
            colors: [
                "#007acc",
                "#ff5722",
                "#6a1b9a",
                "#4caf50",
                "#ff9800",
                "#1976d2",
                "#e91e63",
                "#3f51b5",
                "#f44336",
                "#ffeb3b",
                "#0288d1",
                "#d32f2f",
                "#689f38",
                "#ffc107",
                "#03a9f4",
                "#9c27b0",
                "#8bc34a",
                "#ff5722",
                "#2196f3",
                "#673ab7"
            ]
        };
    },
    components: {
        Chart,
        Button
    },
    props: {
        toggleVisibility: {
            type: Boolean,
            default: false
        },
    },
    created() {
        this.chartOptions = this.setChartOptions();
        this.getTrackingData();
        this.$EVENT.on("update", this.getTrackingData);
        if(this.toggleVisibility) {
            this.expanded = false;
        }
    },
    methods: {
        setChartData(trackingData) {
            //get date of last 7 days
            const last7Days = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                last7Days.push(date.toLocaleDateString());
            }

            return {
                labels: last7Days,
                datasets: trackingData.map((td, n) => {
                    let data = new Array(7).fill({}).map((m, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() - i);

                        return td.connectionsPerDay.find(cpd => cpd.date == date.toLocaleDateString("DE-de", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit"
                        }))?.count || 0;
                    }).reverse();

                    return {
                        label: td.target,
                        data,
                        fill: false,
                        borderColor: this.colors[n] || this.getRandomColor(),
                        backgroundColor: this.colors[n] || this.getRandomColor(),
                        tension: .3
                    };
                })
            };
        },
        getRandomColor() {
            return `rgb(${Math.floor(Math.random() * 155 + 100)}, ${Math.floor(Math.random() * 155 + 100)}, ${Math.floor(Math.random() * 155 + 100)})`;
        },
        setChartOptions() {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
            const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

            return {
                maintainAspectRatio: false,
                aspectRatio: 0.6,
                plugins: {
                    legend: {
                        labels: {
                            color: textColor,
                            padding: 20
                        },
                        position: 'bottom',
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder
                        },
                        title: {
                            display: true,
                            text: "Date",
                        }
                    },
                    y: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder
                        },
                        title: {
                            display: true,
                            text: "Requests",
                        },
                        ticks: {
                            stepSize: 1,
                        },
                        suggestedMax: 20,
                        suggestedMin: 0
                    }
                }
            };
        },
        getTrackingData() {
            this.$STORAGE.socket.emit('tracking:data:last7days', (data) => {
                let trackingData = data.payload;
                if (this.prevData == null || JSON.stringify(this.prevData) != JSON.stringify(trackingData)) {
                    this.prevData = trackingData;
                    this.chartData = this.setChartData(trackingData);
                }
            });
        }
    }
};
</script>