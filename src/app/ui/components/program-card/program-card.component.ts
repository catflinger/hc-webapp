import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IProgram } from 'src/common/interfaces';
import { Router } from '@angular/router';
import { INamedProgramEvent, IDeleteProgramEvent } from '../../events';

@Component({
    selector: 'app-program-card',
    templateUrl: './program-card.component.html',
    styleUrls: ['./program-card.component.css']
})
export class ProgramCardComponent implements OnInit {

    @Input() public program: IProgram;
    @Output() private setNamedProgram: EventEmitter<INamedProgramEvent> = new EventEmitter();
    @Output() private deleteProgram: EventEmitter<IDeleteProgramEvent> = new EventEmitter();

    constructor(private router: Router) { }

    ngOnInit() {
    }

    public onEdit() {
        this.router.navigate(['/program-edit', this.program.id]);
    }

    public onEditRules() {
        this.router.navigate(['/program', this.program.id, 'rules-edit']);
    }

    public onSetNamedProgram(name: string, displayName: string, program: IProgram) {
        this.setNamedProgram.emit({name, displayName, program});
    }

    public onDelete() {
        this.deleteProgram.emit(this.program.id);
    }
}
