import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './ui/pages/home/home.component';
import { TempComponent } from './ui/pages/temp/temp.component';
import { PageNotFoundComponent } from './ui/pages/page-not-found/page-not-found.component';
import { ProgramListComponent } from './ui/pages/program-list/program-list.component';
import { ProgramEditComponent } from './ui/pages/program-edit/program-edit.component';
import { SensorListComponent } from './ui/pages/sensor-list/sensor-list.component';
import { SensorEditComponent } from './ui/pages/sensor-edit/sensor-edit.component';
import { StatusComponent } from './ui/pages/status/status.component';
import { RulesEditComponent } from './ui/pages/rules-edit/rules-edit.component';
import { RuleEditComponent } from './ui/pages/rule-edit/rule-edit.component';
import { LoggerComponent } from './ui/pages/logger/logger.component';
import { ProgramUseComponent } from './ui/pages/program-use/program-use.component';

const routes: Routes = [
    { path: "home", component: HomeComponent },
    { path: "logger", component: LoggerComponent },
    { path: "programs", component: ProgramListComponent },
    { path: "program-new", component: ProgramEditComponent },
    { path: "program-edit/:id", component: ProgramEditComponent },
    { path: "program-use/:id", component: ProgramUseComponent },
    { path: "program/:id/rules-edit", component: RulesEditComponent },
    { path: "program/:id/rules-edit/:ruleid", component: RuleEditComponent },
    { path: "sensors", component: SensorListComponent },
    { path: "sensor-edit/:id", component: SensorEditComponent },
    { path: "status", component: StatusComponent },
    { path: "temp", component: TempComponent },
    { path: "", redirectTo: "/home", pathMatch: "full"},
    { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
