import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'olga-controls',
  templateUrl: './olga-controls.component.html',
  styleUrls: ['./olga-controls.component.scss']
})
export class OlgaControlsComponent implements OnInit {

  constructor(public gameService: GameService) { }

  ngOnInit(): void {
  }

  advance(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.gameService.advance();
  }

  moveToStart(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.gameService.moveToStart();
  }

  previous(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.gameService.previous();
  }

  moveToEnd(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.gameService.moveToEnd();
  }
}
