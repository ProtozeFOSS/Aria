import { Component, OnInit, Input, AfterViewInit, Output } from '@angular/core';
import { GameScoreItem } from '../../common/kokopu-engine';

@Component({
  selector: 'score-item-menu',
  templateUrl: './score-item-menu.component.html',
  styleUrls: ['./score-item-menu.component.scss']
})

export class ScoreItemMenu implements OnInit, AfterViewInit {
  @Input() data: GameScoreItem | null = null
  @Input() menuTitle = 'Menu Title';
  @Output() variations = [];
  @Output() item: any = null;
  public open = false;
  constructor() { }

  ngOnInit(): void {
    if(this.data) {
      this.variations = this.data.move.variations();
    }
  }

  ngAfterViewInit(): void {
  }

  ignoreEvent(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  openAt(item: GameScoreItem): void {
    this.data = item;
    this.variations = this.data.move.variations();
    this.menuTitle = item.move.notation();
    this.open = true;
  }

  resize(size: {width: number, height: number}) : void {

  }
}
