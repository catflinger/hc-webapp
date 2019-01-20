import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ConfigService } from 'src/app/services/config.service';
import { Subscription } from 'rxjs';
import { IConfiguration, IRule, IProgram } from 'src/common/interfaces';
import { BasicHeatingRule, TimeOfDay } from 'src/common/types';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fbind } from 'q';

@Component({
    selector: 'app-rule-edit',
    templateUrl: './rule-edit.component.html',
    styleUrls: ['./rule-edit.component.css']
})
export class RuleEditComponent implements OnInit {
    private subs: Subscription[] = [];
    private config: IConfiguration;
    private rule: IRule;
    private form: FormGroup;
    private params: Params;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private configService: ConfigService,
        private fb: FormBuilder,
    ) { }

    ngOnInit() {
        this.subs.push(this.configService.getConfig()
        .subscribe(
            (config: IConfiguration) => {
                if (config) {
                    let rule: IRule = null;
                    this.params = this.route.snapshot.params;

                    this.config = config;
                    let program: IProgram = this.config.getProgramConfig().find((p: IProgram) => { 
                        return p.id === this.params.id 
                    });
                    
                    if (program) {
                        rule = program.getRules().find((r) => { return r.id === this.params.ruleid });

                        if (rule) {
                            this.rule = rule;
                        } else {
                            this.rule = new BasicHeatingRule({
                                startTime: new TimeOfDay({ hour: 0, minute: 0, second: 0}),
                                endTime: new TimeOfDay({ hour: 0, minute: 0, second: 0}),
                            });
                        }

                        this.buildForm();
                    } else {
                        // TO DO: show some message here
                    }
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

    onSubmit(): void {
        const config: any = this.configService.getMutableCopy();

        const program = config.programConfig.find((p) => { return p.id === this.params.id; });
        if (program) {
            const rule: IRule = program.rules.find((r) => {
                return r.id === this.params.ruleid;
            });

            if (rule) {
                try {
                    rule.startTime = new TimeOfDay(this.form.value.startTime);
                    rule.endTime = new TimeOfDay(this.form.value.endTime);

                    this.configService.setConfig(config)
                    .then(() => {
                        // navigate
                        this.navigateToRulesPage();
                    })
                    .catch((error) => {
                        // to DO: report this somewhere
                        console.log("ERROR save rule A " + error);
                        this.navigateToRulesPage();
                    });
                } catch (err) {
                    // TO DO: notify the user
                    console.log("ERROR save rule B " + err);
                    this.navigateToRulesPage();
                }
            } else {
                // TO DO: notify someone somewhere
                console.log("ERROR save rule C");
                this.navigateToRulesPage();
            }
        } else {
                // TO DO: notify someone somewhere
                console.log("ERROR save rule D");
                this.navigateToRulesPage();
        }
    }

    onCancel(): void {
        this.navigateToRulesPage();
    }

    private buildForm(): void {
        this.form = this.fb.group({
            startTime: this.fb.control(this.rule.startTime.toString(), [Validators.required]),
            endTime: this.fb.control(this.rule.endTime.toString(), [Validators.required])
        });
    }

    private navigateToRulesPage() {
        this.router.navigate(["/program", this.params.id, "rules-edit"]);
    }
}
