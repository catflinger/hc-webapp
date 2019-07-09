import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IConfiguration, IProgram, IConfigurationM } from 'src/common/interfaces';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigService } from 'src/app/services/config.service';
import { AppContextService } from 'src/app/services/app-context.service';
import { AlertService } from 'src/app/services/alert.service';
import { DatedConfig } from 'src/common/types';
import { ControlStateService } from 'src/app/services/control-state.service';
import { DayOfYear } from 'src/common/configuration/day-of-year';

@Component({
    selector: 'app-program-use',
    templateUrl: './program-use.component.html',
    styleUrls: ['./program-use.component.css']
})
export class ProgramUseComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];
    public config: IConfiguration;
    public program: IProgram;
    private form: FormGroup;
    private programId: string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private configService: ConfigService,
        private controlStateService: ControlStateService,
        private appContextService: AppContextService,
        private alertService: AlertService,
        private fb: FormBuilder,
    ) { }

    ngOnInit() {
        this.alertService.clearAlerts();
        this.programId = this.route.snapshot.params.id;
        this.appContextService.setProgramContext(this.programId);

        this.subs.push(this.configService.getObservable()
            .subscribe(
                (config: IConfiguration) => {
                    if (config) {
                        if (!config) {
                            this.alertService.setAlert("Failed to get configuration data", "danger");
                        } else {
                            this.config = config;

                            this.program = this.config.getProgramConfig().find((p) => {
                                return p.id === this.programId;
                            });

                            this.form = this.fb.group({
                                startDate: this.fb.control(new Date(), [Validators.required]),
                            });

                        }
                    }
                },
                this.alertService.createCallback("Failed to get configuration data", "danger")
            ));
    }

    ngOnDestroy() {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    onSubmit() {
        if (this.form.valid) {

            this.appContextService.setBusy();

            this.configService.updateConfig((config: IConfigurationM): boolean => {
                config.datedConfig.push(new DatedConfig({
                    programId: this.program.id,
                    dayOfYear: new DayOfYear(this.form.value.startDate),
                }));
                return false;
            })
            .then(() => this.router.navigate(["/programs"]))
            .catch(this.alertService.createCallback("failed to save changes", "danger"))
            .then(() => this.appContextService.clearBusy())
            .then(() => this.controlStateService.refresh());
        }
    }

    onCancel() {
        this.router.navigate(["/programs"]);
    }

}
