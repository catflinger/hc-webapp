import { Component, OnInit, OnDestroy } from '@angular/core';
import { timer, Subscription } from 'rxjs';

import { ReadingService } from 'src/app/services/reading.service';
import { SensorService } from 'src/app/services/sensor.service';
import { ConfigService } from 'src/app/services/config.service';
import { ControlStateService } from 'src/app/services/control-state.service';
import { OverrideService } from 'src/app/services/override-service';
import { environment } from "src/environments/environment";

const oneMintue = 60 * 1000;

const shortPollInterval = 2 * oneMintue;
const longPollInterval = 10 * oneMintue;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];

    constructor(
        private readingService: ReadingService,
        private configService: ConfigService,
        private controlStateService: ControlStateService,
        private overrideService: OverrideService,
        ) {}

    public ngOnInit() {

        if (environment.poll) {
            this.subs.push(
                timer(shortPollInterval, shortPollInterval)
                .subscribe(() => {
                    this.readingService.refresh();
                    this.controlStateService.refresh();
                    this.overrideService.refresh();
                })
            );

            this.subs.push(
                timer(longPollInterval, longPollInterval)
                .subscribe(() => {
                    this.configService.refresh();
                })
            );
        }
    }

    public ngOnDestroy() {
        this.subs.forEach((s) => s.unsubscribe());
    }
}
