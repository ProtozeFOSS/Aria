import { Component, ElementRef, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AriaHeader } from './aria-header/aria-header.component';
import { AriaStatus } from './aria-status/aria-status.component';
import { CanvasChessBoard } from './canvas-chessboard/canvas-chessboard.component';
import { AriaScore } from './aria-score/aria-score.component';
import { AriaService } from './services/aria.service';
import { AriaControls } from './aria-controls/aria-controls.component';
import { LayoutService } from './services/layout.service';
import { ThemeService } from './services/themes.service';
import { TESTANNOTATION, TestPGNData } from './test-pgn';
import { AriaCMenu } from './aria-cmenu/aria-cmenu.component';

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
  @ViewChild(AriaCMenu) menuComponent!: AriaCMenu | null;
  @ViewChild('container') container!: ElementRef | null;
  @Output() gameScoreWidth: number = 389;
  
  resizing: number | null = null;
  constructor(public aria: AriaService,
    public theme: ThemeService,
    public layout: LayoutService,
    private route: ActivatedRoute){
      const date = new Date();
      this.aria.UUID = 'ARIA-' + date.getTime().toString();
      this.route.queryParams.subscribe(params => {
        if (params) {
          try {
            const decoded = atob(params.data);
            const settings_obj = JSON.parse(decoded);
            this.applyJsonSettings(settings_obj);
          } catch (any) {
          }
        }
      });
      this.aria.loadPGN(TESTANNOTATION + TestPGNData);
    }
    ngAfterViewInit() {
      window.onkeydown = this.aria.keyEvent.bind(this.aria);
      this.aria.attachAria(this);
      this.layout.initializeLayout(this);
      this.theme.initializeColorPalette();
      window['ARIA'] = {app: this, theme:this.theme, aria:this.aria, layout:this.layout};
      window.onresize = ()=>{
        this.layout.resizeLayout(this.container.nativeElement.clientWidth, window.innerHeight);
      };
      window.setTimeout(()=>{this.layout.resizeLayout(this.container.nativeElement.clientWidth, window.innerHeight);},30);
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

    public registerMenu(menu: AriaCMenu, element: HTMLElement): void {
      this.layout.cmenu = menu;
      this.layout.cmenuElement = element;
    }
  
    public applyJsonSettings(settings: object): boolean {
      if (settings) {
        // @ts-ignore
        if (settings.theme) {
          // @ts-ignore          
          if(settings.theme.board) {
            //@ts-ignore
            this.theme.setBoardTheme(settings.theme.board);
            //@ts-ignore
            delete settings.theme.board;
            this.canvasBoardComponent?.setTheme(this.theme.boardTheme);
            //@ts-ignore
            delete settings.theme.board;
            //@ts-ignore
            this.theme.setSettings(settings.theme);
          }
          // @ts-ignore
          this.theme.setSettings(settings.theme);
        }
        // @ts-ignore
        if(settings.layout) {
          // @ts-ignore
          this.layout.setSettings(settings.layout);
        }
        // @ts-ignore
        if(settings.aria) {
          // @ts-ignore
          this.aria.setSettings(settings.aria);
        }
        return true;
      }
      return false;
    }
  
    public applyDefaultSettings(): boolean {
      this.theme.initializeColorPalette();
      return true;
    }
  
    public getSettings(): object {
      const themeSettings = this.theme.settings();
      const layoutSettings = this.layout.settings();
      const ariaSettings = this.aria.settings();
      return { themes: themeSettings, layout: layoutSettings, aria: ariaSettings };
    }
  
    public getJsonSettings(): string {
      const themeSettings = this.theme.settings();
      const layoutSettings = this.layout.settings();
      const ariaSettings = this.aria.settings();
      return JSON.stringify({ themes: themeSettings, layout: layoutSettings, aria: ariaSettings });
    }
}
