import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ConfigService } from 'src/app/services/config.service';
import { Subscription } from 'rxjs';
import { IConfiguration, IRuleConfig, IProgram, IConfigurationM } from 'src/common/interfaces';
import { TimeOfDay } from 'src/common/types';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { RuleConfig } from 'src/common/configuration/rule-config';

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
    private rule: IRuleConfig;
    public form: FormGroup;
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
        private alertService: AlertService,
        private fb: FormBuilder,
    ) { }

    ngOnInit() {
        this.alertService.clearAlerts();

        this.subs.push(this.configService.getObservable()
        .subscribe(
            (config: IConfiguration) => {
                if (config) {
                    let rule: IRuleConfig = null;
                    this.params = this.route.snapshot.params;

                    this.config = config;
                    const program: IProgram = this.config.getProgramConfig().find((p: IProgram) => {
                        return p.id === this.params.id;
                    });

                    if (program) {
                        rule = program.getRules().find((r) => r.id === this.params.ruleid);

                        if (rule) {
                            this.rule = rule;
                        } else {
                            this.rule = new RuleConfig({
                                kind: "BasicHeatingRule",
                                data: null,
                                startTime: new TimeOfDay({ hour: 0, minute: 0, second: 0}),
                                endTime: new TimeOfDay({ hour: 0, minute: 0, second: 0}),
                            });
                        }

                        this.buildForm();
                    } else {
                        this.alertService.setAlert("Error: could not find progam in config", "danger");
                    }
                }
            },
            (err) => {
                this.config = undefined;
                this.alertService.setAlert("Error: could not load config: " + err, "danger");
            }
        ));
    }

    ngOnDestroy() {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    onSubmit(): void {
        this.configService.updateConfig((config: IConfigurationM) => {

            const program = config.programConfig.find((p) => p.id === this.params.id);
            if (program) {
                const rule: IRuleConfig = program.rules.find((r) => {
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
            this.alertService.setAlert("Error: could not save shanges: " + error, "danger");
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
        let index = 0;

        for (let i = 0; i < this.durations.length; i++) {
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
        let index = 0;

        for (let i = 0; i < this.minutes.length; i++) {
            index = i;
            if (this.minutes[i].value >= this.rule.startTime.minute) {
                break;
            }
        }
        return this.minutes[index];
    }
}
