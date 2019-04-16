import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IProgram } from 'src/common/interfaces';
import { Router } from '@angular/router';
import { INamedProgramEvent, IDeleteProgramEvent, IUseProgramEvent } from '../../events';
import { AppContext } from 'src/app/services/app-context';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppContextService } from 'src/app/services/app-context.service';

@Component({
    selector: 'app-program-card',
    templateUrl: './program-card.component.html',
    styleUrls: ['./program-card.component.css']
})
export class ProgramCardComponent implements OnInit {
    private subs: Subscription[] = [];

    public appContext: AppContext = new AppContext(null, null, false);

    @Input() public program: IProgram;
    @Output() private setNamedProgram: EventEmitter<INamedProgramEvent> = new EventEmitter();
    @Output() private deleteProgram: EventEmitter<IDeleteProgramEvent> = new EventEmitter();
    @Output() private useProgram: EventEmitter<IUseProgramEvent> = new EventEmitter();

    constructor(
        private appContextService: AppContextService,
        private router: Router) { }

    ngOnInit() {
        this.subs.push(this.appContextService.getAppContext().subscribe( (appCtx) => {
            this.appContext = appCtx;
        }));
    }

    ngOnDestroy() {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
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

    public onUse() {
        this.useProgram.emit(this.program.id);
    }
}
