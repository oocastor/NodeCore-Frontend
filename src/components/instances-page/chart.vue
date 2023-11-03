<template>
    <p class="text-200">Analytics</p>
    <div class="surface-card border-round p-3">
        <p class="text-sm m-0 text-400 mb-4 text-center">This graph shows the traffic on your defined redirects.</p>
        <Chart type="line" :data="chartData" :options="chartOptions" class="h-25rem" />
    </div>
</template>

<script>
/* eslint-disable */

import Chart from 'primevue/chart';

export default {
    data() {
        return {
            chartData: null,
            chartOptions: null
        };
    },
    components: {
        Chart
    },
    created() {
        this.chartOptions = this.setChartOptions();
        this.getTrackingData();
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
                datasets: trackingData.map(td => {
                    let data = new Array(7).fill({}).map((m, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() - i);

                        return td.connectionsPerDay.find(cpd => cpd.date == date.toLocaleDateString("DE-de", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit"
                        }))?.count || 0;
                    }).reverse();

                    let color = `rgb(${Math.floor(Math.random() * 155 + 100)}, ${Math.floor(Math.random() * 155 + 100)}, ${Math.floor(Math.random() * 155 + 100)})`;

                    return {
                        label: td.target,
                        data,
                        fill: false,
                        borderColor: color,
                        backgroundColor: color,
                        tension: .3
                    };
                })
            };
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
                    }
                }
            };
        },
        getTrackingData() {
            this.$STORAGE.socket.emit('tracking:data:last7days', (data) => {
                this.chartData = this.setChartData(data.payload);
            });
        }
    }
};
</script>