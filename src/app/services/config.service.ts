import { Injectable, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable, BehaviorSubject, Subscription } from "rxjs";

import { Configuration, NamedConfig } from '../../common/types';
import { INJECTABLES } from '../injection-tokens';
import { IConfiguration, IConfigApiResponse, IConfigurationM } from 'src/common/interfaces';
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

    public getConfig(): IConfiguration {
        return this.bSubject.value;
    }

    public getObservable(): Observable<IConfiguration> {
        return this.bSubject.asObservable();
    }

    public updateConfig(makeChanges: (config: IConfigurationM) => boolean): Promise<void> {
        let result: Promise<void>;

        const newConfig: IConfigurationM = this.bSubject.value.toMutable();
        const cancel: boolean = makeChanges(newConfig);

        if (cancel) {
            result = Promise.resolve();
        } else {
            result = new Promise((resolve, reject) => {
                this.http.put(this.baseUrl + "config", newConfig)
                .toPromise()
                .then((data: any) => {
                    try {
                        const apiResponse: IConfigApiResponse = new ConfigApiResponse(data);
                        console.log("config updated");
                        this.bSubject.next(apiResponse.config);
                        resolve();
                    } catch (err) {
                        console.log("failed to load config after update");
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

    public refresh(): Promise<void> {
        return this.http.get(this.baseUrl + "config")
        .pipe(map((data: any): IConfiguration => {
            const apiResponse: IConfigApiResponse = new ConfigApiResponse(data);
            return apiResponse.config;
        }))
        .toPromise()
        .then((s) => {
            this.bSubject.next(s);
        });
    }

}
