import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AppContextService } from 'src/app/services/app-context.service';
import { ConfigService } from 'src/app/services/config.service';
import { LogService } from 'src/app/services/log.service';
import { ILogExtract, ISensorConfig } from 'src/common/interfaces';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { AppContext } from 'src/app/services/app-context';
import { DayOfYear } from 'src/common/configuration/day-of-year';
import { switchMap, tap } from 'rxjs/operators';

@Component({
    selector: 'app-logger',
    templateUrl: './logger.component.html',
    styleUrls: ['./logger.component.css']
})
export class LoggerComponent implements OnInit, OnDestroy, AfterViewInit {
    private subs: Subscription[] = [];
    public logExtract: ILogExtract;
    public sensors: ReadonlyArray<ISensorConfig>;
    public selectedSensors: ISensorConfig[] = [];
    public appContext: AppContext = new AppContext(null, null, false);

    public form: FormGroup;

    constructor(
        private appContextService: AppContextService,
        private logService: LogService,
        private configService: ConfigService,
        private alertService: AlertService,
        private router: Router,
        private fb: FormBuilder,
    ) {
        this.appContextService.clearContext();
        this.form = this.fb.group({
            logDate: DayOfYear.fromDate(new Date()),
            sensors: this.fb.array([]),
        }
    );
}

    public ngOnInit() {
        this.alertService.clearAlerts();

        this.subs.push(this.appContextService.getAppContext().subscribe( (appCtx) => {
            this.appContext = appCtx;
        }));

        this.subs.push(
            this.configService.getObservable()
            .pipe(
                tap(config => {
                    if (config) {
                        this.sensors = config.getSensorConfig();

                        const sensorArray: FormArray = this.form.get("sensors") as FormArray;

                        sensorArray.clear();
                        this.sensors.forEach(sensor => {
                            sensorArray.push(this.fb.control(true))
                        });
                    }
                }),
                switchMap(_ => {
                    return this.form.valueChanges;
                })
            )
            .subscribe((values) => {
                if (values) {
                    this.onChanges(values);
                }
            })
        );
    }

    public ngAfterViewInit(): void {
        this.onChanges(this.form.value);
    }

    public ngOnDestroy() {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    public onRefresh() {
        this.appContextService.setBusy();

        this.logService
            .update()
            .then(() => {
                return this.logService.getLog(this.form.value.logDate)
            })
            .then((log) => {
                this.logExtract = log;
            })
            .catch()
            .then(() => this.appContextService.clearBusy());
}

    public onChanges(val: any): void {

        if (val.logDate) {
            this.appContextService.setBusy();

            const dayOfYear = new DayOfYear({
                year: val.logDate.year, 
                month: val.logDate.month, 
                day: val.logDate.day,
            });

            this.selectedSensors = [];

            val.sensors
                .map( (v, i) => ({selected: v, index: i}) )
                .filter(si => si.selected)
                .forEach(si => {
                    this.selectedSensors.push(this.sensors[si.index])
                });

            this.logService.getLog(dayOfYear)
            .then((log) => {
                this.logExtract = log;
            })
            .catch()
            .then(() => this.appContextService.clearBusy());
        }
    }
}
