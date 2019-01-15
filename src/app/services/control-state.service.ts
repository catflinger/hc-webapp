import { Injectable, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable, BehaviorSubject } from "rxjs";

import { ControlState } from '../common/configuration/control-state';
import { INJECTABLES } from '../injection-tokens';

@Injectable({
    providedIn: 'root'
})
export class ControlStateService {

    private bSubject: BehaviorSubject<ControlState>;

    constructor(
        private http: HttpClient,
        @Inject(INJECTABLES.ApiBase) private baseUrl: string,
        ) {

        // default to a value of null for the initial config
        this.bSubject = <BehaviorSubject<ControlState>>new BehaviorSubject(null);
        this.refresh();
    }

    public getControlState(): Observable<ControlState> {
        return this.bSubject.asObservable();
    }

    public refresh(): void {
        this.http.get(this.baseUrl + "control-state")
        .pipe(map((data: any): ControlState => {
            return new ControlState(data.controlState);
        }))
        .subscribe((s) => {
            this.bSubject.next(s);
        });
    }
}
