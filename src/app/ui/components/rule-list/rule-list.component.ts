import { Component, OnInit, Input } from '@angular/core';
import { IRule } from 'src/common/interfaces';

@Component({
  selector: 'app-rule-list',
  templateUrl: './rule-list.component.html',
  styleUrls: ['./rule-list.component.css']
})
export class RuleListComponent implements OnInit {

    @Input()
    private rules: IRule[];

  constructor() { }

  ngOnInit() {
  }

}
