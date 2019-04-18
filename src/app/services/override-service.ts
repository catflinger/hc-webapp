import { Injectable, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";

import { INJECTABLES } from '../injection-tokens';
import { Override } from '../../common/types';
import { OverrideApiResponse } from 'src/common/api/override-api-response';

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

    public getObservable(): Observable<Override[]> {
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
        return result.toPromise<object>()
        .then((data: object) => {
            const apiResponse = new OverrideApiResponse(data);
            this.bSubject.next(apiResponse.overrides);
            return Promise.resolve();
        });
    }
}
