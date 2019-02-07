import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppContextService } from 'src/app/services/app-context.service';
import { ISensorConfig } from 'src/common/interfaces';
import { SensorService } from 'src/app/services/sensor.service';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/services/config.service';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';

@Component({
    selector: 'app-sensor-list',
    templateUrl: './sensor-list.component.html',
    styleUrls: ['./sensor-list.component.css']
})
export class SensorListComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];
    private sensors: ReadonlyArray<ISensorConfig>;

    constructor(
        private appContextService: AppContextService,
        private sensorService: SensorService,
        private configService: ConfigService,
        private alertService: AlertService,
        private router: Router) {

        this.appContextService.clearContext();
    }

    ngOnInit() {
        this.alertService.clearAlerts();

        this.refresh();
    }

    ngOnDestroy() {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    private refresh() {
        this.sensors = [];
        this.ngOnDestroy();
        
        this.subs.push(this.sensorService.getReadings()
        .subscribe((readings) => {
            this.sensors = readings;
        }));
    }

    private onEdit(id: string) {
        this.router.navigate(["/sensor-edit", id]);
    }

    private onClear(id: string) {
        this.configService.updateConfig((config: any) => {
            let index: number = config.sensorConfig.findIndex((sc) => sc.id === id);
            if (index >= 0) {
                config.sensorConfig.splice(index, 1);
            } 
            return false;
        })
        .then(() => {
            this.refresh();
        })
        .catch(() => {
            // TO DO: show this somewhere
            console.log("ERROR: could not clear sensor");
        });
    }

}
