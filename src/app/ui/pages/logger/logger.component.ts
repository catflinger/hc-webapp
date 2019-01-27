import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AppContextService } from 'src/app/services/app-context.service';
import { ConfigService } from 'src/app/services/config.service';
import { LogService } from 'src/app/services/log.service';
import { ILogExtract } from 'src/common/interfaces';

@Component({
    selector: 'app-logger',
    templateUrl: './logger.component.html',
    styleUrls: ['./logger.component.css']
})
export class LoggerComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];
    private extract: ILogExtract;

    constructor(
        private appContextService: AppContextService,
        private logService: LogService,
        private configService: ConfigService,
        private router: Router
    ) { 
        this.appContextService.clearContext();
    }

    ngOnInit() {
        this.refresh();
    }

    ngOnDestroy() {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    private refresh() {
        this.extract = undefined;
        this.ngOnDestroy();
        
        this.subs.push(this.logService.getLogExtract()
        .subscribe((logExtract) => {
            this.extract = logExtract;
        }));
    }
}
