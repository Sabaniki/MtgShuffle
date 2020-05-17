import {Component, Input, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Member} from '../../shared/interfaces/member';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-group-card',
  templateUrl: './group-card.component.html',
  styleUrls: ['./group-card.component.css']
})
export class GroupCardComponent implements OnInit {
  // @Input() leaderName: string;
  @Input() groupId: number;

  // private membersCollection: AngularFirestoreCollection<Member>;
  @Input() members: Observable<Member[]>;
  @Input() leaders: Observable<Member[]>;

  constructor(private afs: AngularFirestore) {
  }

  ngOnInit(): void {

  }

}
