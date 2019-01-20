import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ConfigService } from 'src/app/services/config.service';
import { IConfiguration, IProgram, IRule } from 'src/common/interfaces';
import { Program, BasicHeatingRule } from 'src/common/types';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-rules-edit',
  templateUrl: './rules-edit.component.html',
  styleUrls: ['./rules-edit.component.css']
})
export class RulesEditComponent implements OnInit , OnDestroy {
    private subs: Subscription[] = [];
    private config: IConfiguration;
    private program: IProgram;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private configService: ConfigService,
    ) { }

    ngOnInit() {
        this.subs.push(this.configService.getConfig()
        .subscribe(
            (config: IConfiguration) => {
                if (config) {
                    this.config = config;
                    const program = this.config.getProgramConfig().find((p) => { 
                        return p.id === this.route.snapshot.params.id; 
                    });
                    
                    this.program = program ? program : new Program(null);
                }
            }, 
            (err) => {
                this.config = undefined;
                // TO DO: show message somewhere;
                console.log("ERROR in rules-edit-component");
            }
        ));
    }

    ngOnDestroy() {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    private onEdit(rule:IRule) {
        this.navigateToRuleEdit(rule.id);
    }

    private onDelete(rule:IRule) {
        const config: any = this.configService.getMutableCopy();

        const program = config.programConfig.find((p) => { return p.id === this.program.id; });
        if (program) {
            program.rules = program.rules.filter((r) => {
                return r.id !== rule.id;
            });

           this.configService.setConfig(config)
            .then(() => {
                // stay on this page
            })
            .catch((error) => {
                // to DO: report this somewhere
                console.log("ERROR saving changes");
            });
        }
    }

    private onClose() {
        this.router.navigate(["programs"]);
    }

    private onAdd() {
        const config: any = this.configService.getMutableCopy();

        const program = config.programConfig.find((p) => { return p.id === this.program.id; });
        if (program) {
            const rule = new BasicHeatingRule({
                startTime: { hour: 0, minute: 0, second: 0 }, 
                endTime: { hour: 0, minute: 0, second: 0 }, 
            });
            program.rules.push(rule);

            this.configService.setConfig(config)
            .then(() => {
                this.navigateToRuleEdit(rule.id);
            })
            .catch((error) => {
                // to DO: report this somewhere
            });
        }
    }

    private navigateToRuleEdit(id: string) {
        this.router.navigate(["program", this.program.id, "rules-edit", id]);
    }
}
