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
import { AppContext } from 'src/app/services/app-context';

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

        console.log(`onSetNamedProgram: [${optionName}] [${programId}]` );

        this.configService.updateConfig((config: IConfigurationM) => {
            config.namedConfig[optionName] = programId;
            return false;
        })
        .then(() => this.appContextService.clearBusy())
        .then(this.alertService.createAlert(`Program ${programId} set for ${optionName}`, "info"))
        .catch(() => {
            this.alertService.createAlert("Failed to set program", "danger");
            this.appContextService.clearBusy();
        });
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
        .then(() => this.appContextService.clearBusy())
        .catch(this.alertService.createAlert("Failed to delete program", "danger"));
    }

    public onNewProgram() {
        this.router.navigate(["/program-new"]);
    }

    public onUseProgram(programId: string) {
        this.router.navigate(["/program-use", programId]);
    }

}
