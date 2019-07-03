import { Component, OnInit, OnDestroy, AfterViewInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AppContextService } from 'src/app/services/app-context.service';
import { ConfigService } from 'src/app/services/config.service';
import { LogService } from 'src/app/services/log.service';
import { ILogExtract, IConfiguration, ISensorConfig } from 'src/common/interfaces';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { SensorConfig } from 'src/common/types';
import { AlertService } from 'src/app/services/alert.service';
import { AppContext } from 'src/app/services/app-context';

@Component({
    selector: 'app-logger',
    templateUrl: './logger.component.html',
    styleUrls: ['./logger.component.css']
})
export class LoggerComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];
    public logExtract: ILogExtract;
    public sensors: ReadonlyArray<ISensorConfig>;
    public appContext: AppContext = new AppContext(null, null, false);

    private form: FormGroup;

    constructor(
        private appContextService: AppContextService,
        private logService: LogService,
        private configService: ConfigService,
        private alertService: AlertService,
        private router: Router,
        private fb: FormBuilder,
    ) {
        this.appContextService.clearContext();
    }

    ngOnInit() {
        this.alertService.clearAlerts();

        this.subs.push(this.appContextService.getAppContext().subscribe( (appCtx) => {
            this.appContext = appCtx;
        }));

        this.subs.push(this.configService.getObservable()
        .subscribe((config) => {
            if (config) {
                this.sensors = config.getSensorConfig();

                this.form = this.fb.group(
                    {
                        logDate: null,
                        sensors: this.fb.array(this.sensors.map((s, i) => true))
                    }
                );

                this.subs.push(
                    this.form.valueChanges.subscribe((val) => this.onChanges(val)));
            }
        }));

        this.subs.push(this.logService.getObservable()
            .subscribe((extract) => {
                this.logExtract = extract;
            }));
    }

    ngOnDestroy() {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    onDateSelect(ds: NgbDateStruct) {
        this.appContextService.setBusy();

        const from: Date = new Date(ds.year, ds.month - 1, ds.day, 0, 0, 0);
        const to: Date = new Date(ds.year, ds.month - 1, ds.day, 23, 59, 59);
        const sensorIds: string[] = this.sensors.map((sc) => sc.id);

        this.logService.refresh(from, to, sensorIds)
        .catch()
        .then(() => this.appContextService.clearBusy());
    }

    onChanges(val: any): void {
        if (val.logDate) {
            this.appContextService.setBusy();

            const from: Date = new Date(val.logDate.year, val.logDate.month - 1, val.logDate.day, 0, 0, 0);
            const to: Date = new Date(val.logDate.year, val.logDate.month - 1, val.logDate.day, 23, 59, 59);

            const selectedSensorIds: string[] = [];

            val.sensors
                .map( (v, i) => ({selected: v, index: i}) )
                .filter(si => si.selected)
                .forEach(si => selectedSensorIds.push(this.sensors[si.index].id));

            this.logService.refresh(from, to, selectedSensorIds)
            .catch()
            .then(() => this.appContextService.clearBusy());
        }
    }
}
