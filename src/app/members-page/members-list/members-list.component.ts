import {Component, Input, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Member} from '../../shared/interfaces/member';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css']
})
export class MembersListComponent implements OnInit {
  private membersCollection: AngularFirestoreCollection<Member>;
  public members: Observable<Member[]>;

  @Input() listName: string;

  constructor(private afs: AngularFirestore) {
  }

  ngOnInit(): void {
    this.membersCollection = this.afs.collection<Member>(this.listName);
    this.members = this.membersCollection.valueChanges();
  }

}
