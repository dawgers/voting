import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LoadingComponent } from './loading/loading.component';
import { NeedAuthGuard } from './auth.guard';
import { MetaGuard } from 'ng2-meta';
const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: []
  },
  // {
  //   path: 'register',
  //   component: RegisterComponent,
  //   canActivate: []
  // },
  {
    path: 'loading',
    component: LoadingComponent,
    canActivate: []

  },
  {
    path: 'maps',
    loadChildren: '../app/maps/maps.module#MapsModule',
    canActivate: []
  },
  {
    path: 'pp-map',
    loadChildren: '../app/pp-map/pp-map.module#PPMapModule',
    canActivate: []
  },
  {
    path: 'register',
    loadChildren: '../app/register/register.module#RegisterModule',
    canActivate: []
  },
  {
    path: 'cast-vote',
    loadChildren: '../app/cast-vote/cast-vote.module#CastVoteModule',
    canActivate: []
  },
  {
    path: 'results',
    loadChildren: '../app/results/results.module#ResultsModule',
    canActivate: []
  },
  {
    path: 'results-pp',
    loadChildren: '../app/resultspp/resultspp.module#ResultsppModule',
    canActivate: []
  },
  {
    path: 'new',
    loadChildren: '../app/new/new.module#NewModule',
    canActivate: []
  },
 // {
 //   path: 'pp-candidates',
  //  loadChildren: '..app/pp-candidates/pp-candidates.module#PpCandidatesModule',
  //  canActivate: []
 // },
  {
    path: '',
    redirectTo: 'loading',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: LoadingComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
