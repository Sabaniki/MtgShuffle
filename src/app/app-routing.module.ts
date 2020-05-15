import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MembersPageComponent} from './members-page/members-page/members-page.component';
import {GroupPageComponent} from './group-page/group-page/group-page.component';


const routes: Routes = [
  {path: 'members', component: MembersPageComponent},
  {path: 'groups', component: GroupPageComponent},
  {path: '', redirectTo: '/members', pathMatch: 'prefix'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
