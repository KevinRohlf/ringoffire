import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Game } from 'src/models/game';


@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {
  firestore: Firestore = inject(Firestore);
  game = new Game()
  @ViewChild('input') input!: ElementRef;
  toShort: boolean = false;
  ids: Array<any>;
  gameNotFound: boolean;
  gameNotFound$: boolean;


  constructor(private router: Router) {
    let ids$ = collectionData(collection(this.firestore, 'games'), { idField: 'id' });
    ids$.subscribe((newIds) => {
      this.ids = newIds;
      console.log(this.ids)
    });
  }

  newGame() {
    // start game
    let coll = collection(this.firestore, 'games')
    addDoc(coll, this.game.toJson())
      .then((gameInfo: any) => {
        console.log(gameInfo.id)
        this.router.navigateByUrl('/game/' + gameInfo.id);
      });
  }

  async join() {
    let input = this.input.nativeElement;
    this.checkGameExist(input);
    if (input.value.length == 20 && !this.gameNotFound$) {
      this.router.navigateByUrl('/game/' + input.value);
    } else if (input.value.length <= 19) {
      this.toShort = true;
      input.value = ''
      setTimeout(() => {
        this.toShort = false;
      }, 2000);
    } else if (this.gameNotFound$ && !this.toShort) {
      this.gameNotFound = true;
      setTimeout(() => {
        this.gameNotFound = false;
      }, 2000);
    }
  }

  async checkGameExist(input) {
    let fail = 0;
    this.ids.forEach(object => {
      if (input.value != object.id) {
        fail++
      }  
    });
    if(fail == this.ids.length) {
        this.gameNotFound$ = true;
      } else {
        this.gameNotFound$ = false;
      }
  }
}
