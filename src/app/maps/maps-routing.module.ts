import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {MapsComponent} from './maps.component';


const routes: Routes = [
  {
    path: '',
    component: MapsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapsRoutingModule {
}
