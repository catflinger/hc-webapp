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

const routes: Routes = [
    { path: "home", component: HomeComponent },
    { path: "programs", component: ProgramListComponent },
    { path: "program-edit/:id", component: ProgramEditComponent },
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
