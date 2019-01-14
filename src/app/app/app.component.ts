import { Component } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { IConfiguration, IReading } from '../common/types';
import { SensorReadingService } from "../services/sensor-reading.service";
import { SensorAvailabilityService } from '../services/sensor-availability.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'hc-webapp';

    private config: IConfiguration;
    private sensorReadings: IReading[] = [];
    private availableSensors: IReading[] = [];

    private configString: string = "";
    private readingsString: string = "";
    private availableString: string = "";

    constructor(
        configService: ConfigService,
        sensorReadingService: SensorReadingService,
        sensorAvailabilityService: SensorAvailabilityService) {

        configService.getConfig()
            .subscribe((config) => {
                this.config = config;
                this.configString = JSON.stringify(this.config);
            });

        sensorReadingService.getReadings()
            .subscribe((readings: IReading[]) => {
                this.sensorReadings = readings;
                this.readingsString = JSON.stringify(this.sensorReadings);
            });

        sensorAvailabilityService.getReadings()
            .subscribe((readings: IReading[]) => {
                this.availableSensors = readings;
                this.availableString = JSON.stringify(this.availableSensors);
            });
    }

}
