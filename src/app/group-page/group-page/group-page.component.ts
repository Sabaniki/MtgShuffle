import {Component, Input, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentChangeAction} from '@angular/fire/firestore';
import {Member} from '../../shared/interfaces/member';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {map, tap} from 'rxjs/operators';

@Component({
  selector: 'app-group-page',
  templateUrl: './group-page.component.html',
  styleUrls: ['./group-page.component.css']
})
export class GroupPageComponent implements OnInit {
  private seniorsCollection: AngularFirestoreCollection<Member>;
  public seniors: Observable<Member[]>;
  private seniorsSnapshot: Observable<DocumentChangeAction<Member>[]>;

  private juniorsCollection: AngularFirestoreCollection<Member>;
  public juniors: Observable<Member[]>;
  private juniorsSnapshot: Observable<DocumentChangeAction<Member>[]>;

  private shuffledGroupIds: number[];

  @Input() listName: string;

  constructor(private afs: AngularFirestore, private router: Router) {
  }

  onClickGoMembersButton() {
    this.router.navigate(['members']);
  }

  ngOnInit(): void {
    this.seniorsCollection = this.afs.collection<Member>('Seniors');
    this.seniors = this.seniorsCollection.valueChanges();
    this.seniorsSnapshot = this.seniorsCollection.snapshotChanges();

    this.juniorsCollection = this.afs.collection<Member>('Juniors');
    this.juniors = this.juniorsCollection.valueChanges();
    this.juniorsSnapshot = this.juniorsCollection.snapshotChanges();
  }

  resetGroup() {
    let sumOfSeniors = 0;
    let sumOfJuniors = 0;
    let flatGroupIds: number[];

    // this.seniors.pipe(
    //   tap(seniors => sumOfSeniors = seniors.length),
    //   tap(_ => console.log('hogera'))
    //   // map(seniors => {
    //   //   for (const item of seniors) {
    //   //     item.groupId = 1;
    //   //   }
    //   // })
    // ).subscribe(() => console.log('seniors: ' + sumOfSeniors));

    this.juniors.pipe(
      tap(juniors => {
        this.seniors.pipe(
          tap(seniors => {
            sumOfSeniors = seniors.length;
            sumOfJuniors = juniors.length;

            console.log('seniors: ' + sumOfSeniors);
            console.log('juniors: ' + sumOfJuniors);

            const numberOfMemberPerGroup = Math.floor(sumOfJuniors / sumOfSeniors);
            const remainder = sumOfJuniors % sumOfSeniors;

            const groupsIds = new Array<Array<number>>();

            for (let i = 0; i < sumOfSeniors; i++) {
              groupsIds.push(Array(numberOfMemberPerGroup).fill(i));
            }

            for (let i = 0; i < remainder; i++) {
              groupsIds.push(Array(1).fill(i));
            }

            console.log('before shuffle: ' + groupsIds);

            flatGroupIds = [].concat(...groupsIds);

            for (let i = flatGroupIds.length - 1; i > 0; i--) {
              const r = Math.floor(Math.random() * (i + 1));
              const tmp = flatGroupIds[i];
              flatGroupIds[i] = flatGroupIds[r];
              flatGroupIds[r] = tmp;
            }

            console.log(flatGroupIds);


            for (const junior of juniors) {
              console.log(junior.name);
              junior.groupId = 0;
              this.juniorsCollection.get().subscribe((ref) => ref.forEach(doc => {
                this.juniorsCollection.doc(doc.id).update(Object.assign({}, junior));
              }));
              // .doc(this.juniorsCollection).update(Object.assign({}, junior));
            }
          }),
        ).subscribe();
      }),
    ).subscribe();
  }
}
