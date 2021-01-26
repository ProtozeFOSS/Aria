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
import { ElementRef } from '@angular/core';
enum JSRPC {
  setPGN = 'setPGN',
  onSettings = 'onSettings',
  getSettings = 'getSettings',
  layoutChanged = 'layoutChanged',
  setSize = 'setSize'
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
            const decoded = atob(params.settings);
            const settings_obj = JSON.parse(decoded);
            console.log(settings_obj);
            this.applyJsonSettings(settings_obj);
          } catch (any) {
  
          }
        }
      });
      console.log('ID: ' + this.aria.UUID);
    }
    ngAfterViewInit() {
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
      window.onkeydown = this.keyEvent.bind(this);
      window.onmessage = this.onMessage.bind(this);
      this.aria.attachAria(this);
      this.layout.initializeLayout(this);
      this.themes.initializeColorPalette();
      window.onresize = ()=>{this.layout.resizeLayout(window.innerWidth, window.innerHeight);};
      window.setTimeout(()=>{this.layout.resizeLayout(window.innerWidth, window.innerHeight);},20);
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

    public registerScore(score: AriaScore, element: HTMLElement): void {
      this.layout.gameScore  = score;
      this.layout.gameScoreElement = element;
    }

    public registerHeader(header: AriaHeader, element: HTMLElement): void {
      this.layout.header = header;
      this.layout.headerElement = element;
    }

    public registerStatus(status: AriaStatus, element: HTMLElement): void {
      this.layout.status = status;
      this.layout.statusElement = element;
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
        if (settings.theme) {
          // @ts-ignore
          this.themes.setSettings(settings.theme);
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

    private postMessage(message){
      if(message.length && self!=top){
        parent.postMessage(message, parent.origin);
      }
    }

    public sendLayoutChanged(state: number): void {
        this.postMessage(this.createParentMessage(JSRPC.layoutChanged, {width:document.body.scrollWidth,height:document.body.scrollHeight,state}));
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
                this.postMessage(message);
              break;
            }
            case JSRPC.setSize: {
              if (message_obj.height && message_obj.width) {
                this.layout.resizeLayout(message_obj.width, message_obj.height);
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
        this.postMessage(message);
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
