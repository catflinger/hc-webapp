import { Injectable, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable, BehaviorSubject } from "rxjs";


import { INJECTABLES } from './injection-tokens';
import { IReading } from 'src/app/common/types';

@Injectable({
  providedIn: 'root'
})
export class SensorReadingService {

    private bSubject: BehaviorSubject<IReading[]>;

    constructor(
        private http: HttpClient,
        @Inject(INJECTABLES.API_BASE_URL) private apiBaseUrl: string
        ) {
            // default to a value of null for the initial config
            this.bSubject = <BehaviorSubject<IReading[]>>new BehaviorSubject([]);
            this.refresh();
            //setInterval(() => this.refresh(), 60000);
    }

    public getReadings(): Observable<IReading[]> {
        return this.bSubject.asObservable();
    }

    public refresh(): void {
        this.http.get(this.apiBaseUrl + "sensor/configured")
        .pipe(map((data: any): IReading[] => {
            console.log(JSON.stringify(data, null, 4 ));
            const result: IReading[] = [];
            data.sensors.forEach((sensorData) => {
                result.push(sensorData);
            });
            return result;
        }))
        .subscribe((s) => {
            this.bSubject.next(s);
        });
    }

}
