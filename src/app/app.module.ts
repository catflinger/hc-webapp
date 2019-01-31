import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './ui/app/app.component';
import { INJECTABLES } from './injection-tokens';
import { HttpClientModule } from "@angular/common/http";
import { ConfigService } from './services/config.service';
import { ControlStateService } from './services/control-state.service';
import { OverrideService } from './services/override-service';
import { HomeComponent } from './ui/pages/home/home.component';
import { TempComponent } from './ui/pages/temp/temp.component';
import { PageNotFoundComponent } from './ui/pages/page-not-found/page-not-found.component';
import { MainMenuComponent } from './ui/components/main-menu/main-menu.component';
import { RuleChartComponent } from './ui/components/rule-chart/rule-chart.component';
import { ProgramEditComponent } from './ui/pages/program-edit/program-edit.component';
import { ProgramListComponent } from './ui/pages/program-list/program-list.component';
import { SensorListComponent } from './ui/pages/sensor-list/sensor-list.component';
import { SensorEditComponent } from './ui/pages/sensor-edit/sensor-edit.component';
import { StatusComponent } from './ui/pages/status/status.component';
import { ProgramCardComponent } from './ui/components/program-card/program-card.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RulesEditComponent } from './ui/pages/rules-edit/rules-edit.component';
import { RuleCardComponent } from './ui/components/rule-card/rule-card.component';
import { RuleEditComponent } from './ui/pages/rule-edit/rule-edit.component';
import { AppContextService } from './services/app-context.service';
import { SensorService } from './services/sensor.service';
import { LogService } from './services/log.service';
import { LoggerComponent } from './ui/pages/logger/logger.component';
import { LogChartComponent } from './ui/components/log-chart/log-chart.component';

const apiBase: string = "http://localhost:3000/api/";
const logApi: string = "dev/log";

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        TempComponent,
        PageNotFoundComponent,
        MainMenuComponent,
        RuleChartComponent,
        ProgramEditComponent,
        ProgramListComponent,
        SensorListComponent,
        SensorEditComponent,
        StatusComponent,
        ProgramCardComponent,
        RulesEditComponent,
        RuleCardComponent,
        RuleEditComponent,
        LoggerComponent,
        LogChartComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        NgbModule,
    ],
    providers: [
        // api services
        AppContextService,
        SensorService,
        ConfigService,
        ControlStateService,
        LogService,
        OverrideService,
        
        // constants
        { provide: INJECTABLES.ApiBase, useValue: apiBase },
        { provide: INJECTABLES.LogApi, useValue: logApi },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
