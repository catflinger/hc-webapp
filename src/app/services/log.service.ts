import { Injectable, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

import { INJECTABLES } from '../injection-tokens';
import { ILogExtract, IDayOfYear } from '../../common/interfaces';
import { LogApiResponse } from 'src/common/api/log-api-response';
import { DayOfYear } from 'src/common/configuration/day-of-year';

@Injectable({
    providedIn: 'root'
})
export class LogService {
    private logs: ILogExtract[] = [];

    constructor(
        private http: HttpClient,
        @Inject(INJECTABLES.ApiBase) private apiBase: string,
        @Inject(INJECTABLES.LogApi) private logApi: string,
    ) {
    }

    public getLog(dayOfYear: IDayOfYear): Promise<ILogExtract> {

        let result = this.getCachedExtract(dayOfYear);

        if (result) {
            return Promise.resolve(result);
        } else {
            return this.fetchLog(dayOfYear)
                .then((log) => {
                    this.logs.push(log);
                    return Promise.resolve(log);
                });
        }
    }

    public update(): Promise<void> {
        return this.fetchLog(DayOfYear.fromDate(new Date()))
        .then((log) => {
            let idx = this.logs.findIndex(item => item.dayOfYear.isToday());

            if (idx >= 0) {
                this.logs.splice(idx, 1, log);
            }
            return Promise.resolve();
            
        });

    }

    private getCachedExtract(dayOfYear: IDayOfYear): ILogExtract {
        return this.logs.find((log) => log.dayOfYear.isSameAs(dayOfYear));
    }

    private fetchLog(dayOfYear: IDayOfYear): Promise<ILogExtract> {
        return this.http.get(`${this.apiBase}${this.logApi}?year=${dayOfYear.year}&month=${dayOfYear.month}&day=${dayOfYear.day}`)
            .pipe(
                map((data: any): ILogExtract => {
                    const apiResponse = new LogApiResponse(data);
                    return apiResponse.log;
                })
            )
            .toPromise();
    }
}
