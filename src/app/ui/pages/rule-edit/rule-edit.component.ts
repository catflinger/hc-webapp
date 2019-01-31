import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ConfigService } from 'src/app/services/config.service';
import { Subscription } from 'rxjs';
import { IConfiguration, IRule, IProgram } from 'src/common/interfaces';
import { BasicHeatingRule, TimeOfDay } from 'src/common/types';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

class Option {
    constructor(
        public text: string,
        public value: number,
    ) {}
}

@Component({
    selector: 'app-rule-edit',
    templateUrl: './rule-edit.component.html',
    styleUrls: ['./rule-edit.component.css']
})
export class RuleEditComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];
    private config: IConfiguration;
    private rule: IRule;
    private form: FormGroup;
    private params: Params;

    private hours: Option[] = Array.from({length: 24}, (v, k) => new Option(k.toString(), k));
    private minutes: Option[] = Array.from({length: 6}, (v, k) => new Option((k * 10).toString(), k * 10));
    private durations: Option[] = [
        { text: "30 minues", value: 30 },
        { text: "1 hour", value: 60 },
        { text: "2 hours", value: 120 },
        { text: "3 hours", value: 180 },
        { text: "4 hours", value: 240 },
    ] ;

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
        this.configService.updateConfig((config: any) => {

            const program = config.programConfig.find((p) => { return p.id === this.params.id; });
            if (program) {
                const rule: IRule = program.rules.find((r) => {
                    return r.id === this.params.ruleid;
                });

                if (rule) {
                    const startHour: number = this.form.value.startHour.value;
                    const startMinute: number = this.form.value.startMinute.value;
                    const duration: number = this.form.value.duration.value;

                    rule.startTime = new TimeOfDay({hour: startHour, minute: startMinute, second: 0});
                    rule.endTime = new TimeOfDay(rule.startTime.addMinutes(duration));
                } else {
                    throw new Error("Could not find rule for editing");
                }
            } else {
                throw new Error("Could not find program for editing rule");
            }
            return false;
        })
        .then(() => {
            // navigate
            this.navigateToRulesPage();
        })
        .catch((error) => {
            // to DO: report this somewhere
            console.log("ERROR updating rule" + error)
            this.navigateToRulesPage();
        });
    }

    onCancel(): void {
        this.navigateToRulesPage();
    }

    private buildForm(): void {

        this.form = this.fb.group({
            startHour: this.fb.control(this.getHourOption(), [Validators.required]),
            startMinute: this.fb.control(this.getMinuteOption(), [Validators.required]),
            duration: this.fb.control(this.getDurationOption(), [Validators.required])
        });
    }

    private navigateToRulesPage() {
        this.router.navigate(["/program", this.params.id, "rules-edit"]);
    }

    private getDurationOption(): Option {
        const seconds = this.rule.endTime.toSeconds() - this.rule.startTime.toSeconds();
        const minutes = Math.trunc(seconds / 60);
        let index: number = 0;

        for (let i: number = 0; i < this.durations.length; i++) {
            index = i;
            if (this.durations[i].value >= minutes) {
                break;
            }
        }
        return this.durations[index];
    }

    private getHourOption(): Option {
        return this.hours[this.rule.startTime.hour];
    }

    private getMinuteOption(): Option {
        let index: number = 0;

        for (let i: number = 0; i < this.minutes.length; i++) {
            index = i;
            if (this.minutes[i].value >= this.rule.startTime.minute) {
                break;
            }
        }
        return this.minutes[index];
    }
}