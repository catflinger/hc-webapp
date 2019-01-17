import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigService } from 'src/app/services/config.service';
import { IConfiguration, IProgram } from 'src/common/interfaces';

@Component({
    selector: 'app-program-edit',
    templateUrl: './program-edit.component.html',
    styleUrls: ['./program-edit.component.css']
})
export class ProgramEditComponent implements OnInit {
    private config: IConfiguration;
    private program: IProgram;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private configService: ConfigService,
    ) { }

    ngOnInit() {
        this.configService.getConfig()
        .subscribe(
            (config: IConfiguration) => {
                this.config = config;
                this.program = this.config.getProgramConfig().find((p) => { 
                    return p.id === this.route.snapshot.params.id; 
                });
            }, 
            (err) => {
                this.config = undefined;
                // TO DO: show message somewhere;
            }
        );
    }
}
