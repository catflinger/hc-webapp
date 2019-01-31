import { Component, OnInit, OnDestroy, AfterViewInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AppContextService } from 'src/app/services/app-context.service';
import { ConfigService } from 'src/app/services/config.service';
import { LogService } from 'src/app/services/log.service';
import { ILogExtract, IConfiguration } from 'src/common/interfaces';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ChartConfiguration } from 'chart.js';
import { LogChartDataAdapter } from '../../components/log-chart/log-chart-data-adapter';

@Component({
    selector: 'app-logger',
    templateUrl: './logger.component.html',
    styleUrls: ['./logger.component.css']
})
export class LoggerComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];
    private logExtract: ILogExtract;
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
        this.subs.push(this.configService.getConfig()
            .subscribe((config) => {
                this.config = config;
            }));

        this.subs.push(this.logService.getObservable()
            .subscribe((extract) => {
                this.logExtract = extract;
            }));
    }

    ngOnDestroy() {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    onDateSelect(ds: NgbDateStruct) {
        const from: Date = new Date(ds.year, ds.month, ds.day, 0, 0, 0);
        const to: Date = new Date(ds.year, ds.month, ds.day, 23, 59, 59);
        const sensors: string[] = this.config.getSensorConfig().map((sc) => sc.id);

        this.logService.refresh(from, to, sensors);
    }
}
