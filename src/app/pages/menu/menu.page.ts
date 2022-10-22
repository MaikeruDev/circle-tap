import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { first, map } from 'rxjs/operators';

export interface scores{
  username: any;
  score: any;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  curruserMail: string;
  curruserName: string;
  scores: any[];
  scoresAscend: any[];

  constructor(private router: Router, public afAuth: AngularFireAuth, private afDB: AngularFireDatabase) { }

  async ngOnInit() {
    await this.getTasks();
    this.scoresAscend = this.scores.sort((a, b) => (a.score < b.score) ? 1 : -1);

    this.afAuth.authState.subscribe(async user => {
      if(user)
        this.curruserMail = user.email;
        this.curruserName = user.displayName;
    })
  }

  play(){
    this.router.navigateByUrl('game');
  }

  htp(){
    this.router.navigateByUrl('tutorial');
  }

  logOut(){
    this.afAuth.signOut();
  }

  async firebaseGeneralizedGetOnceWithId<type>(path: string): Promise<type[]>{
    return this.afDB.list<type>(path).snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      ),
      first()
    ).toPromise()
  }
  async getTasks(): Promise<void> {
    // this.tasks = await this.afDB.list<Task>('Tasks/').valueChanges().pipe(first()).toPromise();
    this.scores = await this.firebaseGeneralizedGetOnceWithId<scores>('Scores');
  }

}
