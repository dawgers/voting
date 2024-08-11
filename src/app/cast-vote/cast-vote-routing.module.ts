import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CastVoteComponent} from './cast-vote.component';


const routes: Routes = [
  {
    path: '',
    component: CastVoteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CastVoteRoutingModule {
}
