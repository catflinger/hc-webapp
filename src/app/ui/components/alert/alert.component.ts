import { Component, OnInit, OnDestroy, OnChanges, Input, ChangeDetectorRef } from '@angular/core';
import { AlertService, IAlert } from 'src/app/services/alert.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];
    public alert: IAlert = null;

    constructor(
        private alertService: AlertService,
        ) {}

    ngOnInit(): void {
        this.subs.push(
            this.alertService.getObservable().subscribe((alert) => {
                this.alert = alert;
                this.scrollToAlert();
            })
        );
    }

    public ngOnDestroy() {
        this.subs.forEach((s) => s.unsubscribe());
    }

    private onCloseAlert(alert: IAlert) {
        this.alertService.clearAlerts();
    }

    private scrollToAlert() {
        const el = document.getElementById("alertContainer");
        if (el) {
            el.scrollIntoView(false);
        }
    }
}
