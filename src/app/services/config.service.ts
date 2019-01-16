import { Injectable, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable, BehaviorSubject } from "rxjs";

import { Configuration } from '../../common/types';
import { INJECTABLES } from '../injection-tokens';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    private bSubject: BehaviorSubject<Configuration>;

    constructor(
        private http: HttpClient,
        @Inject(INJECTABLES.ApiBase) private baseUrl: string,
        ) {
            // default to a value of null for the initial config
            this.bSubject = <BehaviorSubject<Configuration>>new BehaviorSubject(null);
            this.refresh();
    }

    public getConfig(): Observable<Configuration> {
        return this.bSubject.asObservable();
    }

    public refresh(): void {
        this.http.get(this.baseUrl + "config")
        .pipe(map((data: any): Configuration => {
            //console.log("GOT CONFIG:" + JSON.stringify(data));
            return new Configuration(data.config);
        }))
        .subscribe((s) => {
            this.bSubject.next(s);
        });
    }
}
