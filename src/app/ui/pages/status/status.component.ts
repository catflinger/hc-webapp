import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppContextService } from 'src/app/services/app-context.service';
import { SensorService } from 'src/app/services/sensor.service';
import { ISensorReading, IControlState, IOverride, IConfigValidation, IConfiguration, IControlStateApiResponse } from 'src/common/interfaces';
import { Subscription } from 'rxjs';
import { ControlStateService } from 'src/app/services/control-state.service';
import { OverrideService } from 'src/app/services/override-service';
import { ConfigService } from 'src/app/services/config.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
    selector: 'app-status',
    templateUrl: './status.component.html',
    styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];
    private readings: ReadonlyArray<ISensorReading>;
    private controlState: IControlStateApiResponse;
    private overrides: IOverride[];
    
    constructor(
        private appContextService: AppContextService,
        private sensorService: SensorService,
        private controlStateService: ControlStateService,
        private overrideService: OverrideService,
        private alertService: AlertService,
        ) {
        
            this.appContextService.clearContext();
    }

    ngOnInit() {
        this.alertService.clearAlerts();

        this.subs.push (
            this.sensorService.getObservable()
            .subscribe((readings) => { this.readings = readings; })
        );

        this.subs.push (this.controlStateService.getControlState()
            .subscribe((controlState) => { 
                this.controlState = controlState; 
            })
        );

        this.subs.push (this.overrideService.getOverrides()
            .subscribe((overrides) => { this.overrides = overrides; })
        );
    }

    ngOnDestroy() {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }
}
