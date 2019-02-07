import { Component, OnInit } from '@angular/core';
import { AppContextService } from 'src/app/services/app-context.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
    selector: 'app-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

    constructor(private appContextService: AppContextService, private alertService: AlertService) {
        appContextService.clearContext();
    }

    ngOnInit() {
        this.alertService.clearAlerts();
    }

}
