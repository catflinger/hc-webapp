import { Component, OnInit } from '@angular/core';
import { AppContextService } from 'src/app/services/app-context.service';

@Component({
    selector: 'app-status',
    templateUrl: './status.component.html',
    styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

    constructor(private appContextService: AppContextService) {
        appContextService.clearContext();
    }

    ngOnInit() {
    }

}
