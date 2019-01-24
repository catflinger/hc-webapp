import { Injectable, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable, BehaviorSubject, timer } from "rxjs";

import { INJECTABLES } from '../injection-tokens';
import { ISensorConfig } from '../../common/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SensorReadingService {
    private bSubject: BehaviorSubject<ISensorConfig[]>;

    constructor(
        private http: HttpClient,
        @Inject(INJECTABLES.ApiBase) private apiBase: string) {
        this.bSubject = <BehaviorSubject<ISensorConfig[]>>new BehaviorSubject([]);
        this.refresh();
    }

    public getReadings(): Observable<ISensorConfig[]> {
        return this.bSubject.asObservable();
    }

    public refresh(): void {
        this.http.get(this.apiBase + "sensor/configured")
        .pipe(map((data: any): ISensorConfig[] => {
            const result: ISensorConfig[] = [];
            data.sensors.forEach((data: any) => {
                result.push(data as ISensorConfig);
            });
            return result;
        }))
        .subscribe((s) => {
            this.bSubject.next(s);
        });
    }
}
