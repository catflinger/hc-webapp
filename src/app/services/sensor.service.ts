import { Injectable } from '@angular/core';
import { ISensorConfig, IConfiguration, ISensorReading } from 'src/common/interfaces';
import { ReadingService } from './reading.service';
import { Observable, combineLatest } from 'rxjs';
import { ConfigService } from './config.service';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SensorService {

    private combined: Observable<[IConfiguration, ISensorReading[]]>;

    constructor(
        private readingService: ReadingService,
        private configService: ConfigService) {

        this.combined = combineLatest(this.configService.getObservable(), this.readingService.getObservable());
    }

    public getObservable(): Observable<ISensorConfig[]> {
        return this.combined.pipe(
            map<[ IConfiguration, ISensorReading[]], ISensorConfig[]>( (source) => {
                const sensors: ISensorConfig[] = [];

                if (source[0] && source[1]) {
                    source[0].getSensorConfig().forEach((sensor) => {
                        const reading = source[1].find((reading) => reading.id === sensor.id);
                        if (reading) {
                            sensor.reading = reading.reading; 
                        }
                        sensors.push(sensor);
                    });
                }
                return sensors;
            })
        ); 
    }
}
