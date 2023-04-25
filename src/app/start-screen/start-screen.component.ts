import { Component, inject } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
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


  constructor(private router: Router) { }

  newGame() {
    // start game
    let coll = collection(this.firestore, 'games')
    addDoc(coll, this.game.toJson())
    .then((gameInfo: any) => {
      console.log(gameInfo.id)
      this.router.navigateByUrl('/game/' + gameInfo.id);
    });

    
  }
}
