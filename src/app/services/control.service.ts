import { Injectable, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { INJECTABLES } from '../injection-tokens';

@Injectable({
    providedIn: 'root'
})
export class ControlService {

    constructor(
        private http: HttpClient,
        @Inject(INJECTABLES.ApiBase) private baseUrl: string,
    ) 
    { }

    public hwBoost(): Promise<any> {
        return this.http.post(this.baseUrl + "control/hwboost", {})
        .toPromise();
    }
}
