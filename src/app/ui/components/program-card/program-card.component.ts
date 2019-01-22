import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IProgram, IRule } from 'src/common/interfaces';
import { stringify } from '@angular/core/src/util';
import { BasicHeatingRule } from 'src/common/types';
import { Router } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Component({
    selector: 'app-program-card',
    templateUrl: './program-card.component.html',
    styleUrls: ['./program-card.component.css']
})
export class ProgramCardComponent implements OnInit {

    @Input("program") private program: IProgram;
    @Output("setNamedProgram") private namedProgramEvent: EventEmitter<{name: string, programId: string}> = new EventEmitter();

    constructor(private router: Router) { }

    ngOnInit() {
    }

    private edit() {
        this.router.navigate(['/program-edit', this.program.id])
    }

    private editRules() {
        this.router.navigate(['/program', this.program.id,'rules-edit'])
    }

    private setNamedProgram(name: string, programId: string) {
        this.namedProgramEvent.emit({name, programId});
    }
}
