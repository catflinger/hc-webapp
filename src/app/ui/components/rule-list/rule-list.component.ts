import { Component, OnInit, Input } from '@angular/core';
import { IRuleConfig } from 'src/common/interfaces';

@Component({
    selector: 'app-rule-list',
    templateUrl: './rule-list.component.html',
    styleUrls: ['./rule-list.component.css']
})
export class RuleListComponent implements OnInit {

    @Input()
    private rules: IRuleConfig[];

    constructor() { }

    ngOnInit() {
    }
}
