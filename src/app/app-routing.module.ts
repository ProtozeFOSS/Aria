import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Aria } from './app.component';


const routes: Routes = [{ path: '', redirectTo: '', pathMatch: 'full' },
{ path: '', component: Aria, pathMatch: 'full' },
{ path: ':settings', component: Aria, pathMatch: 'full' }];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
