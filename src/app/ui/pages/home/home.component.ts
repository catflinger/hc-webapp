import { Component, OnInit, OnDestroy } from '@angular/core';
import { SensorService } from '../../../services/sensor.service';
import { OverrideService } from '../../../services/override-service';
import { ISensorConfig, IOverride } from '../../../../common/interfaces';
import { Subscription } from 'rxjs';
import { AppContextService } from 'src/app/services/app-context.service';
import { AlertService, AlertType } from 'src/app/services/alert.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];
    private sensorReadings: ISensorConfig[] = [];
    private overrides: IOverride[] = [];


    constructor(
        private sensorReadingService: SensorService,
        private overrideService: OverrideService,
        private appContextService: AppContextService,
        private alertService: AlertService,
    ) {
        appContextService.clearContext();
     }

    ngOnInit() {
        this.alertService.clearAlerts();
        
        this.subs.push(
            this.sensorReadingService.getReadings()
            .subscribe(
                (readings: ISensorConfig[]) => {
                    this.sensorReadings = readings;
                },
                this.alertService.createAlert("Could not get sensor readings", "danger")
            )
        );

        this.subs.push(
            this.overrideService.getOverrides()
            .subscribe(
                (overrides: IOverride[]) => {
                    this.overrides = overrides;
                },
                this.alertService.createAlert("Could not get override status", "danger")
            )
        );
    }

    ngOnDestroy() {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    private setOverride(minutes: number) {
        this.overrideService.setOverride(minutes)
        .then(this.alertService.createAlert("Override set", "info"))
        .catch(this.alertService.createAlert("Failed to set override", "danger"));
    }

    private clearOverrides() {
        this.overrideService.clearOverrides()
        .then(this.alertService.createAlert("Overrides cleared", "info"))
        .catch(this.alertService.createAlert("Failed to clear overrides", "danger"));
    }
}
