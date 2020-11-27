import { Component, OnInit } from '@angular/core';
import { OlgaService } from '../services/olga.service';
import { LayoutService } from '../services/layout.service';

@Component({
  selector: 'olga-controls',
  templateUrl: './olga-controls.component.html',
  styleUrls: ['./olga-controls.component.scss']
})
export class OlgaControlsComponent implements OnInit {

  constructor(public olga: OlgaService, public layout: LayoutService) { }
  public playing = false
  public timeLeft = 0.6;
  ngOnInit(): void {
  }

  public resize(width: number, height: number, state: number) {

  }

  advance(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.olga.advance();
  }

  moveToStart(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.olga.moveToStart();
  }

  previous(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.olga.previous();
  }

  moveToEnd(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.olga.moveToEnd();
  }

  toggleAutoPlay():void {
    this.olga.toggleAutoPlay();
  }
  public setTimer(time: number) {
    this.timeLeft = time/1000;
  }
}
