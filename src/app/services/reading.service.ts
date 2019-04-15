import { Injectable, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable, BehaviorSubject } from "rxjs";

import { INJECTABLES } from '../injection-tokens';
import { ISensorReading } from '../../common/interfaces';
import { SensorApiResponse } from 'src/common/api/sensor-api-response';

@Injectable({
  providedIn: 'root'
})
export class ReadingService {
    private bSubject: BehaviorSubject<ISensorReading[]>;

    constructor(
        private http: HttpClient,
        @Inject(INJECTABLES.ApiBase) private apiBase: string) {

        this.bSubject = new BehaviorSubject<ISensorReading[]>([]);
        this.refresh();
    }

    public getObservable(): Observable<ISensorReading[]> {
        return this.bSubject.asObservable();
    }

    public getReadings(): ISensorReading[] {
        return this.bSubject.value;
    }

    public refresh(): Promise<void> {
        return this.http.get(this.apiBase + "sensor")
        .pipe(map((data: any): void => {
            const apiResponse = new SensorApiResponse(data);
            this.bSubject.next(apiResponse.sensors);
        }))
        .toPromise();
    }
}
