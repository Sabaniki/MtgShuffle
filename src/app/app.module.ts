import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GroupPageComponent } from './group-page/group-page/group-page.component';
import { GroupCardComponent } from './group-page/group-card/group-card.component';
import { MembersPageComponent } from './members-page/members-page/members-page.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFireStorage} from '@angular/fire/storage';
import { MembersListComponent } from './members-page/members-list/members-list.component';

@NgModule({
  declarations: [
    AppComponent,
    GroupPageComponent,
    GroupCardComponent,
    MembersPageComponent,
    MembersListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  providers: [AngularFireStorage],
  bootstrap: [AppComponent]
})
export class AppModule { }
