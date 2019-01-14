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

const apiBase: string = "http://localhost:3000/api/";

@NgModule({
    declarations: [
        AppComponent
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
        { provide: INJECTABLES.ApiBase, useValue: apiBase },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
