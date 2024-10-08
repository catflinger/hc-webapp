import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AppContextService } from 'src/app/services/app-context.service';
import { ConfigService } from 'src/app/services/config.service';
import { Subscription } from 'rxjs';
import { ISensorReading, IConfigurationM, ISensorConfig } from 'src/common/interfaces';
import { ReadingService } from 'src/app/services/reading.service';
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
    public form: FormGroup;
    private params: Params;
    private sensorId: string;

    public roles: readonly IOption[] = [
        { text: "none", value: "" },
        { text: "hot water", value: "hw" },
        { text: "bedroom", value: "bedroom" },
    ];

    public colors: readonly IOption[] = [
        { text: "black", value: "black" },
        { text: "grey", value: "silver" },
        { text: "red", value: "red" },
        { text: "pink", value: "pink" },
        { text: "orchid", value: "orchid" },
        { text: "blue", value: "blue" },
        { text: "isobel purple", value: "rebeccapurple" },
        { text: "sky blue", value: "lightskyblue" },
        { text: "green", value: "green" },
        { text: "yellow", value: "yellow" },
        { text: "orange", value: "orange" },
        { text: "brown", value: "brown" },
        { text: "goldenrod", value: "goldenrod" },
        { text: "cornflower blue", value: "cornflowerblue" },
    ];

    constructor(
        private appContextService: AppContextService,
        private configService: ConfigService,
        // private readingService: ReadingService,
        private alertService: AlertService,
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        ) {
        appContextService.clearContext();
    }

    ngOnInit() {
        this.alertService.clearAlerts();

        this.params = this.route.snapshot.params;
        this.sensorId = this.params.id;

        this.configService.refresh()
        .then(
            () => {
                let sensor = this.configService.getConfig().getSensorConfig().find((c: ISensorConfig) => {
                    return c.id === this.sensorId;
                });

                if (!sensor) {
                    sensor = new SensorConfig({
                        id: this.params.id,
                        description: "",
                        reading: null,
                        displayColor: "black",
                        displayOrder: 100,
                    });
                }

                this.form = this.fb.group({
                    description: this.fb.control(sensor.description, [Validators.required]),
                    role: this.fb.control(this.findOption(this.roles, sensor.role), [Validators.required]),
                    displayColor: this.fb.control(this.findOption(this.colors, sensor.displayColor), []),
                    displayOrder: this.fb.control(sensor.displayOrder, []),
                });
        },
            (err) => {
                this.alertService.setAlert("Error: could not read sensors: " + err, "danger");
            }
        );
    }

    public onSubmit() {
        this.configService.updateConfig((config: IConfigurationM) => {
            const sensor = config.sensorConfig.find((s) => s.id === this.sensorId);

            if (!sensor) {
                config.sensorConfig.push(new SensorConfig({
                    id: this.sensorId,
                    description: this.form.value.description,
                    role: this.form.value.role.value,
                    reading: null,
                    displayColor: this.form.value.displayColor.value,
                    displayOrder: this.form.value.displayOrder,
                    }));
            } else {
                sensor.description = this.form.value.description;
                sensor.role  = this.form.value.role.value;
                sensor.displayColor = this.form.value.displayColor.value;
                sensor.displayOrder = this.form.value.displayOrder;
            }
            return false;
        })
        .then(() => {
            this.router.navigate(["/sensors"]);
        })
        .catch((error) => {
            this.alertService.setAlert("Error: could not save changes: " + error, "danger");
        });
    }

    public onCancel() {
        this.router.navigate(["/sensors"]);
    }

    private findOption(options: readonly IOption[], val: any): IOption {
        const result = options.find((r) => r.value === val);

        return result || options[0];
    }
}
