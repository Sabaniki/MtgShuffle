import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentChangeAction} from '@angular/fire/firestore';
import {Member} from '../../shared/interfaces/member';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-group-page',
  templateUrl: './group-page.component.html',
  styleUrls: ['./group-page.component.css']
})
export class GroupPageComponent implements OnInit, OnDestroy {
  private seniorsCollection: AngularFirestoreCollection<Member>;
  public seniors: Observable<Member[]>;
  private seniorsSnapshot: Observable<DocumentChangeAction<Member>[]>;

  private juniorsCollection: AngularFirestoreCollection<Member>;
  public juniors: Observable<Member[]>;
  private juniorsSnapshot: Observable<DocumentChangeAction<Member>[]>;

  public isFirst;

  @Input() listName: string;

  public sumOfSeniors = 0;
  public sumOfJuniors = 0;

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

    this.isFirst = true;

    this.juniors.pipe(
      tap(juniors => {
        this.seniors.pipe(
          tap(seniors => {
            this.sumOfSeniors = seniors.length;
            this.sumOfJuniors = juniors.length;
          })
        ).subscribe();
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.isFirst = false;
  }

  arrayNumberLength(num: number): any[] {
    return [...Array(num)];
  }

  resetGroup() {
    // let sumOfSeniors = 0;
    // let sumOfJuniors = 0;
    let flatGroupIds: number[];

    this.juniors.pipe(
      tap(juniors => {
        if (!this.isFirst) {
          return;
        }
        this.isFirst = false;
        this.seniors.pipe(
          tap(seniors => {
            this.sumOfSeniors = seniors.length;
            this.sumOfJuniors = juniors.length;

            console.log('seniors: ' + this.sumOfSeniors);
            console.log('juniors: ' + this.sumOfJuniors);

            const numberOfMemberPerGroup = Math.floor(this.sumOfJuniors / this.sumOfSeniors);
            const remainder = this.sumOfJuniors % this.sumOfSeniors;

            const groupsIds = new Array<Array<number>>();

            for (let i = 0; i < this.sumOfSeniors; i++) {
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

            let index = 0;
            const docIds = new Array<string>();
            this.juniorsCollection.get().pipe(
              tap((ref) => {
                ref.forEach(doc => docIds.push(doc.id));
              })
            ).subscribe(_ => {
              docIds.forEach(id => {
                const shadowJ = juniors[index];
                shadowJ.groupId = flatGroupIds[index];
                this.juniorsCollection.doc(id).update(Object.assign({}, shadowJ)).then(_ => this.isFirst = false);
                index++;
              });
              index = 0;
            });
          }),
        ).subscribe();
      }),
    ).subscribe();

    // this.isFirst = false;
  }
}
