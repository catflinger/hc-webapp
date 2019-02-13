import { Component, OnInit, OnDestroy } from '@angular/core';
import { SensorService } from 'src/app/services/sensor.service';
import { timer, Subscription } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { ControlStateService } from 'src/app/services/control-state.service';
import { OverrideService } from 'src/app/services/override-service';

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
        private sensorService: SensorService,
        private configService: ConfigService,
        private controlStateService: ControlStateService,
        private overrideService: OverrideService,
        ) {}

    public ngOnInit() {

        this.subs.push(
            timer(shortPollInterval, shortPollInterval)
            .subscribe(() => {
                this.sensorService.refresh();
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

    public ngOnDestroy() {
        this.subs.forEach((s) => s.unsubscribe());
    }
}
