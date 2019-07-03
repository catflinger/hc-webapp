import { Component, OnInit, Input } from '@angular/core';
import { ISensorReading } from 'src/common/interfaces';

@Component({
    selector: 'app-sensor-reading-list',
    templateUrl: './sensor-reading-list.component.html',
    styleUrls: ['./sensor-reading-list.component.css']
})
export class SensorReadingListComponent implements OnInit {

    @Input()
    public readings: ISensorReading[];

    constructor() { }

    ngOnInit() {
    }

    public sortedReadings(): ISensorReading[] {
        return this.readings.concat().sort(
            (a, b) => a.displayOrder - b.displayOrder
        );
    }
}
