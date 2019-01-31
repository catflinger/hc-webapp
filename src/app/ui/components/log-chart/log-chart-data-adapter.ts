import { ILogExtract, ILogEntry } from 'src/common/interfaces';
import { ChartConfiguration } from 'chart.js';

export class LogChartDataAdapter {


    // TO DO: make this return ChartData rather than ChartConfig
    // type and options should be set by the component not by the adapter


    public logExtractToChartConfig(extract: ILogExtract): ChartConfiguration {

        console.log("logExtractToChartConfig " + JSON.stringify(extract, null, 4));

        const result: ChartConfiguration = {
            type: "line",
            data: {
                labels: [],
                datasets: [],
            },
            options: {
                title: {
                    display: true,
                    text: "Logs for " + extract.from,
                },
                elements: {
                    point: {
                        radius: 0,
                    },
                },
                scales: {
                    xAxes: [
                        {
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 24
                            }
                        }
                    ],
                },
            },
        } 

        // add the x-axis values
        extract.entries.forEach((entry: ILogEntry) => {

// TO DO: fix the type conversion below.  Need to usereal  classes for data not just interfaces
            let dt: string = <string><unknown>entry.date;
            let label: string = dt.substr(11, 2);

            result.data.labels.push(label);
        });

        // add one dataset each sensor
        extract.sensors.forEach((sensor: string, sensorIndex: number) => {
            let dataset = {
                label: sensor,
                data: [],
                borderColor: "red",
                fill: false
            };

            // add the readings for the sensor
            extract.entries.forEach((entry: ILogEntry) => {
                dataset.data.push(entry.readings[sensorIndex]);
            });

            result.data.datasets.push(dataset);
        });

        return result;
    }

    private entryToDataset() {

    }
}