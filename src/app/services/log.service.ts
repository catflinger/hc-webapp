import { Injectable, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable, BehaviorSubject } from "rxjs";

import { INJECTABLES } from '../injection-tokens';
import { ILogExtract } from '../../common/interfaces';

@Injectable({
  providedIn: 'root'
})
export class LogService {
    private bSubject: BehaviorSubject<ILogExtract>;

    constructor(
        private http: HttpClient,
        @Inject(INJECTABLES.ApiBase) private apiBase: string,
        @Inject(INJECTABLES.LogApi) private logApi: string,
        ) {
            this.bSubject = new BehaviorSubject(null);
    }

    public getObservable(): Observable<ILogExtract> {
        return this.bSubject.asObservable();
    }

    public getValue(): ILogExtract {
        return this.bSubject.value;
    }

    public refresh(from: Date, to: Date, sensors: string[]): Promise<ILogExtract> {

        return this.http.get(this.apiBase + this.logApi + "?params=" + JSON.stringify({ 
            from: from.toISOString(), 
            to: to.toISOString(), 
            sensors}))

        .pipe(map((data: any): ILogExtract => {
            // console.log("LOG " + JSON.stringify(data, null, 4));
            // TO DO: make some LogExtract classes and new form data
            return data.log as ILogExtract;
        }))

        .toPromise()

        .then((extract: ILogExtract) => {
            this.bSubject.next(extract);
            return extract;
        });
    }
}
