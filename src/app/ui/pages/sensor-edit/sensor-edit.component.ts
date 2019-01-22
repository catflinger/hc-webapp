import { Component, OnInit } from '@angular/core';
import { AppContextService } from 'src/app/services/app-context.service';

@Component({
    selector: 'app-sensor-edit',
    templateUrl: './sensor-edit.component.html',
    styleUrls: ['./sensor-edit.component.css']
})
export class SensorEditComponent implements OnInit {

    constructor(private appContextService: AppContextService) {
        appContextService.clearContext();
    }

    ngOnInit() {
    }

}
