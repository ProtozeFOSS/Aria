import { Component, OnInit, Input, AfterViewInit, SimpleChanges, OnChanges, Output, ViewChild, ElementRef, ComponentFactoryResolver } from '@angular/core';
import { GameScoreType, GameScoreItem, ChessMove } from '../../common/kokopu-engine';
import { OlgaService } from '../../services/olga.service';
import { ColorService } from '../../services/colors.service';

@Component({
  selector: 'game-score-item',
  templateUrl: './game-score-item.component.html',
  styleUrls: ['./game-score-item.component.scss']
})
export class GameScoreItemComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() @Output() data: GameScoreItem = new GameScoreItem(null, -1);
  @Output() typeName = '';

  // visual nodes
  @Output() ply = '';
  @Output() score = '';
  GameScoreType = GameScoreType;
  @ViewChild('gsiPly') gsiPly: ElementRef | null = null;
  constructor(public olga: OlgaService, public colors:ColorService) {
    // use data to actually set type

  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      let newData = changes.data.currentValue as GameScoreItem;
      this.data = newData;
      if (this.data && this.gsiPly) {
        let showing = false;
        if (this.isFullPly()) {
          showing = this.olga.showingPly.value;
        } else {
          showing = this.olga.showingHalfPly.value;
        }
        if(!showing) {
          this.gsiPly.nativeElement.remove();
          this.gsiPly = null;
        }else{
          this.ply = this.data.move.fullMoveNumber().toString() + '.';
        }
      }
      if(this.data.move._info.moveDescriptor && typeof this.data.move._info.moveDescriptor != 'string'){ 
        this.score = this.data.move.notation();
      } else {
        this.score = this.data.move._info.moveDescriptor;
      }
      this.data.getType();
      this.updateTypeName();
    }
  }

  ngAfterViewInit(): void {
    this.updateTypeName();
    if(this.gsiPly) {
      let showing = false;
      if (this.isFullPly()) {
        showing = this.olga.showingPly.value;
      } else {
        showing = this.olga.showingHalfPly.value;
      }
      if(!showing) {
        this.gsiPly.nativeElement.remove();
        this.gsiPly = null;
      }else{
        window.setTimeout( ()=>{this.ply = this.data.move.fullMoveNumber().toString() + '.';},
        10);
      }
    }
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
    const variations = this.data.move.variations();
    if (variations.length > 0) {
      this.olga.displayVariations(this.data);
      // show variation 
      console.log('Taking first variation');
      console.log(variations[0]);
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
          this.typeName += ' Variation ';
      }
      if ((this.data.type & GameScoreType.Branched) == GameScoreType.Branched) { // must have a variation to be branched
          this.typeName += ' Branched';
      }
    }
  }
}
