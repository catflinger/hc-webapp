import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AppContextService } from 'src/app/services/app-context.service';
import { ConfigService } from 'src/app/services/config.service';
import { Subscription } from 'rxjs';
import { IConfiguration, IRule, ISensorConfig, ISensorReading } from 'src/common/interfaces';
import { SensorService } from 'src/app/services/sensor.service';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { SensorConfig } from 'src/common/types';
import { AlertService } from 'src/app/services/alert.service';

interface IOption { text: string, value: string };

@Component({
    selector: 'app-sensor-edit',
    templateUrl: './sensor-edit.component.html',
    styleUrls: ['./sensor-edit.component.css']
})
export class SensorEditComponent implements OnInit {
    private subs: Subscription[] = [];
    private form: FormGroup;
    private params: Params;
    private reading: ISensorReading;

    private roles: IOption[] = [ 
        { text: "none", value: "" },
        { text: "hot water", value: "hw" },
        { text: "bedroom", value: "bedroom" },
    ];

    constructor(
        private appContextService: AppContextService,
        private configService: ConfigService,
        private sensorService: SensorService,
        private alertService: AlertService,
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        ) {
        appContextService.clearContext();
    }

    ngOnInit() {
        this.alertService.clearAlerts();

        this.subs.push(this.sensorService.getReadings()
        .subscribe(
            (readings: ISensorReading[]) => {
                this.params = this.route.snapshot.params;

                this.reading = readings.find((r: ISensorReading) => { 
                    return r.id === this.params.id ;
                });
                
                if (this.reading) {
                    this.form = this.fb.group({
                        description: this.fb.control(this.reading.description, [Validators.required]),
                        role: this.fb.control(this.roles.find((r) => r.value === this.reading.role), [Validators.required]),
                    });
                } else {
                    // TO DO: show some message here
                    console.log("ERROR: sensor not found");
                    this.reading = undefined;
                }
            },
            (err) => {
                // TO DO: show message somewhere;
                console.log("ERROR: could not load form");
            }
        ));
    }

    private onSubmit() {
        this.configService.updateConfig((config: any) => {
            let sensor = config.sensorConfig.find((s) => s.id === this.reading.id);
            
            if (!sensor) {
                config.sensorConfig.push(new SensorConfig({
                    id: this.reading.id,
                    description: this.form.value.description,
                    role: this.form.value.role.value,
                    reading: null,
                }));
            } else {
                sensor.description = this.form.value.description;
                sensor.role  = this.form.value.role.value;
            }
            return false;
        })
        .then(() => {
            this.router.navigate(["/sensors"]);
        })
        .catch(() => {
            // TO DO: show message somewhere;
            console.log("ERROR: could not savethe changes");
        });
    }

    private onCancel() {
        this.router.navigate(["/sensors"]);
    }
}
