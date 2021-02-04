import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Aria } from './app.component';


const routes: Routes = [{ path: '*/index.html', redirectTo: '', pathMatch: 'full' },
{ path: '', component: Aria, pathMatch: 'full' },
{ path: ':data', component: Aria, pathMatch: 'full' }];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
