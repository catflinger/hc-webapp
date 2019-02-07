import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IProgram, IRule } from 'src/common/interfaces';
import { Router } from '@angular/router';
import { INamedProgramEvent, IDeleteProgramEvent } from '../../events';

@Component({
    selector: 'app-program-card',
    templateUrl: './program-card.component.html',
    styleUrls: ['./program-card.component.css']
})
export class ProgramCardComponent implements OnInit {

    @Input("program") private program: IProgram;
    @Output("setNamedProgram") private namedProgramEvent: EventEmitter<INamedProgramEvent> = new EventEmitter();
    @Output("deleteProgram") private deleteProgramEvent: EventEmitter<IDeleteProgramEvent> = new EventEmitter();

    constructor(private router: Router) { }

    ngOnInit() {
    }

    private edit() {
        this.router.navigate(['/program-edit', this.program.id])
    }

    private editRules() {
        this.router.navigate(['/program', this.program.id,'rules-edit'])
    }

    private setNamedProgram(name: string, displayName: string, program: IProgram) {
        this.namedProgramEvent.emit({name, displayName, program});
    }

    private onDelete() {
        this.deleteProgramEvent.emit(this.program.id);
    }
}
