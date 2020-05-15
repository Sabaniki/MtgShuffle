import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MembersPageComponent} from './members-page/members-page/members-page.component';


const routes: Routes = [
  {path: 'members', component: MembersPageComponent},
  {path: '', redirectTo: '/members', pathMatch: 'prefix'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
