import { ElementRef } from '@angular/core';
import { Component, Renderer2, OnInit, ViewChild } from '@angular/core';
import { AriaService, ScoreViewType } from '../services/aria.service';
import { LayoutService } from '../services/layout.service';

@Component({
  selector: 'aria-controls',
  templateUrl: './aria-controls.component.html',
  styleUrls: ['./aria-controls.component.scss']
})
export class AriaControls implements OnInit {
  public playing = false
  public timeLeft = '';
  ScoreViewType = ScoreViewType;
  @ViewChild('settings') settings!: ElementRef | null;
  @ViewChild('view') view!: ElementRef | null;
  @ViewChild('start') start!: ElementRef | null;
  @ViewChild('previous') previous!: ElementRef | null;
  @ViewChild('next') next!: ElementRef | null;
  @ViewChild('end') end!: ElementRef | null;
  constructor(private renderer: Renderer2, public aria: AriaService, public layout: LayoutService) { }

  ngOnInit(): void {
    this.setTimer(this.aria.autoPlaySpeed.value)
  }
  ngAfterViewInit(): void {
    this.aria.attachControls(this);
  }

  public resize(width: number, height: number) {
    const border = document.documentElement.style.getPropertyValue('--csBorder2NV');
    let borderWidth = (parseFloat(border) * 2);
    if(borderWidth) {
      width -= (borderWidth * 4);
    } else {
      borderWidth = 8;
    }
    if(this.aria.showSettings.value) {
      this.renderer.setStyle(this.settings.nativeElement, 'width', '8%');
      this.renderer.setStyle(this.view.nativeElement, 'right', ((width * .08) + 2) + 'px');
      this.renderer.setStyle(this.view.nativeElement, 'width',  '12%');
    } else {
      this.renderer.setStyle(this.view.nativeElement, 'right', '2px');
      this.renderer.setStyle(this.settings.nativeElement, 'width', '0px');
      this.renderer.setStyle(this.view.nativeElement, 'width',  '16%');
    }
    let startW = Math.ceil(width* .125);
    startW = (startW % 2 == 0) ? startW : startW + 1;
    let length = startW + 2;
    this.renderer.setStyle(this.start.nativeElement, 'width', startW + 'px');
    this.renderer.setStyle(this.previous.nativeElement, 'left', length + 'px');
    let prevW = Math.ceil(width * .22);
    prevW = (prevW % 2 == 0) ? prevW : prevW + 1;
    length += prevW + 2;
    this.renderer.setStyle(this.previous.nativeElement, 'width', prevW + 'px');
    this.renderer.setStyle(this.next.nativeElement, 'left', length + 'px');
    let nextW = Math.ceil(width * .5);
    nextW = (nextW % 2 == 0) ? nextW : nextW + 1;
    length += nextW;
    this.renderer.setStyle(this.next.nativeElement, 'width', nextW + 'px');
    this.renderer.setStyle(this.end.nativeElement, 'width', ((width - length) - borderWidth) + 'px');
  }
  forward(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.aria.advance();
  }

  moveToStart(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.aria.moveToStart();
  }

  back(event: MouseEvent): void {
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
    this.timeLeft = (time / 1000) + 's';
  }

}
