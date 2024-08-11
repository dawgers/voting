import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ResultsComponentpp} from './resultspp.component';


const routes: Routes = [
  {
    path: '',
    component: ResultsComponentpp
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResultsppRoutingModule {
}
