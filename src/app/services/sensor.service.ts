import { Injectable, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

import { INJECTABLES } from '../injection-tokens';
import { ISensorConfig } from '../../common/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SensorService {

    constructor(
        private http: HttpClient,
        @Inject(INJECTABLES.ApiBase) private apiBase: string) {
        this.getReadings();
    }

    public getReadings(): Observable<ISensorConfig[]> {
        return this.http.get(this.apiBase + "sensor")
        .pipe(map((data: any): ISensorConfig[] => {
            const result: ISensorConfig[] = [];
            data.sensors.forEach((data: any) => {
                result.push(data as ISensorConfig);
            });
            return result;
        }));
    }
}
