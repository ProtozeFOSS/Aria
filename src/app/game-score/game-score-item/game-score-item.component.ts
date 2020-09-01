import { Component, OnInit, Input, AfterViewInit, SimpleChanges, OnChanges, Output } from '@angular/core';
import { GameScoreType, GameService, GameScoreItem } from '../../services/game.service';
import { OlgaService } from 'src/app/services/olga.service';

@Component({
  selector: 'app-game-score-item',
  templateUrl: './game-score-item.component.html',
  styleUrls: ['./game-score-item.component.scss']
})
export class GameScoreItemComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() @Output() data: GameScoreItem = new GameScoreItem(null, -1);
  @Output() typeName = '';

  // visual nodes
  public plyOn = false;
  public ply = '';
  GameScoreType = GameScoreType;
  constructor(public olga: OlgaService, public gameService: GameService) {
    // use data to actually set type

  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      let newData = changes.data.currentValue as GameScoreItem;
      this.data = newData;
      if (this.data) {
        if (this.isFullPly()) {
          this.plyOn = this.olga.showingPly.value;
        } else {
          this.plyOn = this.olga.showingHalfPly.value;
        }
      }
      this.ply = this.data.move.fullMoveNumber().toString() + '.';
      this.data.getType();
      this.updateTypeName();
    }
  }

  ngAfterViewInit(): void {
    this.updateTypeName();
  }

  showPly(): boolean {
    if (this.data) {
      if (this.isFullPly()) {
        return this.olga.showingPly.value;
      }
      return this.olga.showingHalfPly.value;
    }
    return false;
  }
  isFullPly(): boolean {
    if (this.data) {
      return (this.data.type & GameScoreType.HalfPly) == 0;
    }
    return false;
  }
  setCurrent(current: boolean): void {
    if (this.data) {
      this.updateTypeName(current);
    }
  }
  getPly(): number {
    if (this.data && this.data.move) {
      return this.data.move.fullMoveNumber();
    }
    return -1;
  }

  isGroup(): boolean {
    if (this.data) {
      return (this.data.type & GameScoreType.Group) == 1;
    }
    return false;
  }

  isAnnotation(): boolean {
    if (this.data) {
      return (this.data.type & GameScoreType.Annotation) == 1;
    }
    return false;
  }

  clickMove(): void {
    if (this.data.move.variations().length > 0) {
      this.gameService.displayVariations(this.data);
    }
  }

  protected updateTypeName(current = false): void {
    //this.typeName = '';
    if (this.data) {
      if ((this.data.type & GameScoreType.Annotation) == 1) {
        this.typeName += 'Annotation ';
      }
      if ((this.data.type & GameScoreType.Group) == 1) {
        this.typeName += 'Group ';
      }
      if ((this.data.type & GameScoreType.HalfPly) == 1) {
        this.typeName += 'HalfPly ';
      }
      const variations = this.data.move.variations();
      if (variations && variations.length > 0) {
        this.typeName += 'Variation ';
      } else {
        console.log('No Variations found -> ' + this.data.move.notation())
      }
    }
  }
}
