import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AppContextService } from 'src/app/services/app-context.service';
import { ConfigService } from 'src/app/services/config.service';
import { LogService } from 'src/app/services/log.service';
import { ILogExtract, IConfiguration } from 'src/common/interfaces';

@Component({
    selector: 'app-logger',
    templateUrl: './logger.component.html',
    styleUrls: ['./logger.component.css']
})
export class LoggerComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];
    private extract: ILogExtract;
    private config: IConfiguration;

    constructor(
        private appContextService: AppContextService,
        private logService: LogService,
        private configService: ConfigService,
        private router: Router
    ) { 
        this.appContextService.clearContext();
    }

    ngOnInit() {
        this.subs.push(this.configService.getConfig().subscribe((config) => {
            this.config = config;
            if (config) {
                this.refresh();
            }
        }));
    }

    ngOnDestroy() {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    private refresh() {
        this.extract = undefined;
        this.ngOnDestroy();

        const from: Date = new Date("2019-01-01T00:00:00");
        const to: Date = new Date("2019-12-31T23:59:59");
        const sensors: string[] = this.config.getSensorConfig().map((sc) => sc.id);
        
        this.subs.push(this.logService.getLogExtract(from, to, sensors)
        .subscribe((logExtract) => {
            this.extract = logExtract;
        }));
    }
}
