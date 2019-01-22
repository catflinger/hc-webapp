import { Component, OnInit } from '@angular/core';
import { AppContextService } from 'src/app/services/app-context.service';

@Component({
    selector: 'app-sensor-list',
    templateUrl: './sensor-list.component.html',
    styleUrls: ['./sensor-list.component.css']
})
export class SensorListComponent implements OnInit {

    constructor(private appContextService: AppContextService) {
        appContextService.clearContext();
    }

    ngOnInit() {
    }

}
