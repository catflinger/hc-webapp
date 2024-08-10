import { ChartData } from 'chart.js';
import * as moment from "moment";

import { ILogExtract, ILogEntry, ISensorConfig } from 'src/common/interfaces';

export class LogChartDataAdapter {

    public toChartData(extract: ILogExtract, config: ISensorConfig[]): ChartData {

        const result = {
            labels: [],
            datasets: [],
        };

        // add one dataset each sensor
        extract.sensors.forEach((sensorId: string) => {
            const sensorConfig = config.find((s) => s.id === sensorId);

            if (sensorConfig) {
                const dataset = {
                    label: sensorConfig ? sensorConfig.description : sensorId,
                    data: [],
                    borderColor: sensorConfig.displayColor,
                    borderDash: this.hasRole(sensorConfig) ? [8, 2] : [],
                    fill: false
                };
                result.datasets.push(dataset);
            }
        });

        const HWdDataset = {
            label: "HW ON",
            data: [],
            borderColor: "orange",
            fill: false
        };

        const CHdDataset = {
            label: "CH ON",
            data: [],
            borderColor: "red",
            fill: false
        };

        const m = moment(extract.dayOfYear.getStartAsDate());

        // add a tick every 10 minutes
        for (let ticks = 0; ticks < 6 * 24; ticks++) {
            m.add(10, "minutes");

            // find the record (if one exists) for this point in time
            const entry: ILogEntry = extract.entries.find((e) => m.isSame(e.date, "minutes"));

            const readings: ReadonlyArray<number> = entry ? entry.readings : [];

            // add the readings for each dataset
            result.datasets.forEach((dataset, i) => {
                dataset.data.push({
                    x: m.toISOString(),
                    y: readings[i] === undefined ? null : readings[i] / 10,
                });
            });

            // this is a dummy dataset that shows the boiler state as a horizontal line on the graph
            // ON is shown as 100 degrees and OFF is a null value
            HWdDataset.data.push({
                x: m.toISOString(),
                y: entry && entry.hotWater ? 80 : null,
            });

            CHdDataset.data.push({
                x: m.toISOString(),
                y: entry && entry.heating ? 85 : null,
            });
        }

        result.datasets.push(HWdDataset);
        result.datasets.push(CHdDataset);

        return result;
    }

    private hasRole(sensor: ISensorConfig): boolean {
        return sensor.role === "hw" || sensor.role === "bedroom";
    }
}
