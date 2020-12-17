import { AfterViewInit, Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GameScoreItem, GameScoreType } from 'src/app/common/kokopu-engine';
import { OlgaService } from 'src/app/services/olga.service';
import { ThemeService } from 'src/app/services/themes.service';

@Component({
  selector: 'table-item',
  templateUrl: './table-item.component.html',
  styleUrls: ['./table-item.component.scss']
})
export class TableItemComponent implements OnInit, AfterViewInit {
  @Input() whiteMove: GameScoreItem | null = null;
  @Input() blackMove: GameScoreItem | null = null;
  @Output() typeName = '';
  @Output() ply = '';
  @Output() whiteScore = '';
  @Output() blackScore = '';
  GameScoreType = GameScoreType;
  //@ViewChild('gsiPly') gsiPly!: ElementRef;

  constructor(public olga: OlgaService, public themes: ThemeService) { }

  ngOnInit(): void {
    this.ply = this.whiteMove?.move.fullMoveNumber().toString();
    if (this.ply == '' && this.blackMove) {
      this.ply = this.blackMove?.move.fullMoveNumber().toString();
    }
    if (this.whiteMove) {
      this.whiteScore = this.whiteMove.move.notation();
    }
    if (this.blackMove) {
      this.blackScore = this.blackMove.move.notation();
    }
  }

  ngAfterViewInit(): void {
    window.setTimeout(() => this.updateTypeName(), 10);
    if (this.whiteMove && this.whiteMove.move) {
      let showing = false;
      if (this.isFullPly()) {
        showing = this.olga.showingPly.value;
      } else {
        showing = this.olga.showingHalfPly.value;
      }
      if (!showing) {
        //this.gsiPly.nativeElement.remove();
      } else {
      }
    }

  }
  showPly(): boolean {
    if (this.whiteMove) {
      if (this.isFullPly()) {
        return this.olga.showingPly.value;
      }
      return this.olga.showingHalfPly.value;
    }
    return false;
  }
  isFullPly(): boolean {
    if (this.whiteMove) {
      return (this.whiteMove.type & GameScoreType.HalfPly) == 0;
    }
    return false;
  }
  setSelected(select: boolean): void {
    if (this.whiteMove) {
      if (select) {
        this.whiteMove.type = (this.whiteMove.type | GameScoreType.Selected);
        this.updateTypeName();
        return;
      }
      if (this.whiteMove.type >= GameScoreType.Selected) {
        this.whiteMove.type = this.whiteMove.type ^ GameScoreType.Selected;
      }
      this.updateTypeName();
    }
  }


  isSelected(): boolean {
    if (this.whiteMove) {
      return (this.whiteMove.type & GameScoreType.Selected) == GameScoreType.Selected;
    }
    return false;
  }

  getPly(): number {
    if (this.whiteMove && this.whiteMove.move) {
      return this.whiteMove.move.fullMoveNumber();
    }
    return -1;
  }

  isGroup(): boolean {
    if (this.whiteMove) {
      return (this.whiteMove.type & GameScoreType.Group) == GameScoreType.Group;
    }
    return false;
  }

  isAnnotation(): boolean {
    if (this.whiteMove) {
      return (this.whiteMove.type & GameScoreType.Annotation) == GameScoreType.Annotation;
    }
    return false;
  }

  clickMove(): void {
    if (this.whiteMove && this.whiteMove.move) {
      const variations = this.whiteMove.move.variations();
      if (variations.length > 0) {
        this.olga.displayVariations(this.whiteMove);
        // show variation 
        console.log('Taking first variation');
        console.log(variations[0]);
      }
    }
  }

  protected updateTypeName(): void {
    this.typeName = '';
    if (this.whiteMove) {
      const value = this.whiteMove.type & GameScoreType.Selected;
      if ((this.whiteMove.type & GameScoreType.Selected) == GameScoreType.Selected) {
        this.typeName += ' Current';
      }
      if ((this.whiteMove.type & GameScoreType.Annotation) == GameScoreType.Annotation) {
        this.typeName += ' Annotation ';
      }
      if ((this.whiteMove.type & GameScoreType.Group) == GameScoreType.Group) {
        this.typeName += ' Group ';
      }
      if ((this.whiteMove.type & GameScoreType.HalfPly) == GameScoreType.HalfPly) {
        this.typeName += ' HalfPly ';
      }
      if (this.whiteMove.move) {
        const variations = this.whiteMove.move.variations();
        if (variations && variations.length > 0) {
          this.typeName += ' Variation ';
        }

        if ((this.whiteMove.type & GameScoreType.Branched) == GameScoreType.Branched) { // must have a variation to be branched
          this.typeName += ' Branched';
        }
      }
    }
  }
}
