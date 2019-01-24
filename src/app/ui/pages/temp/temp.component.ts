import { Component, OnInit, OnDestroy } from '@angular/core';

import { ConfigService } from '../../../services/config.service';
import { IConfiguration, ISensorConfig, IControlState, IOverride, IProgram } from '../../../../common/interfaces';
import { SensorService } from "../../../services/sensor.service";
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
    private sensors: ISensorConfig[] = [];
    private overrides: IOverride[] = [];

    private configString: string = "";
    private sensorsString: string = "";
    private availableString: string = "";
    private controlStateString: string = "";
    private overrideStateString: string = "";

    private program: IProgram;

    constructor(
        private configService: ConfigService,
        private controlStateService: ControlStateService,
        private sensorService: SensorService,
        private overrideService: OverrideService,
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

        this.subs.push(this.sensorService.getReadings()
            .subscribe((readings: ISensorConfig[]) => {
                this.sensors = readings;
                this.sensorsString = JSON.stringify(this.sensors);
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
