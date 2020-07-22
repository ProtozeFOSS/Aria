import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { GameScoreItem } from 'src/app/services/game-score.service';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-menu-game-score-item',
  templateUrl: './menu-game-score-item.component.html',
  styleUrls: ['./menu-game-score-item.component.scss']
})

export class MenuGameScoreItemComponent implements OnInit, AfterViewInit{
  @Input() data: GameScoreItem | null = null
  @Input() menuTitle = 'Menu Title';
  public open = false;
  @ViewChild(MatMenuTrigger) matMenuTrigger: MatMenuTrigger | null = null;
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.matMenuTrigger?.menuClosed.subscribe(() => {
      console.log('Menu closed');
    });
  }

  ignoreEvent(event: MouseEvent): void {
    console.log('Ignoring ' + event);
    event.preventDefault();
    event.stopPropagation();
  }

  openAt(item: GameScoreItem): void {
    this.open = true;
  }
}
