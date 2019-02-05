import { Pipe, PipeTransform } from '@angular/core';
import { ITimeOfDay } from 'src/common/interfaces';

@Pipe({
    name: 'timeOfDay'
})
export class TimeOfDayPipe implements PipeTransform {

    transform(tod: ITimeOfDay, args?: any): string {
        const hour: string = tod.hour.toString();
        const minute: string = tod.minute.toString();

        return tod ?
            tod.hour.toString() + ":" + tod.hour.toString() :
            "";
    };
}

