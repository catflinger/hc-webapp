import { Component, Input, OnInit, AfterViewInit, OnChanges, OnDestroy } from '@angular/core';
import { Chart, ChartConfiguration } from "chart.js";

import { ILogExtract, ISensorReading, ISensorConfig } from 'src/common/interfaces';
import { LogChartDataAdapter } from './log-chart-data-adapter';
import { AutoClose } from '@ng-bootstrap/ng-bootstrap/util/autoclose';

@Component({
    selector: 'app-log-chart',
    templateUrl: './log-chart.component.html',
    styleUrls: ['./log-chart.component.css']
})
export class LogChartComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    private chartConfig: ChartConfiguration;
    private adapter: LogChartDataAdapter;
    private chart: Chart;

    @Input()
    logExtract: ILogExtract;

    @Input()
    dateFilter: Date;

    @Input()
    sensorFilter: string[];

    constructor() {
        this.adapter = new LogChartDataAdapter();
    }

    ngOnInit() {

        this.chartConfig = {

            type: "line",

            data: {},

            options: {

                title: {
                    display: true,
                    text: "Logs for " + this.logExtract.from,
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
        }
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

            let ctx: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("mychart");
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

}
