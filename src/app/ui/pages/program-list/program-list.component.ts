import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { IConfiguration } from 'src/common/interfaces';

@Component({
    selector: 'app-program-list',
    templateUrl: './program-list.component.html',
    styleUrls: ['./program-list.component.css']
})
export class ProgramListComponent implements OnInit {
    private config: IConfiguration;

    constructor(private configService: ConfigService) { }

    ngOnInit() {
        this.configService.getConfig()
            .subscribe((config) => {
                this.config = config;
            });
    }

}
