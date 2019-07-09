import { Injectable, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

import { INJECTABLES } from '../injection-tokens';
import { ILogExtract, IDayOfYear } from '../../common/interfaces';
import { LogApiResponse } from 'src/common/api/log-api-response';

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
