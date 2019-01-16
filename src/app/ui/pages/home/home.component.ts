import { Component, OnInit } from '@angular/core';
import { SensorReadingService } from '../../../services/sensor-reading.service';
import { OverrideService } from '../../../services/override-service';
import { IReading, IOverride } from '../../../../common/interfaces';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    private sensorReadings: IReading[] = [];
    private overrides: IOverride[] = [];


    constructor(
        private sensorReadingService: SensorReadingService,
        private overrideService: OverrideService,
    ) { }

    ngOnInit() {
        this.sensorReadingService.getReadings()
            .subscribe((readings: IReading[]) => {
                this.sensorReadings = readings;
            });

        this.overrideService.getOverrides()
            .subscribe((overrides: IOverride[]) => {
                this.overrides = overrides;
            });
    }

    private setOverride(minutes: number) {
        this.overrideService.setOverride(minutes);
    }

    private clearOverrides() {
        this.overrideService.clearOverrides();
    }
}
