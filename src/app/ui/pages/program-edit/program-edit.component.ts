import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators, FormArray, AbstractControl, FormBuilder } from '@angular/forms';

import { ConfigService } from 'src/app/services/config.service';
import { IConfiguration, IProgram, IConfigurationM, IProgramM } from 'src/common/interfaces';
import { Program } from 'src/common/types';
import { Subscription } from 'rxjs';
import { AppContextService } from 'src/app/services/app-context.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
    selector: 'app-program-edit',
    templateUrl: './program-edit.component.html',
    styleUrls: ['./program-edit.component.css']
})
export class ProgramEditComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];
    public config: IConfiguration;
    private program: IProgram;
    private form: FormGroup;
    private programId: string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private configService: ConfigService,
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
                    this.config = config;
                    if (this.programId) {
                        this.program = this.config.getProgramConfig().find((p) => {
                            return p.id === this.programId;
                        });
                    } else {
                        this.program = new Program();
                    }

                    if (this.program) {
                        this.buildForm();
                    } else {
                        this.config = undefined;
                        this.alertService.setAlert("Failed to get configuration data", "danger");
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

    private onSubmit() {
        let newProgramId: string = null;

        this.configService.updateConfig((config: IConfigurationM) => {

            let program: IProgramM;

            if (this.programId) {
                program = config.programConfig.find((p: IProgramM) => p.id === this.program.id);
            } else {
                program = new Program().toMutable();
                newProgramId = program.id;
                config.programConfig.push(program);
            }

            if (program) {
                program.name = this.form.value.name;
                program.maxHwTemp = this.form.value.maxHwTemp;
                program.minHwTemp = this.form.value.minHwTemp;
            } else {
                throw new Error("program not found");
            }

            return false;
        })
        .then((config) => {
            if (this.programId) {
                this.router.navigate(["programs"]);
            } else {
                this.router.navigate(["/program", newProgramId, "rules-edit"]);
            }
        })
        .catch((err) => {
            this.alertService.setAlert("Error posting form " + err, "danger");
        });
    }

    private onCancel() {
        this.router.navigate(["programs"]);
    }

    private buildForm() {
        const p = this.program;

        this.form = this.fb.group({
            id: p.id,
            name: [p.name, [Validators.required]],
            maxHwTemp: [p.maxHwTemp, [Validators.required]],
            minHwTemp: [p.minHwTemp, [Validators.required]],
        });
    }
}
