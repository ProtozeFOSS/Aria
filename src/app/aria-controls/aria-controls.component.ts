import { ElementRef } from '@angular/core';
import { Component, Renderer2, OnInit, ViewChild } from '@angular/core';
import { AriaService, ScoreViewType } from '../services/aria.service';
import { LayoutService } from '../services/layout.service';

const icons = {
  Settings : 'sliders',
  Pawn : 'pawn-icon',
  Flip : 'refresh-cw',
  Play : 'play',
  Pause : 'pause',
  Start: 'rewind',
  Previous: 'chevron-left',
  Next: 'chevron-right',
  End: 'fast-forward'
}


@Component({
  selector: 'aria-controls',
  templateUrl: './aria-controls.component.html',
  styleUrls: ['./aria-controls.component.scss']
})
export class AriaControls implements OnInit {
  public playing = false
  public timeLeft = '';
  ScoreViewType = ScoreViewType;
  @ViewChild('autoPlay') autoPlay!: ElementRef | null;
  @ViewChild('rotateBoard') rotateBoard!: ElementRef | null;
  @ViewChild('shrinkBoard') shrinkBoard!: ElementRef | null;
  @ViewChild('growBoard') growBoard!: ElementRef | null;
  @ViewChild('settings') settings!: ElementRef | null;
  @ViewChild('start') start!: ElementRef | null;
  @ViewChild('previous') previous!: ElementRef | null;
  @ViewChild('next') next!: ElementRef | null;
  @ViewChild('end') end!: ElementRef | null;
  icons = icons;
  constructor(private renderer: Renderer2, public aria: AriaService, public layout: LayoutService) { }

  ngOnInit(): void {
    this.setTimer(this.aria.autoPlaySpeed.value)
  }
  ngAfterViewInit(): void {
    this.setInteractive(this.aria.interactiveControls);
    this.aria.attachControls(this);
  }

  public setInteractive(interactive: boolean) {
    if(this.autoPlay){
      this.autoPlay.nativeElement.onclick = (interactive ? this.aria.toggleAutoPlay.bind(this.aria):null);
    }
    if(this.rotateBoard){
      this.rotateBoard.nativeElement.onclick = (interactive ? this.aria.rotateBoardOrientation.bind(this.aria):null);
    }
    if(this.shrinkBoard){
      this.shrinkBoard.nativeElement.onclick = (interactive ? this.layout.shrink.bind(this.layout):null);
    }
    if(this.growBoard){
      this.growBoard.nativeElement.onclick = (interactive ? this.layout.grow.bind(this.layout):null);
    }
    // To Do: Move Toggle Score View to Score button tab
    if(this.settings){
      this.settings.nativeElement.onclick = (interactive ? this.aria.openSettings.bind(this.aria):null);
    }
    if(this.start){
      this.start.nativeElement.onclick = (interactive ? this.aria.moveToStart.bind(this.aria):null);
    }
    if(this.previous){
      this.previous.nativeElement.onclick = (interactive ? this.aria.previous.bind(this.aria):null);
    }
    if(this.next){
      this.next.nativeElement.onmouseup = (interactive ? this.aria.advance.bind(this.aria):null);
    }
    if(this.end){
      this.end.nativeElement.onclick = (interactive ? this.aria.moveToEnd.bind(this.aria):null);
    }
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
      this.renderer.setStyle(this.growBoard.nativeElement, 'right', ((width * .08) + 2) + 'px');
      this.renderer.setStyle(this.growBoard.nativeElement, 'width',  '12%');
      this.renderer.setStyle(this.settings.nativeElement, 'right', '2px');
      this.renderer.setStyle(this.settings.nativeElement, 'width',  '16%');
    } else {
      this.renderer.setStyle(this.growBoard.nativeElement, 'right', '2px');
      this.renderer.setStyle(this.settings.nativeElement, 'width', '0px');
      this.renderer.setStyle(this.growBoard.nativeElement, 'width',  '16%');
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
  pauseIfAutoPlay(): boolean {
    if (this.playing) {
      this.aria.toggleAutoPlay();
      return true;
    }
    return false;
  }

  public setTimer(time: number) {
    this.timeLeft = String((time / 1000));
    if(this.timeLeft.indexOf('.') > 0) {
      this.timeLeft = String(this.timeLeft).padEnd(4,'0');
    }
    this.timeLeft += 's';
  }

}
