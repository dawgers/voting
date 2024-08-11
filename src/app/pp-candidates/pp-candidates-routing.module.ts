

import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {PpCandidatesComponent} from './pp-candidates.component';


const routes: Routes = [
  {
    path: '',
    component: PpCandidatesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PpCandidatesRoutingModule { }
