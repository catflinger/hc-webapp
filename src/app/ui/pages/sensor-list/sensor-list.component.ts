import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppContextService } from 'src/app/services/app-context.service';
import { ISensorConfig, ISensorReading, IConfiguration, IConfigurationM } from 'src/common/interfaces';
import { ReadingService } from 'src/app/services/reading.service';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/services/config.service';
import { Subscription, Observable, combineLatest } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { Configuration } from 'src/common/types';
import { AppContext } from 'src/app/services/app-context';

@Component({
    selector: 'app-sensor-list',
    templateUrl: './sensor-list.component.html',
    styleUrls: ['./sensor-list.component.css']
})
export class SensorListComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];
    public sensors: ReadonlyArray<ISensorConfig> = [];
    public readings: ReadonlyArray<ISensorReading> = [];
    public appContext: AppContext = new AppContext(null, null, false);

    private config: IConfiguration = null;
    private combined: Observable<[IConfiguration, ISensorReading[]]>;

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

        this.subs.push(this.appContextService.getAppContext().subscribe( (appCtx) => {
            this.appContext = appCtx;
        }));

        this.subs.push(this.combined
        .subscribe((results) => {
            if (results[0] && results[1]) {
                const config = results[0];
                const readings = results[1];
                this.sensors = config
                    .getSensorConfig()
                    .slice()
                    .sort((a, b) => a.displayOrder - b.displayOrder);

                // add readings to configured sensors (if there is one)
                this.sensors.forEach((sensor: ISensorConfig) => {
                    const reading = readings.find((r: ISensorConfig) => r.id === sensor.id);
                    if (reading) {
                        sensor.reading = reading.reading;
                    }
                });

                // only show readings here for unconfigured sensors
                this.readings = readings
                    .filter((r) => !this.sensors.find((sensor) => sensor.id === r.id));
            }
        }));
    }

    ngOnDestroy() {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    public onEdit(id: string) {
        this.router.navigate(["/sensor-edit", id]);
    }

    public onRemove(id: string) {
        this.appContextService.setBusy();

        this.configService.updateConfig((config: IConfigurationM) => {
            const index: number = config.sensorConfig.findIndex((sc) => sc.id === id);
            if (index >= 0) {
                config.sensorConfig.splice(index, 1);
            }

            return false;
        })
        .catch((error) => {
            this.alertService.setAlert("Error: could not clear sensor: " + error, "danger");
        })
        .then(() => this.appContextService.clearBusy());

    }

    public onAdd(reading: ISensorReading) {
        this.appContextService.setBusy();

        this.configService.updateConfig((config: IConfigurationM) => {
            config.sensorConfig.push(reading);
            return false;
        })
        .then(() => {
            this.router.navigate(["/sensor-edit", reading.id]);
        })
        .catch((error) => {
            this.alertService.setAlert("Error: could not add sensor: " + error, "danger");
        })
        .then(() => this.appContextService.clearBusy());
    }
}
