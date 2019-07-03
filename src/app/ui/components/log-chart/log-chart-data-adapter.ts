import { ChartData, ChartDataSets } from 'chart.js';
import * as moment from "moment";

import { ILogExtract, ILogEntry, ISensorConfig } from 'src/common/interfaces';

export class LogChartDataAdapter {

    public toChartData(extract: ILogExtract, config: ISensorConfig[]): ChartData {

        const result = {
            labels: [],
            datasets: [],
        };

        // add one dataset each sensor
        extract.sensors.forEach((sensorId: string, sensorIndex: number) => {
            const sensorConfig = config.find((s) => s.id === sensorId);

            const dataset = {
                label: sensorConfig ? sensorConfig.description : sensorId,
                data: [],
                borderColor: sensorConfig.displayColor,
                fill: false
            };
            result.datasets.push(dataset);
        });

        const m = moment(extract.from);

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
                    y: readings[i] === undefined ? null : readings[i],
                });
            });
        }

        return result;
    }
}
