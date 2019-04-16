import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IConfiguration, IProgram } from 'src/common/interfaces';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigService } from 'src/app/services/config.service';
import { AppContextService } from 'src/app/services/app-context.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
    selector: 'app-program-use',
    templateUrl: './program-use.component.html',
    styleUrls: ['./program-use.component.css']
})
export class ProgramUseComponent implements OnInit {
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
                        this.program = this.config.getProgramConfig().find((p) => {
                            return p.id === this.programId;
                        });

                        if (!this.program) {
                            this.alertService.setAlert("Failed to get configuration data", "danger");
                        }
                    }
                },
                this.alertService.createAlert("Failed to get configuration data", "danger")
            ));
    }

    ngOnDestroy() {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

}
