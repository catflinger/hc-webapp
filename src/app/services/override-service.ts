import { Injectable, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable, BehaviorSubject, timer } from "rxjs";

import { INJECTABLES } from '../injection-tokens';
import { Override } from '../common/configuration/override';

@Injectable({
  providedIn: 'root'
})
export class OverrideService {
    private bSubject: BehaviorSubject<Override[]>;

    constructor(
        private http: HttpClient,
        @Inject(INJECTABLES.ApiBase) private apiBase: string) {
        this.bSubject = <BehaviorSubject<Override[]>>new BehaviorSubject([]);
        this.refresh();
    }

    public getOverrides(): Observable<Override[]> {
        return this.bSubject.asObservable();
    }

    public setOverride(minutes: number): void {
        const result = this.http.put(this.apiBase + "override", { duration: minutes });
        this.applyResult(result);
    }

    public clearOverrides(): void {
        const result = this.http.delete(this.apiBase + "override");
        this.applyResult(result);
    }

    public refresh(): void {
        const result = this.http.get(this.apiBase + "override");
        this.applyResult(result);
    }

    private applyResult(result: Observable<object>): void {
        result.pipe(map((data: any): Override[] => {
            const result: Override[] = [];
            data.overrides.forEach((data: any) => {
                result.push(data as Override);
            });
            return result;
        }))
        .subscribe((s) => {
            this.bSubject.next(s);
        });
    }
}
