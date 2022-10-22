import { StylesCompileDependency } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators'
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})


export class GamePage implements OnInit {

  countDown: any = "3";
  starting: boolean = true;
  counter: number = 0;
  lastCount: number = -1;
  showBtn: boolean = true;
  clicked: boolean = false;
  compStyle: { marginLeft: string; marginTop: string; };
  curruserMail: string;
  curruserName: string;
  timeTick: any;
  
  constructor(private router: Router, public afAuth: AngularFireAuth, public alertController: AlertController, private afDB: AngularFireDatabase){}

  async ngOnInit() {
    this.afAuth.authState.subscribe(async user => {
      if(user)
        this.curruserMail = user.email;
        this.curruserName = user.displayName;
    })
    await this.delay(3700); 
    this.starting = false;
    this.newPos();
    for (let index = 1; index < index + 1; index++) {
      if(1000 - (index * 5) > 350){
        this.timeTick = 1000 - (index * 5);
        await this.delay(1000 - (index * 5));
      }
      else{
        await this.delay(350);
      }
      if(this.counter > this.lastCount){
        this.lastCount = this.counter
      }
      else{
        console.log("Game Over");
        index += 2;
        this.showBtn = false;
        this.gameOver();
        break;
      }
    }
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  getRandomColor()
  { 
    return { marginLeft: Math.floor(Math.random() * 83) + 1   + 'vw', marginTop: Math.floor(Math.random() * 145) + 25   + 'vw' }
  }

  playAudio(){
    let audio = new Audio();
    audio.src = "../../../assets/audio/Pop.wav";
    audio.load();
    audio.play();
  }

  async tap(){
    this.playAudio();
    this.counter += 1;
    this.newPos();
  } 

  newPos(){
    this.compStyle = { marginLeft: Math.floor(Math.random() * 83) + 1   + 'vw', marginTop: Math.floor(Math.random() * 145) + 1   + 'vw' }
  }

  async gameOver(){
    if(this.curruserName){
      await this.newEntry();
    }
    this.presentAlertConfirm();
  }

  async newEntry() {
    this.afDB.list('Scores/').push({
      username: this.curruserName,
      score: this.counter
    });
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Game Over!',
      message: 'You have reached a score of <strong>' + this.counter + '</strong>!',
      buttons: [
        {
          text: 'Menu',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            window.open("../menu/", "_self");
          }
        }, {
          text: 'Retry',
          handler: () => {
            location.reload();
          }
        }
      ]
    });

    await alert.present();
  }
  
}
