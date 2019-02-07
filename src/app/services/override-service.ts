import { Injectable, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable, BehaviorSubject, timer } from "rxjs";

import { INJECTABLES } from '../injection-tokens';
import { Override } from '../../common/types';

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

    public setOverride(minutes: number): Promise<void> {
        const result = this.http.put(this.apiBase + "override", { duration: minutes });
        return this.applyResult(result);
    }

    public clearOverrides(): Promise<void> {
        const result = this.http.delete(this.apiBase + "override");
        return this.applyResult(result);
    }

    public refresh(): Promise<void> {
        const result = this.http.get(this.apiBase + "override");
        return this.applyResult(result);
    }

    private applyResult(result: Observable<object>): Promise<void> {
        return result.toPromise<any>()
        .then((data: any) => {
            const result: Override[] = [];
            data.overrides.forEach((ovData: any) => {
                result.push(Override.fromObject(ovData));
            });
            this.bSubject.next(result);
            return Promise.resolve();
        });
    }
}
