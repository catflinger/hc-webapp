import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, timer } from 'rxjs';
import * as moment from "moment";

export type AlertType = "success" | "warning" | "danger" | "info";

export interface IAlert {
    type: AlertType;
    message: string;
    date?: moment.Moment;
}

const secondsToDisplayMessage = 4; 

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    private subject: BehaviorSubject<IAlert>;

    constructor() {
        this.subject = new BehaviorSubject(null);
        
        // set up a timer that clears the alert if it has been up for more than 5 seconds
        timer(500, 500)
        .subscribe(() => {
            const alert = this.subject.value;
            
            if (alert) {
                const aFewSecondsAgo = moment().subtract(secondsToDisplayMessage, "seconds");
                if (alert.date.isBefore(aFewSecondsAgo)) {
                    this.clearAlerts();
                }
            }
        });
    }

    public getObservable(): Observable<IAlert> {
        return this.subject.asObservable();
    }

    public setAlert(message: string, type: AlertType) {
        this.subject.next({ message, type, date: moment() });
    }

    public clearAlerts() {
        this.subject.next(null);
    }

    public createAlert(message: string, type: AlertType): () => void {
        const self = this;

        return () => {
            self.setAlert(message,type);
        }
    }
}
