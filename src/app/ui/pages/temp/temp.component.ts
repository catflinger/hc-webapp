import { Component, OnInit, OnDestroy } from '@angular/core';

import { ConfigService } from '../../../services/config.service';
import { IConfiguration, ISensorConfig, IControlState, IOverride, IProgram } from '../../../../common/interfaces';
import { SensorReadingService } from "../../../services/sensor-reading.service";
import { SensorAvailabilityService } from '../../../services/sensor-availability.service';
import { ControlStateService } from '../../../services/control-state.service';
import { OverrideService } from '../../../services/override-service';
import { Subscription } from 'rxjs';
import { AppContextService } from 'src/app/services/app-context.service';

@Component({
    selector: 'app-temp',
    templateUrl: './temp.component.html',
    styleUrls: ['./temp.component.css']
})
export class TempComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];

    private config: IConfiguration;
    private controlState: IControlState;
    private sensorReadings: ISensorConfig[] = [];
    private availableSensors: ISensorConfig[] = [];
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
        private sensorAvailabilityService: SensorAvailabilityService,
        private appContextService: AppContextService) {
            appContextService.clearContext();
    }

    private setOverride(minutes: number) {
        this.overrideService.setOverride(minutes);
    }

    private clearOverrides(minutes: number) {
        this.overrideService.clearOverrides();
    }

    ngOnInit() {
        this.subs.push(this.configService.getConfig()
            .subscribe((config) => {
                this.config = config;
                this.configString = JSON.stringify(this.config);
                if (this.config && this.config.getProgramConfig().length) {
                    this.program = this.config.getProgramConfig()[0];
                }
            }));

        this.subs.push(this.controlStateService.getControlState()
            .subscribe((controlState) => {
                this.controlState = controlState;
                this.controlStateString = JSON.stringify(this.controlState);
            }));

        this.subs.push(this.sensorReadingService.getReadings()
            .subscribe((readings: ISensorConfig[]) => {
                this.sensorReadings = readings;
                this.readingsString = JSON.stringify(this.sensorReadings);
            }));

        this.subs.push(this.sensorAvailabilityService.getReadings()
            .subscribe((readings: ISensorConfig[]) => {
                this.availableSensors = readings;
                this.availableString = JSON.stringify(this.availableSensors);
            }));

        this.subs.push(this.overrideService.getOverrides()
            .subscribe((overrides: IOverride[]) => {
                this.overrides = overrides;
                this.overrideStateString = JSON.stringify(this.overrides);
            }));
    }

    ngOnDestroy() {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }
}
