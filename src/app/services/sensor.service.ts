import { Injectable, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable, BehaviorSubject } from "rxjs";

import { INJECTABLES } from '../injection-tokens';
import { ISensorConfig } from '../../common/interfaces';
import { SensorApiResponse } from 'src/common/api/sensor-api-response';

@Injectable({
  providedIn: 'root'
})
export class SensorService {
    private bSubject: BehaviorSubject<ISensorConfig[]>;

    constructor(
        private http: HttpClient,
        @Inject(INJECTABLES.ApiBase) private apiBase: string) {

        this.bSubject = new BehaviorSubject<ISensorConfig[]>([]);
        this.getReadings();
    }

    public getObservable(): Observable<ISensorConfig[]> {
        return this.bSubject.asObservable();
    }

    public getReadings(): ISensorConfig[] {
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
