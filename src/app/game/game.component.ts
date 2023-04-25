import { Component, OnInit, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, addDoc, collection, collectionData, doc, docData, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  
  game: Game;
  firestore: Firestore = inject(Firestore);
  items$: Observable<any>;
  item: Array<any>;
  gameId: string;


  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
    // const aCollection = collection(this.firestore, 'games')
    // this.items$ = collectionData(aCollection);
    // this.items$.subscribe((game) => {
    //   this.item = game;
    //   console.log(this.item)
    // })
  }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      console.log(params['id']);
      this.gameId = params['id'];
      const aCollection = doc(this.firestore, `games/${this.gameId}`);
      this.items$ = docData(aCollection);
      this.items$.subscribe((game) => {
        this.item = game;
        console.log(this.item)
        this.game.currentPlayer = game.currentPlayer;
        this.game.playedCards = game.playedCards;
        this.game.players = game.players;
        this.game.stack = game.stack;
        this.game.pickCardAnimation = game.pickCardAnimation;
        this.game.currentCard = game.currentCard;
      })
    });
  }

  newGame() {
    this.game = new Game();
    // let coll = collection(this.firestore, 'games')
    // addDoc(coll, this.game.toJson());
  }

  takeCard() {
    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop();
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.saveGame();
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 1000);
    }

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        console.log('The dialog was closed', name);
        this.game.players.push(name)
        this.saveGame();
      }
    });
  }

  saveGame() {
    const aCollection = doc(this.firestore, `games/${this.gameId}`);
    updateDoc(aCollection, this.game.toJson());
  }
}



