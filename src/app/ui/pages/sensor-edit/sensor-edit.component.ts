import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AppContextService } from 'src/app/services/app-context.service';
import { ConfigService } from 'src/app/services/config.service';
import { Subscription } from 'rxjs';
import { ISensorReading } from 'src/common/interfaces';
import { SensorService } from 'src/app/services/sensor.service';
import { SensorConfig } from 'src/common/types';
import { AlertService } from 'src/app/services/alert.service';

interface IOption { text: string; value: string; }

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

        this.sensorService.refresh()
        .then(() => {
                this.params = this.route.snapshot.params;
                this.reading = this.sensorService.getReadings().find((r: ISensorReading) => {
                    return r.id === this.params.id ;
                });

                if (this.reading) {
                    this.form = this.fb.group({
                        description: this.fb.control(this.reading.description, [Validators.required]),
                        role: this.fb.control(this.roles.find((r) => r.value === this.reading.role), [Validators.required]),
                    });
                } else {
                    this.alertService.createAlert("Error: could not find sensor", "danger");
                    this.reading = undefined;
                }
            },
            (err) => {
                this.alertService.createAlert("Error: could not read sensors: " + err, "danger");
            }
        );
    }

    private onSubmit() {
        this.configService.updateConfig((config: any) => {
            const sensor = config.sensorConfig.find((s) => s.id === this.reading.id);

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
        .catch((error) => {
            this.alertService.createAlert("Error: could not save changes: " + error, "danger");
        });
    }

    private onCancel() {
        this.router.navigate(["/sensors"]);
    }
}
