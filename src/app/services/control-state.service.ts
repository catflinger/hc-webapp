import { Injectable, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable, BehaviorSubject } from "rxjs";

import { INJECTABLES } from '../injection-tokens';
import { IControlStateApiResponse } from '../../../src/common/interfaces';
import { ControlStateApiResponse } from "../../../src/common/api/control-state-api-response";

@Injectable({
    providedIn: 'root'
})
export class ControlStateService {

    private bSubject: BehaviorSubject<IControlStateApiResponse>;

    constructor(
        private http: HttpClient,
        @Inject(INJECTABLES.ApiBase) private baseUrl: string,
        ) {

        // default to a value of null for the initial config
        this.bSubject = <BehaviorSubject<IControlStateApiResponse>>new BehaviorSubject(null);
        this.refresh();
    }

    public getObservable(): Observable<IControlStateApiResponse> {
        return this.bSubject.asObservable();
    }

    public refresh(): void {
        this.http.get(this.baseUrl + "control-state")
        .pipe(map((data: any): IControlStateApiResponse => {
            return new ControlStateApiResponse(data);
        }))
        .subscribe((s) => {
            this.bSubject.next(s);
        });
    }
}
