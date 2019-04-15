import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ConfigService } from 'src/app/services/config.service';
import { IConfiguration, IProgram, IRuleConfig } from 'src/common/interfaces';
import { Program } from 'src/common/types';
import { Subscription } from 'rxjs';
import { AppContextService } from 'src/app/services/app-context.service';
import { AppContext } from 'src/app/services/app-context';
import { AlertService } from 'src/app/services/alert.service';
import { RuleConfig } from 'src/common/configuration/rule-config';


@Component({
  selector: 'app-rules-edit',
  templateUrl: './rules-edit.component.html',
  styleUrls: ['./rules-edit.component.css']
})
export class RulesEditComponent implements OnInit , OnDestroy {
    private subs: Subscription[] = [];
    private config: IConfiguration;
    public program: IProgram;
    public rules: ReadonlyArray<IRuleConfig>;
    private appContext: AppContext;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private configService: ConfigService,
        private appContextService: AppContextService,
        private alertService: AlertService,
    ) {
        appContextService.getAppContext().subscribe((ac) => {
            this.appContext = ac;
        });
    }

    ngOnInit() {
        this.alertService.clearAlerts();

        const programId = this.route.snapshot.params.id;
        this.appContextService.setProgramContext(programId);

        this.subs.push(this.configService.getObservable()
        .subscribe(
            (config: IConfiguration) => {
                if (config) {
                    this.config = config;
                    const program = this.config.getProgramConfig().find((p) => {
                        return p.id === programId;
                    });

                    this.program = program ? program : new Program(null);
                    this.rules = program.getRules();
                }
            },
            (err) => {
                this.alertService.createAlert("Error: could not load config: " + err, "danger");
            }
        ));
    }

    ngOnDestroy() {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    private onCardSelect(rule: IRuleConfig): void {
        this.appContextService.setRuleContext(rule.id);
    }

    private onEdit(rule: IRuleConfig) {
        this.navigateToRuleEdit(rule.id);
    }

    private onDelete(rule: IRuleConfig) {

        this.configService.updateConfig((config: any) => {
            let cancel = true;
            const program = config.programConfig.find((p) => p.id === this.program.id);
            if (program) {
                program.rules = program.rules.filter((r) => {
                    return r.id !== rule.id;
                });
                cancel = false;
            }
            return cancel;
        })
        .then(() => {
            // stay on this page
        })
        .catch((error) => {
            this.alertService.createAlert("Error: could not update rules: " + error, "danger");
        });
    }

    private onClose() {
        this.router.navigate(["programs"]);
    }

    private onAdd() {
        let ruleId: string = null;

        this.configService.updateConfig((config: any) => {
            const program = config.programConfig.find((p) => p.id === this.program.id);
            if (program) {
                const rule = new RuleConfig({
                    kind: "BasicHeatingRule",
                    data: null,
                    startTime: { hour: 0, minute: 0, second: 0 },
                    endTime: { hour: 0, minute: 0, second: 0 },
                });
                ruleId = rule.id;
                program.rules.push(rule);
            } else {
                throw new Error("could not find program to add rule to");
            }
            return false;
        })
        .then(() => {
            this.navigateToRuleEdit(ruleId);
        })
        .catch((error) => {
            this.alertService.createAlert("Error: could not update rule: " + error, "danger");
        });
    }

    private onChartClick(event: string[]) {
        if (event && event.length) {
            this.appContextService.setRuleContext(event[0]);
        } else {
            this.appContextService.clearRuleContext();
        }
    }

    private navigateToRuleEdit(id: string) {
        this.router.navigate(["program", this.program.id, "rules-edit", id]);
    }
}
