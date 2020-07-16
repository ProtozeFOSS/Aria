import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { GameScoreType, GameScoreService, GameScoreItem } from '../../services/game-score.service';

@Component({
  selector: 'app-game-score-item',
  templateUrl: './game-score-item.component.html',
  styleUrls: ['./game-score-item.component.scss']
})
export class GameScoreItemComponent implements OnInit, AfterViewInit {
  @Input() data: GameScoreItem | null = null;
  @Input() type = GameScoreType.GameScoreGroup;
  @Input() typeName = '';
  constructor(public gameScoreService: GameScoreService)
  {
    this.typeName = this.gameScoreService.typeToString(this.type);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

  }

}
