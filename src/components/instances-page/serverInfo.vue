<template>
    <div class="flex-1 p-4 surface-card h-full border-round-md flex flex-column select-none relative overflow-hidden" style="isolation: isolate;">
        <Chart type="line" :data="chartData" :options="chartOptions" class="absolute w-full h-full top-0 left-0 opacity-40" style="z-index: -1;"/>
        <p class="m-0 mb-2 -mt-2 font-mono text-lg">{{ str }}</p>
        <div class="flex font align-items-baseline text-600 gap-2">
            <p class="md:text-5xl text-2xl m-0 font-bold text-color">{{ data[data.length - 1] }}</p>
            <p class="text-xl m-0 hidden md:block">/</p>
            <p class="text-xl m-0 hidden md:block">{{ max }}</p>
            <p class="m-0 text-sm">{{ op }}</p>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
import Chart from 'primevue/chart';

export default {
    name: "serverInfo",

    props: {
        data: Object,
        max: String,
        op: String,
        str: String
    },

    components: {
        Chart
    },

    watch: {
        data() {
            this.chartData.datasets[0].data = this.data.slice(-10);
        },
        max() {
            this.chartOptions.scales.y.max = this.max;
        }
    },

    data() {
        const documentStyle = getComputedStyle(document.documentElement);

        return {
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                },
                scales: {
                    x: {
                        display: false,
                    },
                    y: {
                        display: false,
                        min: 0,
                        max: this.max,
                    }
                },
                animation: {
                    duration: 0
                },
                tooltips: {
                    enabled: false
                }
            },
            chartData: {
                labels: new Array(10).fill(""),
                datasets: [{
                    data: this.data,
                    borderColor: documentStyle.getPropertyValue("--primary-color"),
                    backgroundColor: documentStyle.getPropertyValue("--primary-color"),
                    pointRadius: 0,
                    borderWidth: 5,
                    fill: true
                }]
            }
        }
    }
}
</script>