import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {PPMapComponent} from './pp-map.component';


const routes: Routes = [
  {
    path: '',
    component: PPMapComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PPMapRoutingModule {
}
