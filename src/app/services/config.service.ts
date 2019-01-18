import { Injectable, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable, BehaviorSubject, Subscription } from "rxjs";

import { Configuration, NamedConfig } from '../../common/types';
import { INJECTABLES } from '../injection-tokens';
import { IConfiguration } from 'src/common/interfaces';

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

    public setConfig(config: any) {
        return new Promise((resolve, reject) => {
            this.http.put(this.baseUrl + "config", config)
            .toPromise()
            .then((data: any) => {
                try {
                    this.bSubject.next(new Configuration(data.config));
                    resolve();
                } catch(err) {
                    reject(err);
                }
            })
            .catch((err) => {
                reject(err);
            })
        });
    }

    public getMutableCopy(): any {
        return JSON.parse(JSON.stringify(this.bSubject.value));
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
