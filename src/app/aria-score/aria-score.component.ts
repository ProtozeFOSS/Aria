import { Component, OnInit, ViewChild } from '@angular/core';
import { GameScoreType } from '../common/kokopu-engine';
import { AriaService, ScoreViewType } from '../services/aria.service';
import { LayoutService } from '../services/layout.service';
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

  container: HTMLElement | null = null;
  GameScoreType = GameScoreType;
  ScoreViewType = ScoreViewType;


  constructor(public aria: AriaService, public layout: LayoutService) {
    this.layout.attachScore(this);
    this.aria.attachScore(this);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.layout.gameScoreElement = this.container = document.getElementById('score-' + this.aria.UUID);
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
    if (this.container) {
      if(height <= 0) { 
        this.container.style.height = 'auto';        
      }else {
        this.container.style.height = height + 'px';
        this.container.style.overflowY = 'auto';
      }
      this.container.style.width = width + 'px';
    }
    if (this.flowScore) {
      this.flowScore.resize(width, height);
    }
    if (this.tableScore) {
      this.tableScore.resize(width, height);
    }
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

}
