import { Pipe, PipeTransform } from '@angular/core';
import { ITimeOfDay } from 'src/common/interfaces';

@Pipe({
    name: 'timeOfDay'
})
export class TimeOfDayPipe implements PipeTransform {

    transform(tod: ITimeOfDay, args?: any): string {

        return tod ?
            tod.hour.toString() + ":" + tod.minute.toString() :
            "";
    }
}

