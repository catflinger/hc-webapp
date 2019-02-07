import { Component, OnInit, Input } from '@angular/core';
import { IOverride, IRule } from 'src/common/interfaces';

@Component({
    selector: 'app-override-list',
    templateUrl: './override-list.component.html',
    styleUrls: ['./override-list.component.css']
})
export class OverrideListComponent implements OnInit {

    @Input()
    private overrides: IOverride[];

    private rules: IRule[];

    constructor() { }

    ngOnInit() {
        this.rules = [];
        this.overrides.forEach(ov => {
            this.rules.push(ov.rule);
        });
    }
}