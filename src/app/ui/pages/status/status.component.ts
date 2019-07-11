import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppContextService } from 'src/app/services/app-context.service';
import { SensorService } from 'src/app/services/sensor.service';
import { ISensorReading, IOverride, IControlStateApiResponse, IControlState, IProgram } from 'src/common/interfaces';
import { Subscription } from 'rxjs';
import { ControlStateService } from 'src/app/services/control-state.service';
import { OverrideService } from 'src/app/services/override-service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
    selector: 'app-status',
    templateUrl: './status.component.html',
    styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];
    public readings: ReadonlyArray<ISensorReading>;
    public controlState: IControlState;
    public activeProgram: IProgram;
    public overrides: IOverride[];

    constructor(
        private appContextService: AppContextService,
        private sensorService: SensorService,
        private controlStateService: ControlStateService,
        private overrideService: OverrideService,
        private alertService: AlertService,
        ) {

            this.appContextService.clearContext();
    }

    public ngOnInit() {
        this.alertService.clearAlerts();

        this.subs.push (
            this.sensorService.getObservable()
            .subscribe((readings) => { this.readings = readings; })
        );

        this.subs.push (this.controlStateService.getObservable()
            .subscribe((controlStateResponse) => {
                if (controlStateResponse) {
                    this.controlState = controlStateResponse.controlState;
                    this.activeProgram = controlStateResponse.activeProgram;
                }
            })
        );

        this.subs.push (this.overrideService.getObservable()
            .subscribe((overrides) => { this.overrides = overrides; })
        );
    }

    public ngOnDestroy() {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    public onRefresh() {
        this.controlStateService.refresh();
        this.overrideService.refresh();

        // TO DO: how to refresh the sensors and config??
    }
}
