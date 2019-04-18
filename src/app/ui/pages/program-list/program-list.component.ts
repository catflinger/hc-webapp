import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { IConfiguration, IProgram, IConfigurationM, IProgramM } from 'src/common/interfaces';
import { NamedConfig } from 'src/common/types';
import { Subscription } from 'rxjs';
import { AppContextService } from 'src/app/services/app-context.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { INamedProgramEvent } from '../../events';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-program-list',
    templateUrl: './program-list.component.html',
    styleUrls: ['./program-list.component.css']
})
export class ProgramListComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];

    public config: IConfiguration;
    public form: FormGroup;

    public programs: ReadonlyArray<IProgram> = [];

    private weekdayProgramName: string;
    private saturdayProgramName: string;
    private sundayProgramName: string;

    constructor(
        private configService: ConfigService,
        private appContextService: AppContextService,
        private alertService: AlertService,
        private router: Router,
        private fb: FormBuilder,
        ) {
            appContextService.clearContext();
        }

    ngOnInit() {
        this.alertService.clearAlerts();

        this.subs.push(this.configService.getObservable()
        .subscribe((config) => {
            // note: 1st time though config is likeley to be null if the source
            // for this is a behaviour subject
            if (config) {
                this.config = config;

                const weekdayProgram = this.getProgram(this.config.getNamedConfig().weekdayProgramId);
                const saturdayProgram = this.getProgram(this.config.getNamedConfig().saturdayProgramId);
                const sundayProgram = this.getProgram(this.config.getNamedConfig().sundayProgramId);

                this.weekdayProgramName = weekdayProgram ? weekdayProgram.name : "";
                this.saturdayProgramName = saturdayProgram ? saturdayProgram.name : "";
                this.sundayProgramName = sundayProgram ? sundayProgram.name : "";

                this.form = this.fb.group({
                    weekdayProgram: this.fb.control(weekdayProgram, [Validators.required]),
                    saturdayProgram: this.fb.control(saturdayProgram, [Validators.required]),
                    sundayProgram: this.fb.control(sundayProgram, [Validators.required])
                });

                this.programs = config.getProgramConfig();
            }
        }));
    }

    ngOnDestroy() {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    private getProgram(id: string): IProgram {
        return this.config.getProgramConfig().find((program) => program.id === id);
    }

    private onSetNamedProgram(event: INamedProgramEvent) {
        this.appContextService.setBusy();

        this.configService.updateConfig((config: IConfigurationM) => {
            config.namedConfig[event.name] = event.program.id;
            return false;
        })
        .then(() => this.appContextService.clearBusy())
        .then(this.alertService.createAlert(`Program ${event.program.name} set for ${event.displayName}`, "info"))
        .catch(() => {
            this.alertService.createAlert("Failed to set program", "danger");
            this.appContextService.clearBusy();
        });
    }

    private onDelete(id: string) {
        this.appContextService.setBusy();

        this.configService.updateConfig((config: IConfigurationM) => {

            const index = config.programConfig.findIndex((p: IProgramM) => p.id === id);
            if (index >= 0) {
                config.programConfig.splice(index, 1);
            } else {
                return true;
            }
        })
        .then(() => this.appContextService.clearBusy())
        .catch(this.alertService.createAlert("Failed to delete program", "danger"));
    }

    private onNewProgram() {
        this.router.navigate(["/program-new"]);
    }

    private onUseProgram(programId: string) {
        this.router.navigate(["/program-use", programId]);
    }

}
