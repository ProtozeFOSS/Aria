import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OlgaTestComponent } from './olga-test/olga-test.component';


const routes: Routes = [{ path: 'test', component: OlgaTestComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
