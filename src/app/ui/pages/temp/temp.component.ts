import { Component, OnInit, OnDestroy } from '@angular/core';

import { ConfigService } from '../../../services/config.service';
import { IConfiguration, ISensorConfig, IControlState, IOverride, IProgram, IControlStateApiResponse } from '../../../../common/interfaces';
import { SensorService } from "../../../services/sensor.service";
import { ControlStateService } from '../../../services/control-state.service';
import { OverrideService } from '../../../services/override-service';
import { Subscription } from 'rxjs';
import { AppContextService } from 'src/app/services/app-context.service';
import { ControlStateApiResponse } from 'src/common/api/control-state-api-response';

@Component({
    selector: 'app-temp',
    templateUrl: './temp.component.html',
    styleUrls: ['./temp.component.css']
})
export class TempComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];

    public config: IConfiguration;
    protected controlState: IControlState;
    protected sensors: ISensorConfig[] = [];
    protected overrides: IOverride[] = [];

    public configString = "";
    public sensorsString = "";
    public availableString = "";
    public controlStateString = "";
    public overrideStateString = "";

    protected program: IProgram;

    constructor(
        private configService: ConfigService,
        private controlStateService: ControlStateService,
        private sensorService: SensorService,
        private overrideService: OverrideService,
        private appContextService: AppContextService
        ) {
            appContextService.clearContext();
    }

    public setOverride(minutes: number) {
        this.overrideService.setOverride(minutes);
    }

    public clearOverrides() {
        this.overrideService.clearOverrides();
    }

    ngOnInit() {
        this.subs.push(this.configService.getObservable()
            .subscribe((config) => {
                this.config = config;
                this.configString = JSON.stringify(this.config);
                if (this.config && this.config.getProgramConfig().length) {
                    this.program = this.config.getProgramConfig()[0];
                }
            })
        );

        this.subs.push(this.controlStateService.getObservable()
            .subscribe((controlStateResponse) => {
                if (controlStateResponse) {
                    this.controlState = controlStateResponse.controlState;
                    this.controlStateString = JSON.stringify(this.controlState);
                }
            }));

        this.subs.push(this.sensorService.getObservable()
            .subscribe((readings: ISensorConfig[]) => {
                this.sensors = readings;
                this.sensorsString = JSON.stringify(this.sensors);
            }));

        this.subs.push(this.overrideService.getObservable()
            .subscribe((overrides: IOverride[]) => {
                this.overrides = overrides;
                this.overrideStateString = JSON.stringify(this.overrides);
            })
        );
    }

    ngOnDestroy() {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }
}
