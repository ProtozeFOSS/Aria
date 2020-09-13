import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { GameScoreItem } from '../../common/kokopu-engine';

@Component({
  selector: 'game-score-item-menu',
  templateUrl: './menu-game-score-item.component.html',
  styleUrls: ['./menu-game-score-item.component.scss']
})

export class GameScoreItemMenu implements OnInit, AfterViewInit {
  @Input() data: GameScoreItem | null = null
  @Input() menuTitle = 'Menu Title';
  public open = false;
  @ViewChild(MatMenuTrigger) matMenuTrigger: MatMenuTrigger | null = null;
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.matMenuTrigger?.menuClosed.subscribe(() => {
      //console.log('Menu closed');
    });
  }

  ignoreEvent(event: MouseEvent): void {
    //console.log('Ignoring ' + event);
    event.preventDefault();
    event.stopPropagation();
  }

  openAt(item: GameScoreItem): void {
    this.data = item;
    this.menuTitle = item.move.notation();
    this.open = true;
  }
}
