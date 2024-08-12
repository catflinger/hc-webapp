import { ChartData, ChartDataSets, ChartPoint } from 'chart.js';
import * as moment from "moment";
import { ILogExtract, ILogEntry, ISensorConfig } from 'src/common/interfaces';

type SensorParam = {
    sensorId: string,
    logIndex: number,
}

type LogDataset = {
    label: string,
    data: ChartPoint[],
    borderColor: string,
    borderDash?: number[],
    fill: boolean,
    readingIndex: number
}

type LogChartData = {
    labels: string[],
    datasets: LogDataset[],
}

export class LogChartDataAdapter {

    public toChartData(extract: ILogExtract, selectedSensors: ISensorConfig[]): ChartData {

        const result: LogChartData = {
            labels: [],
            datasets: [],
        };

        // find the offset for each selected sensor in the log entry

        const sensorsXXX: SensorParam[] = selectedSensors
            .map(s => ({ 
                sensorId: s.id,
                logIndex: extract.sensorIds.findIndex(id => id === s.id),
            }))
            .filter(sp => sp.logIndex >= 0);


        // add one dataset each sensor
        sensorsXXX.forEach((sp: SensorParam) => {
            const sensor = selectedSensors.find(s => s.id === sp.sensorId);

            const dataset: LogDataset = {
                label: sensor.description || sensor.id,
                data: [],
                borderColor: sensor.displayColor,
                borderDash: this.hasRole(sensor) ? [8, 2] : [],
                fill: false,
                readingIndex: sp.logIndex
            };
            result.datasets.push(dataset);
    });


        const hwDataset: LogDataset = {
            label: "HW ON",
            data: [],
            borderColor: "orange",
            fill: false,
            readingIndex: NaN,
        };

        const chDataset: LogDataset = {
            label: "CH ON",
            data: [],
            borderColor: "red",
            fill: false,
            readingIndex: NaN
        };

        const m = moment(extract.dayOfYear.getStartAsDate());

        // add a tick every 10 minutes
        for (let ticks = 0; ticks < 6 * 24; ticks++) {
            m.add(10, "minutes");

            // find the record (if one exists) for this point in time
            const entry: ILogEntry = extract.entries.find((e) => m.isSame(e.date, "minutes"));

            const readings: ReadonlyArray<number> = entry ? entry.readings : [];

            // add the readings for each dataset


            // Need to revisit sensor selection here?  How to know which readings to use?


            result.datasets.forEach((dataset) => {
                const i = dataset.readingIndex;

                dataset.data.push({
                    x: m.toISOString(),
                    y: readings[i] === undefined ? null : readings[i] / 10,
                } as ChartPoint);
            });

            // this is a dummy dataset that shows the boiler state as a horizontal line on the graph
            // ON is shown as 100 degrees and OFF is a null value
            hwDataset.data.push({
                x: m.toISOString(),
                y: entry && entry.hotWater ? 80 : null,
            });

            chDataset.data.push({
                x: m.toISOString(),
                y: entry && entry.heating ? 85 : null,
            });
        }

        result.datasets.push(hwDataset);
        result.datasets.push(chDataset);

        return result;
    }

    private hasRole(sensor: ISensorConfig): boolean {
        return sensor.role === "hw" || sensor.role === "bedroom";
    }
}
