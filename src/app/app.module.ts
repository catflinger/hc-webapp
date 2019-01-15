import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';
import { INJECTABLES } from './injection-tokens';
import { HttpClientModule } from "@angular/common/http";
import { SensorReadingService } from './services/sensor-reading.service';
import { SensorAvailabilityService } from './services/sensor-availability.service';
import { ConfigService } from './services/config.service';
import { ControlStateService } from './services/control-state.service';
import { OverrideService } from './services/override-service';
import { HomeComponent } from './home/home.component';
import { TempComponent } from './temp/temp.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MainMenuComponent } from './main-menu/main-menu.component';

const apiBase: string = "http://localhost:3000/api/";

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        TempComponent,
        PageNotFoundComponent,
        MainMenuComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule
    ],
    providers: [
        SensorAvailabilityService,
        SensorReadingService,
        ConfigService,
        ControlStateService,
        OverrideService,
        { provide: INJECTABLES.ApiBase, useValue: apiBase },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
