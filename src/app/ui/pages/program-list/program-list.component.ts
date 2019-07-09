import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { IConfiguration, IDatedConfigM, IProgram, IConfigurationM, IProgramM, IDatedConfig } from 'src/common/interfaces';
import { Subscription } from 'rxjs';
import { AppContextService } from 'src/app/services/app-context.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { AppContext } from 'src/app/services/app-context';
import { ControlStateService } from 'src/app/services/control-state.service';

@Component({
    selector: 'app-program-list',
    templateUrl: './program-list.component.html',
    styleUrls: ['./program-list.component.css']
})
export class ProgramListComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];

    public config: IConfiguration;
    public appContext: AppContext;

    public programs: ReadonlyArray<IProgram> = [];

    constructor(
        private configService: ConfigService,
        private appContextService: AppContextService,
        private controlStateService: ControlStateService,
        private alertService: AlertService,
        private router: Router,
        ) {
            appContextService.clearContext();
        }

    ngOnInit() {
        this.alertService.clearAlerts();
        this.appContextService.clearBusy();

        this.subs.push(this.configService.getObservable()
        .subscribe((config) => {
            // note: 1st time though config is likeley to be null if the source
            // for this is a behaviour subject
            if (config) {
                this.config = config;
                this.programs = config.getProgramConfig();
            }
        }));

        this.subs.push(this.appContextService.getAppContext()
        .subscribe((appContext) => {
            this.appContext = appContext;
        }));
    }

    ngOnDestroy() {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    public onSetNamedProgram(optionName: string, programId: string) {

        this.appContextService.setBusy();

        this.configService.updateConfig((config: IConfigurationM) => {
            config.namedConfig[optionName] = programId;
            return false;
        })
        .then(() => {
            const program: IProgram = this.programs.find((p: IProgram) => p.id === programId);
            this.alertService.setAlert(`Program ${program.name} set for ${optionName}`, "info");
        })
        .catch(this.alertService.createCallback("Failed to set program", "danger"))
        .then(() => this.appContextService.clearBusy())
        .then(() => this.configService.refresh());
    }

    public onDelete(id: string) {
        this.appContextService.setBusy();

        this.configService.updateConfig((config: IConfigurationM) => {

            const index = config.programConfig.findIndex((p: IProgramM) => p.id === id);
            if (index >= 0) {
                config.programConfig.splice(index, 1);
            } else {
                return true;
            }
        })
        .catch(this.alertService.createCallback("Failed to delete program", "danger"))
        .then(() => this.appContextService.clearBusy());
    }

    public onNewProgram() {
        this.router.navigate(["/program-new"]);
    }

    public onUseProgram(programId: string) {
        this.router.navigate(["/program-use", programId]);
    }

    public onDeleteDatedProgram(datedConfig: IDatedConfig) {
        this.appContextService.setBusy();

        this.configService.updateConfig((config: IConfigurationM) => {

            const index = config.datedConfig.findIndex((dc: IDatedConfigM) => {
                return dc.programId === datedConfig.programId &&
                        dc.dayOfYear.year === datedConfig.dayOfYear.year &&
                        dc.dayOfYear.month === datedConfig.dayOfYear.month &&
                        dc.dayOfYear.day === datedConfig.dayOfYear.day;
            });

            if (index >= 0) {
                config.datedConfig.splice(index, 1);
            } else {
                return true;
            }
        })
        .catch(this.alertService.createCallback("Failed to delete dated program", "danger"))
        .then(() => this.appContextService.clearBusy())
        .then(() => this.controlStateService.refresh());
    }

    public getProgramName(id: string): string {
        return this.config.getProgramConfig().find((p) => p.id === id).name;
    }
}
