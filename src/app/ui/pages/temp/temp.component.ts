import { Component, OnInit } from '@angular/core';

import { ConfigService } from '../../../services/config.service';
import { IConfiguration, IReading, IControlState, IOverride, IProgram } from '../../../../common/interfaces';
import { SensorReadingService } from "../../../services/sensor-reading.service";
import { SensorAvailabilityService } from '../../../services/sensor-availability.service';
import { ControlStateService } from '../../../services/control-state.service';
import { OverrideService } from '../../../services/override-service';

@Component({
    selector: 'app-temp',
    templateUrl: './temp.component.html',
    styleUrls: ['./temp.component.css']
})
export class TempComponent implements OnInit {

    private config: IConfiguration;
    private controlState: IControlState;
    private sensorReadings: IReading[] = [];
    private availableSensors: IReading[] = [];
    private overrides: IOverride[] = [];

    private configString: string = "";
    private readingsString: string = "";
    private availableString: string = "";
    private controlStateString: string = "";
    private overrideStateString: string = "";

    private program: IProgram;

    constructor(
        private configService: ConfigService,
        private controlStateService: ControlStateService,
        private sensorReadingService: SensorReadingService,
        private overrideService: OverrideService,
        private sensorAvailabilityService: SensorAvailabilityService) {

    }

    private setOverride(minutes: number) {
        this.overrideService.setOverride(minutes);
    }

    private clearOverrides(minutes: number) {
        this.overrideService.clearOverrides();
    }

    ngOnInit() {
        this.configService.getConfig()
            .subscribe((config) => {
                this.config = config;
                this.configString = JSON.stringify(this.config);
                if (this.config && this.config.getProgramConfig().length) {
                    this.program = this.config.getProgramConfig()[0];
                }
            });

        this.controlStateService.getControlState()
            .subscribe((controlState) => {
                this.controlState = controlState;
                this.controlStateString = JSON.stringify(this.controlState);
            });

        this.sensorReadingService.getReadings()
            .subscribe((readings: IReading[]) => {
                this.sensorReadings = readings;
                this.readingsString = JSON.stringify(this.sensorReadings);
            });

        this.sensorAvailabilityService.getReadings()
            .subscribe((readings: IReading[]) => {
                this.availableSensors = readings;
                this.availableString = JSON.stringify(this.availableSensors);
            });

        this.overrideService.getOverrides()
            .subscribe((overrides: IOverride[]) => {
                this.overrides = overrides;
                this.overrideStateString = JSON.stringify(this.overrides);
            });
    }

}
