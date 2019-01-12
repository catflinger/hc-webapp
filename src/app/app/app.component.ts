import { Component } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { IConfiguration, IReading } from '../common/types';
import { SensorReadingService } from '../services/sensor-reading.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'hc-webapp';

    private config: IConfiguration;
    private sensorReadings: IReading[] = [];

    private configString: string = "";
    private readingsString: string = "";

    constructor(
        configService: ConfigService,
        sensorReadingService: SensorReadingService) {

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
    }
}
