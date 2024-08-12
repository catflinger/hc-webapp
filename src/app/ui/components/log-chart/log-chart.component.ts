import { Component, Input, OnInit, AfterViewInit, OnChanges, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Chart, ChartConfiguration } from "chart.js";

import { ILogExtract, ISensorConfig } from 'src/common/interfaces';
import { LogChartDataAdapter } from './log-chart-data-adapter';

@Component({
    selector: 'app-log-chart',
    templateUrl: './log-chart.component.html',
    styleUrls: ['./log-chart.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogChartComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    private chartConfig: ChartConfiguration;
    private adapter: LogChartDataAdapter;
    private chart: Chart;

    @Input()
    logExtract: ILogExtract;

    // @Input()
    // dateFilter: Date;

    @Input()
    sensorFilter: ISensorConfig[];

    constructor(private changeRef: ChangeDetectorRef) {
        this.adapter = new LogChartDataAdapter();
    }

    ngOnInit() {
        this.chartConfig = this.initialConfig;

        const d = this.logExtract.dayOfYear;
        this.chartConfig.options.title.text = `Logs for ${d.year}/${d.month}/${d.day}`;
    }

    ngAfterViewInit() {
        this.drawChart();
    }

    ngOnChanges() {
        if (this.chartConfig) {
            if (this.chart) {
                this.updateChart();
            } else {
                this.drawChart();
            }
        }
    }

    ngOnDestroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = undefined;
        }
    }

    private drawChart(): void {
        if (this.logExtract) {
            this.chartConfig.data = this.adapter.toChartData(this.logExtract, this.sensorFilter);

            const ctx: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("mychart");
            if (ctx) {
                this.chart = new Chart(ctx.getContext("2d"), this.chartConfig);
            }
        }
    }

    private updateChart(): void {
        if (this.logExtract) {
            this.chart.data = this.adapter.toChartData(this.logExtract, this.sensorFilter);
            this.chart.update();
        }
    }

    private initialConfig: ChartConfiguration = {

        type: "line",

        data: {},

        options: {

            title: {
                display: true,
                text: "",
            },

            legend: {
                position: 'bottom',
            },

            elements: {
                point: {
                    radius: 0,
                },
            },

            scales: {
                xAxes: [{
                    type: "time",
                    time: {
                        unit: "hour"
                    },
                    ticks: {
                        source: "auto",
                    },
                }]
            },
        }
    };

}
