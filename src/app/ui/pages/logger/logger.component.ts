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

@Component({
    selector: 'app-logger',
    templateUrl: './logger.component.html',
    styleUrls: ['./logger.component.css']
})
export class LoggerComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];
    public logExtract: ILogExtract;
    public sensors: ReadonlyArray<ISensorConfig>;
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

        this.subs.push(this.configService.getObservable()
        .subscribe((config) => {
            if (config) {
                this.sensors = config.getSensorConfig();

                this.form = this.fb.group({
                    sensors: this.fb.array(this.sensors.map((sensor) => {
                        return {
                            checked: false,
                            id: sensor.id,
                            label: sensor.description,
                        };
                    })),
                });
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
        const from: Date = new Date(ds.year, ds.month - 1, ds.day, 0, 0, 0);
        const to: Date = new Date(ds.year, ds.month - 1, ds.day, 23, 59, 59);
        const sensorIds: string[] = this.sensors.map((sc) => sc.id);

        this.logService.refresh(from, to, sensorIds);
    }
}
