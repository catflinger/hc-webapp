import { Component, OnInit, Input } from '@angular/core';
import { ISensorReading } from 'src/common/interfaces';

export class SensorReadingListOptions {
    public rolesOnly: boolean = false;
}

@Component({
    selector: 'app-sensor-reading-list',
    templateUrl: './sensor-reading-list.component.html',
    styleUrls: ['./sensor-reading-list.component.css']
})
export class SensorReadingListComponent implements OnInit {

    @Input()
    public readings: readonly ISensorReading[];

    @Input()
    public options: SensorReadingListOptions;

    constructor() { }

    ngOnInit() {
    }

    public sortedReadings(): ISensorReading[] {
        return this.readings
            .concat()
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .filter(r => this.options && this.options.rolesOnly ? r.role : true);
    }
}
