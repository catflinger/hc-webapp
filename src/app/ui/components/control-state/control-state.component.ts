import { Component, OnInit, Input } from '@angular/core';
import { IControlState } from 'src/common/interfaces';

@Component({
    selector: 'app-control-state',
    templateUrl: './control-state.component.html',
    styleUrls: ['./control-state.component.css']
})
export class ControlStateComponent implements OnInit {

    @Input()
    private controlState: IControlState;

    constructor() { }

    ngOnInit() {
    }

}
