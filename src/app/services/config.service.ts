import { Injectable, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable, BehaviorSubject } from "rxjs";

import { INJECTABLES } from './injection-tokens';
import { IConfiguration } from 'src/app/common/types';
import { Configuration } from 'src/app/common/configuration/configuration';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    private bSubject: BehaviorSubject<IConfiguration>;

    constructor(
        private http: HttpClient,
        @Inject(INJECTABLES.API_BASE_URL) private apiBaseUrl: string
        ) {
            // default to a value of null for the initial config
            this.bSubject = <BehaviorSubject<IConfiguration>>new BehaviorSubject(null);
            this.refresh();
            //setInterval(() => this.refresh(), 60000);
            
    }

    public getConfig(): Observable<IConfiguration> {
        return this.bSubject.asObservable();
    }

    public refresh(): void {
        this.http.get(this.apiBaseUrl + "config")
        .pipe(map((data: any): Configuration => {
            return new Configuration(data.config);
        }))
        .subscribe((s) => {
            this.bSubject.next(s);
        });
    }
}
