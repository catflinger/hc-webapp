import { Component, OnInit, Input } from '@angular/core';
import { IProgram } from 'src/common/interfaces';
import { ConfigService } from 'src/app/services/config.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-program-card',
    templateUrl: './program-card.component.html',
    styleUrls: ['./program-card.component.css']
})
export class ProgramCardComponent implements OnInit {

    @Input("program") private program: IProgram;

    constructor(private configService: ConfigService) { }

    ngOnInit() {
    }

    private onRuleClick(event: any) {
    }

    private setNamedProgram(key: string, id: string) {
        try {
            const config: any = this.configService.getMutableCopy();
            config.namedConfig[key] = id;
            this.configService.setConfig(config);
        } catch(err) {
            // TO DO: add a status panel to app somehwere
            alert("ERROR saving config");
        }
    }
}
