import { ElementRef, Input } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GameScoreType } from '../common/kokopu-engine';
import { AriaService, ScoreViewType } from '../services/aria.service';
import { LayoutService } from '../services/layout.service';
import { ThemeService } from '../services/themes.service';
import { ScoreFlow } from './score-flow/score-flow.component';
import { ScoreTable } from './score-table/score-table.component';

@Component({
  selector: 'aria-score',
  templateUrl: './aria-score.component.html',
  styleUrls: ['./aria-score.component.scss']
})
export class AriaScore implements OnInit {

  @ViewChild(ScoreFlow) flowScore: ScoreFlow | null;
  @ViewChild(ScoreTable) tableScore: ScoreTable | null;
  flowScoreElement: HTMLElement | null = null;
  flowTableElement: HTMLElement | null = null;
  @ViewChild('container') container!: ElementRef | null;
  @ViewChild('title') title!: ElementRef | null;
  GameScoreType = GameScoreType;
  ScoreViewType = ScoreViewType;
  @Input() fontScale = 1.0; //TODO: Move out to Aria
  scaleText = (Math.round(this.fontScale * 100) + '%').padStart(4,"\u200D");
  scaleTimer = null;

  constructor(public aria: AriaService, public layout: LayoutService, public theme: ThemeService) {

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.aria.attachScore(this);
    
    if (this.flowScore) {
      //this.flowScore.container = document.getElementById('score-flow-' + this.aria.UUID);
    }
    if (this.tableScore) {
      this.flowTableElement = document.getElementById('score-table-' + this.aria.UUID);
    }
  }

  public clearSelection(): void {
    if (this.flowScore) {
      this.flowScore.clearSelection();
    }
    if (this.tableScore) {
      this.tableScore.clearSelection();
    }
  }


  public updateSelection(): void {
    window.setTimeout(() => { this.selectGameScoreItem(this.aria.currentIndex); }, 5);
  }

  resize(width: number, height: number) {
    if (height == 0 || width == 0) {
      return;
    }
    if (this.container && this.title && this.container.nativeElement) {
      let div = this.container.nativeElement;
      const border = document.documentElement.style.getPropertyValue('--gsBorder');
      const borderWidth = (parseFloat(border) * 2);
      if(borderWidth) {
        width -= borderWidth;
        height -= borderWidth;
      }
      if(height <= 0) { 
        div.style.height = 'auto';        
      }else {
        div.style.height = height + 'px';
        div.style.overflowY = 'hidden';
      }
      if(width <= 0) {
        div.style.width ='100%';
        div.style.maxWidth = '';
      } else {
        div.style.width = width + 'px';
        div.style.maxWidth = width + 'px';
      }
    } 
    if(this.title) {
      height -= this.title.nativeElement.clientHeight;
    }   
    if (this.flowScore) {
      this.flowScore.resize(width, height);
    }
    if (this.tableScore) {
      this.tableScore.resize(width, height);
    }
  }

  startShrink(): void {
    this.shrinkFont();
    this.scaleTimer = setInterval(()=>{this.shrinkFont();},160)
  }

  stopShrink(): void {
    clearInterval(this.scaleTimer);
  }

  startGrow(): void {
    this.growFont();
    this.scaleTimer = setInterval(()=>{this.growFont();},160)
  }

  stopGrow(): void {
    clearInterval(this.scaleTimer);
  }

  growFont(): void {
    this.fontScale += .01;
    this.scaleText = (Math.round(this.fontScale * 100) + '%').padStart(4,"\u200D");
    this.theme.rescaleScoreFont(this.fontScale);
  }

  shrinkFont(): void {
    this.fontScale = this.fontScale - .01;
    if(this.fontScale < 0.02) {
      this.fontScale = 0.02;
    }
    this.scaleText = (Math.round(this.fontScale * 100) + '%').padStart(4,"\u200D");
    this.theme.rescaleScoreFont(this.fontScale);
  }

  ignoreEvent(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }


  selectGameScoreItem(index: number) {
    if (this.flowScore) {
      this.flowScore.selectGameScoreItem(index);
    } else if (this.tableScore) {
      this.tableScore.selectGameScoreItem(index);
      window.setTimeout(this.tableScore.updateViewSize, 100);
    }
  }


  // Navigation
  public takeVariation(index: number) {
    this.aria.navigateToNode(index - 1);
    window.setTimeout(() => {
      if (this.aria.currentItem) {
        const item = this.aria.gameScoreItems[++this.aria.currentIndex];
        const variations = item.move.variations();
        if (variations.length > 0) {
          // show variation 
          console.log('Taking first variation');
          console.log(variations[0]);
          this.aria.makeVariantMove(0, item.move);
          this.updateSelection();
        }
      }
    }, 200);
  }

  getSettingsObject(): object{
    let settings = {};
    // add fontScale and other Score specific settings (score view type).
    return settings;
  }

}
