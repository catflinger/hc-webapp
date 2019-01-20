import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IRule } from 'src/common/interfaces';
import { Router } from '@angular/router';

@Component({
    selector: 'app-rule-card',
    templateUrl: './rule-card.component.html',
    styleUrls: ['./rule-card.component.css']
})
export class RuleCardComponent implements OnInit {
    @Input("rule") private rule: IRule;
    @Input("title") private title: string;
    @Output() edit: EventEmitter<IRule> = new EventEmitter();
    @Output() delete: EventEmitter<IRule> = new EventEmitter();

    constructor(private router: Router) { }

    ngOnInit() {
    }

    private onEdit() {
        this.edit.emit(this.rule);
    }

    private onDelete() {
        this.delete.emit(this.rule);
    }
}
