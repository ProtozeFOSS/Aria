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
  GameScoreType = GameScoreType;
  constructor(public gameScoreService: GameScoreService) {
    // use data to actually set type

  }

  ngOnInit(): void {
    if (this.data && this.data.type) {
      this.type = this.data.type;
      this.typeName = this.gameScoreService.typeToString(this.type) + (this.data.current ? ' current-move' : '');
    } else {
      this.typeName = this.gameScoreService.typeToString(this.type);
    }
  }

  ngAfterViewInit(): void {
  }
  showPly(): boolean {
    if (this.data && this.data.moveData) {
      if (this.data.moveData.ply == Math.ceil(this.data.moveData.ply)) {
        return this.gameScoreService.showingPly.value;
      }
      return this.gameScoreService.showingHalfPly.value;
    }
    return false;
  }
  isFullPly(): boolean {
    if (this.data && this.data.moveData) {
      return this.data.moveData.ply == Math.ceil(this.data.moveData.ply);
    }
    return false;
  }
}
