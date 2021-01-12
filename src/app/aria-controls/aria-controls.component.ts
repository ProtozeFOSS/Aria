import { Component, OnInit } from '@angular/core';
import { AriaService, ScoreViewType } from '../services/aria.service';
import { LayoutService } from '../services/layout.service';

@Component({
  selector: 'aria-controls',
  templateUrl: './aria-controls.component.html',
  styleUrls: ['./aria-controls.component.scss']
})
export class AriaControls implements OnInit {
  public playing = false
  public timeLeft = 0.6;
  ScoreViewType = ScoreViewType;
  constructor(public aria: AriaService, public layout: LayoutService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.aria.attachControls(this);
  }

  public resize(width: number, height: number) {

  }
  advance(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.aria.advance();
  }

  moveToStart(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.aria.moveToStart();
  }

  previous(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.aria.previous();
  }

  moveToEnd(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.aria.moveToEnd();
  }

  pauseIfAutoPlay(): boolean {
    if (this.playing) {
      this.aria.toggleAutoPlay();
      return true;
    }
    return false;
  }

  toggleAutoPlay(): void {
    this.aria.toggleAutoPlay();
  }
  public setTimer(time: number) {
    this.timeLeft = time / 1000;
  }

}
