import { Component, OnInit, OnDestroy } from '@angular/core';
import { SensorReadingService } from '../../../services/sensor-reading.service';
import { OverrideService } from '../../../services/override-service';
import { IReading, IOverride } from '../../../../common/interfaces';
import { Subscription } from 'rxjs';
import { AppContextService } from 'src/app/services/app-context.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];
    private sensorReadings: IReading[] = [];
    private overrides: IOverride[] = [];


    constructor(
        private sensorReadingService: SensorReadingService,
        private overrideService: OverrideService,
        private appContextService: AppContextService,
    ) {
        appContextService.clearContext();
     }

    ngOnInit() {
        this.subs.push(this.sensorReadingService.getReadings()
        .subscribe((readings: IReading[]) => {
            this.sensorReadings = readings;
        }));

        this.subs.push(this.overrideService.getOverrides()
        .subscribe((overrides: IOverride[]) => {
            this.overrides = overrides;
        }));
    }

    ngOnDestroy() {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    private setOverride(minutes: number) {
        this.overrideService.setOverride(minutes);
    }

    private clearOverrides() {
        this.overrideService.clearOverrides();
    }
}
