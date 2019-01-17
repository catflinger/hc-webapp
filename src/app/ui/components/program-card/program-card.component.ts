import { Component, OnInit, Input } from '@angular/core';
import { IProgram } from 'src/common/interfaces';

@Component({
    selector: 'app-program-card',
    templateUrl: './program-card.component.html',
    styleUrls: ['./program-card.component.css']
})
export class ProgramCardComponent implements OnInit {

    @Input("program") private program: IProgram;

    constructor() { }

    ngOnInit() {
    }

}
