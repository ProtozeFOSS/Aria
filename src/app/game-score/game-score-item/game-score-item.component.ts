import { Component, OnInit, Input, AfterViewInit, SimpleChanges, OnChanges, Output } from '@angular/core';
import { GameScoreType, GameScoreItem } from '../../common/kokopu-engine';
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
  constructor(public olga: OlgaService) {
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
  setSelected(select: boolean): void {
    if (this.data) {
      if (select) {
        this.data.type = (this.data.type | GameScoreType.Selected);
        this.updateTypeName();
        return;
      }
      if (this.data.type >= GameScoreType.Selected) {
        this.data.type = this.data.type ^ GameScoreType.Selected;
      }
      this.updateTypeName();
    }
  }


  isSelected(): boolean {
    if (this.data) {
      return (this.data.type & GameScoreType.Selected) == GameScoreType.Selected;
    }
    return false;
  }

  getPly(): number {
    if (this.data && this.data.move) {
      return this.data.move.fullMoveNumber();
    }
    return -1;
  }

  isGroup(): boolean {
    if (this.data) {
      return (this.data.type & GameScoreType.Group) == GameScoreType.Group;
    }
    return false;
  }

  isAnnotation(): boolean {
    if (this.data) {
      return (this.data.type & GameScoreType.Annotation) == GameScoreType.Annotation;
    }
    return false;
  }

  clickMove(): void {
    if (this.data.move.variations().length > 0) {
      this.olga.displayVariations(this.data);
      this.olga.navigateToItem(this.data);
    } else {
      this.olga.navigateToItem(this.data);
    }
  }

  protected updateTypeName(): void {
    this.typeName = '';
    if (this.data) {
      const value = this.data.type & GameScoreType.Selected;
      if ((this.data.type & GameScoreType.Selected) == GameScoreType.Selected) {
        this.typeName += ' Current';
      }
      if ((this.data.type & GameScoreType.Annotation) == GameScoreType.Annotation) {
        this.typeName += ' Annotation ';
      }
      if ((this.data.type & GameScoreType.Group) == GameScoreType.Group) {
        this.typeName += ' Group ';
      }
      if ((this.data.type & GameScoreType.HalfPly) == GameScoreType.HalfPly) {
        this.typeName += ' HalfPly ';
      }
      const variations = this.data.move.variations();
      if (variations && variations.length > 0) {
        if ((this.data.type & GameScoreType.Branched) == GameScoreType.Branched) { // must have a variation to be branched
          this.typeName += ' Branched ';
        } else {
          this.typeName += ' Variation ';
        }
      }
    }
  }
}
