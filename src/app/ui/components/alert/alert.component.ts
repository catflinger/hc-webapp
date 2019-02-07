import { Component, OnInit, OnDestroy, OnChanges, Input } from '@angular/core';
import { AlertService, IAlert } from 'src/app/services/alert.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];
    private alert: IAlert = null;

    constructor(private alertService: AlertService) {}

    ngOnInit(): void {
        this.subs.push(
            this.alertService.getObservable().subscribe((alert) => {
                this.alert = alert;
            })
        );
    }

    public ngOnDestroy() {
        this.subs.forEach((s) => s.unsubscribe());
    }

    private onCloseAlert(alert: IAlert) {
        this.alertService.clearAlerts();
    }
}
