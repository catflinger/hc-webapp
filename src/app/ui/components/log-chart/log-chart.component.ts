import { Component, Input, OnInit, AfterViewInit, OnChanges, OnDestroy } from '@angular/core';
import { Chart, ChartData, ChartConfiguration } from "chart.js";

import { ILogExtract, ISensorReading, ISensorConfig } from 'src/common/interfaces';
import { LogChartDataAdapter } from './log-chart-data-adapter';

@Component({
    selector: 'app-log-chart',
    templateUrl: './log-chart.component.html',
    styleUrls: ['./log-chart.component.css']
})
export class LogChartComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    private chart: Chart;

    @Input()
    logExtract: ILogExtract;

    constructor() { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.drawChart();
    }

    ngOnChanges() {
        console.log("ON CHANGES");
        if (this.chart) {
            this.updateChart();
        } else {
            this.drawChart();
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
            const adapter = new LogChartDataAdapter();
            let chartConfig = adapter.logExtractToChartConfig(this.logExtract);

            let ctx: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("mychart");
            if (ctx) {
                this.chart = new Chart(ctx.getContext("2d"), chartConfig);
            }
        }
    }

    private updateChart(): void {
        if (this.logExtract) {
            const adapter = new LogChartDataAdapter();
            let chartConfig = adapter.logExtractToChartConfig(this.logExtract);
            this.chart.data = chartConfig.data;
            this.chart.update();
        }
    }

}
