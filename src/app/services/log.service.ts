import { Injectable, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

import { INJECTABLES } from '../injection-tokens';
import { ILogExtract } from '../../common/interfaces';

@Injectable({
  providedIn: 'root'
})
export class LogService {

    constructor(
        private http: HttpClient,
        @Inject(INJECTABLES.ApiBase) private apiBase: string) {
        this.getLogExtract();
    }

    public getLogExtract(): Observable<ILogExtract> {
        return this.http.get(this.apiBase + "log")
        .pipe(map((data: any): ILogExtract => {
            // TO DO: make some LogExtract classes and new form data
            return data.log as ILogExtract;
        }));
    }
}
