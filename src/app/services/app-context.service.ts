import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { AppContext } from './app-context';

// This service keeps track of what item(s) the user is currently working on
// for example: they have selected rule "x" in program "y"
@Injectable({
    providedIn: 'root'
})
export class AppContextService {
    private bs: BehaviorSubject<AppContext>;

    constructor() {
        this.bs = new BehaviorSubject<AppContext>(new AppContext(null, null));
    }

    public getAppContext(): Observable<AppContext> {
        return this.bs.asObservable();
    }

    public setProgramContext(id: string): void {
        this.bs.next(new AppContext(id, null));
    }

    public clearProgramContext(): void {
        this.clearContext();
    }

    public setRuleContext(id: string): void {
        this.bs.next(new AppContext(this.bs.value.programId, id));
    }

    public clearRuleContext(): void {
        this.bs.next(new AppContext(this.bs.value.programId, null));
    }

    public clearContext() {
        this.bs.next(new AppContext(null, null));
    }

    public setBusy() {
        this.bs.next(new AppContext(this.bs.value.programId, this.bs.value.ruleId, true));
    }

    public clearBusy() {
        this.bs.next(new AppContext(this.bs.value.programId, this.bs.value.ruleId, false));
    }

}
