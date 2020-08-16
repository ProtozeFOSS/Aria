import { Component, OnInit, Input, AfterViewInit, SimpleChanges, OnChanges, Output } from '@angular/core';
import { GameScoreType, GameService, GameScoreItem } from '../../services/game.service';
import { OlgaService } from 'src/app/services/olga.service';

@Component({
  selector: 'app-game-score-item',
  templateUrl: './game-score-item.component.html',
  styleUrls: ['./game-score-item.component.scss']
})
export class GameScoreItemComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() @Output() data: GameScoreItem | null = null;
  @Output() type = GameScoreType.GameScoreGroup;
  @Output() typeName = '';
  GameScoreType = GameScoreType;
  constructor(public olga: OlgaService, public gameService: GameService) {
    // use data to actually set type

  }

  ngOnInit(): void {
    if (this.data && this.data.type) {
      this.type = this.data.type;
      this.typeName = this.gameService.typeToString(this.type) + (this.data.current ? ' current-move' : '');
    } else {
      this.typeName = this.gameService.typeToString(this.type);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      let newData = changes.data.currentValue as GameScoreItem;
      this.data = newData;
    }
    this.updateTypeName();
  }

  ngAfterViewInit(): void {

  }

  showPly(): boolean {
    if (this.data && this.data.moveData) {
      if (this.data.moveData.ply == Math.ceil(this.data.moveData.ply)) {
        return this.olga.showingPly.value;
      }
      return this.olga.showingHalfPly.value;
    }
    return false;
  }
  isFullPly(): boolean {
    if (this.data && this.data.moveData) {
      return this.data.moveData.ply == Math.ceil(this.data.moveData.ply);
    }
    return false;
  }
  setCurrent(current: boolean): void {
    if (this.data) {
      this.data.current = current;
      this.updateTypeName();
    }
  }
  protected updateTypeName(): void {
    if (this.data && this.data.type) {
      this.type = this.data.type;
      this.typeName = this.gameService.typeToString(this.type) + (this.data.current ? ' current-move' : '');
    } else {
      this.typeName = this.gameService.typeToString(this.type);
    }
  }
}
