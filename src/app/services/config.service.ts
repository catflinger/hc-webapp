import { Injectable, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable, BehaviorSubject, Subscription } from "rxjs";

import { Configuration, NamedConfig } from '../../common/types';
import { INJECTABLES } from '../injection-tokens';
import { IConfiguration, IConfigApiResponse } from 'src/common/interfaces';
import { ConfigApiResponse } from 'src/common/api/config-api-response';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    private bSubject: BehaviorSubject<IConfiguration>;

    constructor(
        private http: HttpClient,
        @Inject(INJECTABLES.ApiBase) private baseUrl: string,
        ) {
            // default to a value of null for the initial config
            this.bSubject = <BehaviorSubject<Configuration>>new BehaviorSubject(null);
            this.refresh();
    }

    public getConfig(): Observable<IConfiguration> {
        return this.bSubject.asObservable();
    }

    public updateConfig(makeChanges: (config: any) => boolean): Promise<IConfiguration> {
        let result: Promise<IConfiguration>;

        const newConfig: any = this.getMutableCopy();
        const cancel: boolean = makeChanges(newConfig);

        if (cancel) {
            result = Promise.resolve(this.bSubject.value);
        } else {
            result = new Promise((resolve, reject) => {
                this.http.put(this.baseUrl + "config", newConfig)
                .toPromise()
                .then((data: any) => {
                    try {
                        this.bSubject.next(new Configuration(data.config));
                        resolve(this.bSubject.value);
                    } catch (err) {
                        reject(err);
                    }
                })
                .catch ((err) => {
                    reject(err);
                });
            });
        }

        return result;
    }

    private getMutableCopy(): any {
        return JSON.parse(JSON.stringify(this.bSubject.value));
    }

    public refresh(): void {
        this.http.get(this.baseUrl + "config")
        .pipe(map((data: any): IConfiguration => {
            const apiResponse: IConfigApiResponse = new ConfigApiResponse(data);
            // console.log("GOT CONFIG:" + JSON.stringify(data, null, 4));
            return apiResponse.config;
        }))
        .subscribe((s) => {
            this.bSubject.next(s);
        });
    }

}
