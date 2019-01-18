import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { IConfiguration, IProgram } from 'src/common/interfaces';
import { NamedConfig } from 'src/common/types';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-program-list',
    templateUrl: './program-list.component.html',
    styleUrls: ['./program-list.component.css']
})
export class ProgramListComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];

    private config: IConfiguration;
    private weekdayProgramName: string;
    private saturdayProgramName: string;
    private sundayProgramName: string;

    constructor(private configService: ConfigService) { }

    ngOnInit() {
        this.subs.push(this.configService.getConfig()
        .subscribe((config) => {
            // note: 1st time though config is likeley to be null if the source
            // for this is a behaviour subject
            if (config) {
                this.config = config;
                const weekdayProgram = this.getProgram(this.config.getNamedConfig().weekdayProgramId);
                const saturdayProgram = this.getProgram(this.config.getNamedConfig().saturdayProgramId);
                const sundayProgram = this.getProgram(this.config.getNamedConfig().sundayProgramId);

                this.weekdayProgramName = weekdayProgram ? weekdayProgram.name : ""; 
                this.saturdayProgramName = saturdayProgram ? saturdayProgram.name : ""; 
                this.sundayProgramName = sundayProgram ? sundayProgram.name : ""; 
            }
        }));
    }

    ngOnDestroy() {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    private getProgram(id: string): IProgram {
        return this.config.getProgramConfig().find((program) => { return program.id === id; });
    }
}
