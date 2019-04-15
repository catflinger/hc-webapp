import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppContextService } from 'src/app/services/app-context.service';
import { ISensorConfig, ISensorReading, IConfiguration } from 'src/common/interfaces';
import { ReadingService } from 'src/app/services/reading.service';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/services/config.service';
import { Subscription, Observable, combineLatest } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { Configuration } from 'src/common/types';

@Component({
    selector: 'app-sensor-list',
    templateUrl: './sensor-list.component.html',
    styleUrls: ['./sensor-list.component.css']
})
export class SensorListComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];
    public sensors: ReadonlyArray<ISensorConfig> = [];
    public readings: ReadonlyArray<ISensorReading> = [];

    private config: IConfiguration = null;
    private combined: Observable<[IConfiguration, ISensorReading[]]>;

    private busy: boolean = false;

    constructor(
        private appContextService: AppContextService,
        private readingService: ReadingService,
        private configService: ConfigService,
        private alertService: AlertService,
        private router: Router) {

        this.appContextService.clearContext();

        this.combined = combineLatest(this.configService.getObservable(), this.readingService.getObservable());
    }

    ngOnInit() {
        this.alertService.clearAlerts();

        this.subs.push(this.combined
        .subscribe((results) => {
            if (results[0] && results[1]) {
                const config = results[0];
                const readings = results[1];
                this.sensors = config.getSensorConfig();

                // add readings to configured sensors (if there is one)
                this.sensors.forEach((sensor: ISensorConfig) => {
                    let reading = readings.find((reading: ISensorConfig) => reading.id === sensor.id);
                    if (reading) {
                        sensor.reading = reading.reading;
                    }
                });

                // only show readings here for unconfigured sensors
                this.readings = readings.filter((reading) => !this.sensors.find((sensor) => sensor.id === reading.id));
            }
        }));
    }

    ngOnDestroy() {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    private onEdit(id: string) {
        this.busy = true;
        this.router.navigate(["/sensor-edit", id]);
    }

    private onRemove(id: string) {
        this.busy = true;

        this.configService.updateConfig((config: any) => {
            const index: number = config.sensorConfig.findIndex((sc) => sc.id === id);
            if (index >= 0) {
                config.sensorConfig.splice(index, 1);
            }

            return false;
        })
        .then(() => {
            this.busy = false;

        })
        .catch((error) => {
            this.alertService.createAlert("Error: could not clear sensor: " + error, "danger");
            this.busy = false;
        });
    }

    private onAdd(reading: ISensorReading) {
        this.busy = true;

        this.configService.updateConfig((config: any) => {
            config.sensorConfig.push(reading);
            return false;
        })
        .then(() => {
            this.router.navigate(["/sensor-edit", reading.id]);
        })
        .catch((error) => {
            this.alertService.createAlert("Error: could not add sensor: " + error, "danger");
            this.busy = false;
        });
    }
}
