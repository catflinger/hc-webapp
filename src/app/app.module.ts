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
import { ReadingService } from './services/reading.service';
import { LogService } from './services/log.service';
import { LoggerComponent } from './ui/pages/logger/logger.component';
import { LogChartComponent } from './ui/components/log-chart/log-chart.component';
import { SensorReadingListComponent } from './ui/components/sensor-reading-list/sensor-reading-list.component';
import { ControlStateComponent } from './ui/components/control-state/control-state.component';
import { OnOffPipe } from './ui/pipes/on-off.pipe';
import { PageTitleComponent } from './ui/components/page-title/page-title.component';
import { OverrideListComponent } from './ui/components/override-list/override-list.component';
import { TimeOfDayPipe } from './ui/pipes/time-of-day.pipe';
import { RuleListComponent } from './ui/components/rule-list/rule-list.component';
import { AlertComponent } from './ui/components/alert/alert.component';
import { AlertService } from './services/alert.service';
import { environment } from 'src/environments/environment';

const apiBase = environment.apiBase;
const logApi = "log";

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
        SensorReadingListComponent,
        ControlStateComponent,
        OnOffPipe,
        PageTitleComponent,
        OverrideListComponent,
        TimeOfDayPipe,
        RuleListComponent,
        AlertComponent,
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
        // app
        AlertService,

        // api services
        AppContextService,
        SensorService,
        ReadingService,
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
