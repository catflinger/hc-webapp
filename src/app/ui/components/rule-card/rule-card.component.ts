import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IRuleConfig } from 'src/common/interfaces';
import { AppContextService } from 'src/app/services/app-context.service';
import { AppContext } from 'src/app/services/app-context';

@Component({
    selector: 'app-rule-card',
    templateUrl: './rule-card.component.html',
    styleUrls: ['./rule-card.component.css']
})
export class RuleCardComponent implements OnInit {
    private appContext: AppContext;

    @Input() private rule: IRuleConfig;
    @Input() private title: string;

    @Output() edit: EventEmitter<IRuleConfig> = new EventEmitter();
    @Output() delete: EventEmitter<IRuleConfig> = new EventEmitter();
    @Output() select: EventEmitter<IRuleConfig> = new EventEmitter();

    constructor(private appContextService: AppContextService) {
        appContextService.getAppContext().subscribe((ac) => {
            this.appContext = ac;
        });
     }

    ngOnInit() {
    }

    private get selected(): boolean {
        return this.rule.id === this.appContext.ruleId;
    }
    private onClick() {
        this.select.emit(this.rule);
    }

    private onEdit() {
        this.edit.emit(this.rule);
    }

    private onDelete() {
        this.delete.emit(this.rule);
    }
}
