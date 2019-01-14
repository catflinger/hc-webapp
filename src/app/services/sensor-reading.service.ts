import { Injectable, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable, BehaviorSubject, timer } from "rxjs";

import { INJECTABLES } from '../injection-tokens';
import { IReading } from 'src/app/common/types';

@Injectable({
  providedIn: 'root'
})
export class SensorReadingService {
    private bSubject: BehaviorSubject<IReading[]>;

    constructor(
        private http: HttpClient,
        @Inject(INJECTABLES.ApiBase) private apiBase: string) {
        this.bSubject = <BehaviorSubject<IReading[]>>new BehaviorSubject([]);
        this.refresh();
    }

    public getReadings(): Observable<IReading[]> {
        return this.bSubject.asObservable();
    }

    public refresh(): void {
        this.http.get(this.apiBase + "sensor/configured")
        .pipe(map((data: any): IReading[] => {
            const result: IReading[] = [];
            data.sensors.forEach((data: any) => {
                result.push(data as IReading);
            });
            return result;
        }))
        .subscribe((s) => {
            this.bSubject.next(s);
        });
    }
}
