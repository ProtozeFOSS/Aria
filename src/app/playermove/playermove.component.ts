import { Component, OnInit, Input } from '@angular/core';
import { GameScoreService } from '../services/game-score.service';

@Component({
  selector: 'app-playermove',
  templateUrl: './playermove.component.html',
  styleUrls: ['./playermove.component.scss']
})
export class PlayermoveComponent implements OnInit {
  @Input() move: string = '';
  @Input() black = false;
  constructor(public gameScoreService: GameScoreService) { }

  ngOnInit(): void {

  }

}
