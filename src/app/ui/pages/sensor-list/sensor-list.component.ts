import { Component, OnInit } from '@angular/core';
import { AppContextService } from 'src/app/services/app-context.service';
import { ISensorConfig } from 'src/common/interfaces';
import { SensorService } from 'src/app/services/sensor.service';

@Component({
    selector: 'app-sensor-list',
    templateUrl: './sensor-list.component.html',
    styleUrls: ['./sensor-list.component.css']
})
export class SensorListComponent implements OnInit {
    private sensors: ReadonlyArray<ISensorConfig>;

    constructor(
        private appContextService: AppContextService,
        private sensorService: SensorService) {

        this.appContextService.clearContext();

        this.sensorService.getReadings()
        .subscribe((readings) => {
            this.sensors = readings;
        });
    }

    ngOnInit() {
    }

}
