import { Component } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { IConfiguration, IReading, IControlState } from '../common/types';
import { SensorReadingService } from "../services/sensor-reading.service";
import { SensorAvailabilityService } from '../services/sensor-availability.service';
import { ControlStateService } from '../services/control-state.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'hc-webapp';

    private config: IConfiguration;
    private controlState: IControlState;
    private sensorReadings: IReading[] = [];
    private availableSensors: IReading[] = [];

    private configString: string = "";
    private readingsString: string = "";
    private availableString: string = "";
    private controlStateString: string = "";

    constructor(
        configService: ConfigService,
        controlStateService: ControlStateService,
        sensorReadingService: SensorReadingService,
        sensorAvailabilityService: SensorAvailabilityService) {

        configService.getConfig()
            .subscribe((config) => {
                this.config = config;
                this.configString = JSON.stringify(this.config);
            });

        controlStateService.getControlState()
            .subscribe((controlState) => {
                this.controlState = controlState;
                this.controlStateString = JSON.stringify(this.controlState);
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
