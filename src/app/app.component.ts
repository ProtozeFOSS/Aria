import { Component, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AriaHeader } from './aria-header/aria-header.component';
import { AriaStatus } from './aria-status/aria-status.component';
import { CanvasChessBoard } from './canvas-chessboard/canvas-chessboard.component';
import { AriaScore } from './aria-score/aria-score.component';
import { AriaService } from './services/aria.service';
import { AriaControls } from './aria-controls/aria-controls.component';
import { LayoutService } from './services/layout.service';
import { ThemeService } from './services/themes.service';
import { TestPGNData } from '../test-pgn';
import { ElementRef } from '@angular/core';
enum JSRPC {
  setPGN = 'setPGN',
  onSettings = 'onSettings',
  getSettings = 'getSettings',
  scaleTo = 'scaleTo'
}


@Component({
  selector: 'aria',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class Aria {
  @ViewChild(AriaScore) gameScoreComponent: AriaScore;
  @ViewChild(CanvasChessBoard) canvasBoardComponent: CanvasChessBoard;
  @ViewChild(AriaControls) controlsComponent: AriaControls;
  @ViewChild(AriaHeader) headerComponent!: AriaHeader | null;
  @ViewChild(AriaStatus) statusComponent!: AriaStatus | null;
  @Output() gameScoreWidth: number = 389;
  @Output() oldWidth: number = 0;
  @Output() keymap: Map<string, any> = new Map<string, any>();
  resizing: number | null = null;
  constructor(public aria: AriaService,
    public themes: ThemeService,
    public layout: LayoutService,
    private route: ActivatedRoute){
      this.loadKeymap();
      const date = new Date();
      this.aria.UUID = 'ARIA-' + date.getTime().toString();
      this.route.queryParams.subscribe(params => {
        if (params) {
          try {
            console.log(params);
            const decoded = atob(params.settings);
            const settings_obj = JSON.parse(decoded);
            this.applyJsonSettings(settings_obj);
          } catch (any) {
  
          }
        }
      });
      console.log('ID: ' + this.aria.UUID);
    }
    ngAfterViewInit() {
      this.layout.boardElement = document.getElementById('ccb-' + this.aria.UUID);
      this.layout.controlsElement = document.getElementById('controls-' + this.aria.UUID);
      this.layout.statusElement = document.getElementById('status-' + this.aria.UUID);
      this.layout.headerElement = document.getElementById('header-' + this.aria.UUID);
      //this.layout.resizeElement = document.getElementById('resize-handle-' + this.aria.UUID);
  
      this.aria.attachAria(this);
      this.layout.initializeLayout(this);
      if (this.gameScoreComponent) {
        //this.gameScoreComponent.resizeHandleEvent = this.layout.onSliderDrag.bind(this.layout);
        //this.gameScoreComponent.resizeTouchEvent = this.layout.onSliderTouch.bind(this.layout);
      }
      this.themes.boardBGLight.subscribe((light) => {
        if (this.canvasBoardComponent) {
          this.canvasBoardComponent.setLightTile(light);
        }
      });
      this.themes.boardBGDark.subscribe((dark) => {
        if (this.canvasBoardComponent) {
          this.canvasBoardComponent.setDarkTile(dark);
        }
      });
      //this.aria.loadPGN(TestPGNData + this.pgnData.nativeElement.value);
      window.onkeydown = this.keyEvent.bind(this);
      window.onmessage = this.onMessage.bind(this);
      this.aria.loadSettings();
      this.themes.initializeColorPalette();
      window.onresize = ()=>{
        if(!this.resizing) {
          this.resizing = window.setTimeout(()=>{
            this.layout.resizeLayout(window.innerWidth, window.innerHeight);
            this.resizing = null;
          },10);
        }
      }
      window.setTimeout(()=>{this.layout.resizeLayout(window.innerWidth, window.innerHeight);},200);
      window.setTimeout(()=>{this.aria.loadPGN(TestPGNData);}, 180);
    }
    mouseMoved(event: MouseEvent): void {
      if (this.gameScoreComponent) {
        //this.gameScoreComponent.resizeHandleEvent(event);
        if (event.buttons === 0) {
        }
      }
    }
    public registerControls(controls: AriaControls, element: HTMLElement): void {
      this.layout.controls  = controls;
      this.layout.controlsElement = element;
    }
    public registerBoard(board: CanvasChessBoard, element: HTMLElement): void {
      this.layout.board  = board;
      this.layout.boardElement = element;
    }

    public autoPlayActive(): boolean {
      if (this.controlsComponent) {
        return this.controlsComponent.playing;
      }
      return false;
    }
  
    public applyJsonSettings(settings: object): boolean {
      if (settings) {
        // @ts-ignore
        if (settings[THEMES]) {
          // @ts-ignore
          this.themes.setSettings(settings[THEMES]);
        }
        return true;
      }
      return false;
    }
    private createParentMessage(type: string, data: any): string {
      let message = '';
      try {
        message = JSON.stringify({ type, data });
      } catch {
        console.log('Failed creating parent message for type:' + type);
        console.log(data);
      }
      return message;
    }
  
    public onMessage(event: any): void {
      if (event && event.data && (typeof event.data === 'string')) {
        let message_obj = null;
        try {
          message_obj = JSON.parse(event.data);
        } catch (error) {
          console.log('Bad JSON data - Window ARIA Message');
          console.log(error);
          return;
        }
        if (message_obj.type) {
          switch (message_obj.type) {
            case JSRPC.setPGN: {
              if (message_obj.pgn) {
                const pgn = message_obj.pgn;
                this.aria.loadPGN(pgn);
                //parent.postMessage('Loaded PGN succesfully.', parent.origin);
              }
              break;
            }
            case JSRPC.getSettings: {
              let message = this.createParentMessage(JSRPC.onSettings, this.getSettings());
              if (message.length) {
                parent.postMessage(message, parent.origin);
              }
              break;
            }
            case JSRPC.scaleTo: {
              if (message_obj.height && message_obj.width) {
                this.scaleTo(message_obj.width, message_obj.height);
              }
              break;
            }
            default: {
              console.log('Invalid ARIA Message:\n');
              console.log(event.data);
              break;
            }
          }
        }
      }
    }
  
    public saveSettings(settings: any) {
      let message = this.createParentMessage(JSRPC.onSettings, settings);
      if (message.length) {
        parent.postMessage(message, parent.origin);
      }
    }
  
    public scaleTo(width: number, height: number) {
  
    }
  
    public applyDefaultSettings(): boolean {
      this.themes.initializeColorPalette();
      return true;
    }
  
    public getSettings(): object {
      const themeSettings = this.themes.settings();
      const layoutSettings = this.layout.settings();
      const ariaSettings = this.aria.settings();
      return { themes: themeSettings, layout: layoutSettings, aria: ariaSettings };
    }
  
    public getJsonSettings(): string {
      const themeSettings = this.themes.settings();
      const layoutSettings = this.layout.settings();
      const ariaSettings = this.aria.settings();
      return JSON.stringify({ themes: themeSettings, layout: layoutSettings, aria: ariaSettings });
    }
  
  
    public toggleAutoPlay(): void {
      if (this.aria) {
        this.aria.toggleAutoPlay();
      }
    }
  
    protected loadKeymap(): void {
      // initial default keymap
      this.keymap.set('Space', () => { this.aria.toggleAutoPlay(); });
      this.keymap.set('Home', () => { this.aria.moveToStart(); });
      this.keymap.set('End', () => { this.aria.moveToEnd(); });
      this.keymap.set('ArrowRight', () => { this.aria.advance(); });
      this.keymap.set('ArrowLeft', () => { this.aria.previous(); });
      this.keymap.set('KeyI', () => { this.aria.rotateBoardOrientation(); });
    }
  
    keyEvent(event: any): void {
      console.log(event);
      if (this.keymap.has(event.code)) {
        console.log('Got this key: ' + event.code);
        const action = this.keymap.get(event.code);
        action();
      }
    }
  
    touchMoved(event: TouchEvent): void {
      if (this.gameScoreComponent) {
        //this.resizeTouchEvent(event);
      }
    }

}
