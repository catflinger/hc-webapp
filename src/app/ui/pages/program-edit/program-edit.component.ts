import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators, FormArray, AbstractControl, FormBuilder } from '@angular/forms';

import { ConfigService } from 'src/app/services/config.service';
import { IConfiguration, IProgram, IRule } from 'src/common/interfaces';
import { Program } from 'src/common/types';
import { Subscription } from 'rxjs';
import { AppContextService } from 'src/app/services/app-context.service';

@Component({
    selector: 'app-program-edit',
    templateUrl: './program-edit.component.html',
    styleUrls: ['./program-edit.component.css']
})
export class ProgramEditComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];
    private config: IConfiguration;
    private program: IProgram;
    private form: FormGroup;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private configService: ConfigService,
        private appContextService: AppContextService,
        private fb: FormBuilder,
    ) { }

    ngOnInit() {
        const programId = this.route.snapshot.params.id;

        this.appContextService.setProgramContext(programId);

        this.subs.push(this.configService.getConfig()
        .subscribe(
            (config: IConfiguration) => {
                if (config) {
                    this.config = config;
                    const program = this.config.getProgramConfig().find((p) => { 
                        return p.id === programId; 
                    });
                    
                    this.program = program ? program : new Program(null);

                    this.buildForm();
                }
            }, 
            (err) => {
                this.config = undefined;
                // TO DO: show message somewhere;
            }
        ));
    }

    ngOnDestroy() {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    private onSubmit() {
        const config: any = this.configService.getMutableCopy();
        const program: any = config.programConfig.find((p: any) => { return p.id === this.program.id});

        if (program) {
            program.maxHwTemp = this.form.value.maxHwTemp;
            program.minHwTemp = this.form.value.minHwTemp;

            this.configService.setConfig(config)
            .then(() => {
                this.router.navigate(["programs"]);
            })
            .catch((err) => {
                // to DO: display error somewhere
            });
        } else {
            // program is missing for some reason, this could happen
            // abort the operation
            this.router.navigate(["programs"]);
        }
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
            rules: this.fb.array([]),
        });

        this.program.getRules().forEach((rule: IRule) => {
            const controls = this.form.get("rules") as FormArray;
            controls.push(this.fb.group({
                startTime: [rule.startTime.toSeconds(), [Validators.required]],
                endTime: [rule.endTime.toSeconds(), [Validators.required]],
            }));
        });
    }
}
