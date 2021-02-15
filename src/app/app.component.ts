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
//import { TESTANNOTATION, TestPGNData } from './test-pgn';
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
  @ViewChild('container') container!: ElementRef | null;
  @Output() gameScoreWidth: number = 389;
  @Output() oldWidth: number = 0;
  
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
      //this.aria.setPGNMetaHash('eyJTMkZ6Y0dGeWIzWWdMU0JMWVhKd2IzWWdWMjl5YkdRZ1EyaGhiWEJwYjI1emFHbHdJRTFoZEdOb1IyRnljbmtnUzJGemNHRnliM1pCYm1GMGIyeDVJRXRoY25CdmRsZGxaQ0JQWTNRZ01qUWdNVGs1TUZKdmRXNWtJRFk9Ijp7Im9wZW5pbmciOiJTcGFuaXNoIEdhbWU6IENsb3NlZCBWYXJpYXRpb25zLiBLZXJlcyBEZWZlbnNlIChDOTIpIiwiY291bnRyeSI6InVzIn0sIlYyOXliR1FnU25WdWFXOXlJRU5vWVcxd2FXOXVjMmhwY0VWblpXMWxiaUJIZFd4a1pXNUJibVJ5WldrZ1RXRmpiM1psYVZkbFpDQlRaWEFnTURVZ01qQXhPRkp2ZFc1a0lERXVOalU9Ijp7Im9wZW5pbmciOiJGb3JtYXRpb246IEtpbmcncyBJbmRpYW4gQXR0YWNrIChBMDcpIiwiY291bnRyeSI6InRyIn0sIlYyVnpkR1Z5YmlCUGNHVnVTR0Z1Y3lCQ1pYSnNhVzVsY2xKdlltVnlkQ0JLWVcxbGN5QkdhWE5qYUdWeVUzVnVJRXAxYkNBd055QXhPVFl6VW05MWJtUWdPQSI6eyJvcGVuaW5nIjoiUXVlZW4ncyBHYW1iaXQgRGVjbGluZWQ6IEV4Y2hhbmdlIFZhcmlhdGlvbiAoRDM1KSIsImNvdW50cnkiOiJ1cyJ9LCJHYXJyeSBLYXNwYXJvdiI6eyJib3JuIjoiQXByaWwgMTN0aCAxOTYzIiwiaW1hZ2UiOiJHYXJyeS1LYXNwYXJvdi5wbmciLCJlbG8iOjI4MTIsIkZ1biBGYWN0IjoiVGhpcyBpcyBqdXN0IGEgbm90ZSBhZGRlZC4ifSwiQW5hdG9seSBLYXJwb3YiOnsiaW1hZ2UiOiJBbmF0b2x5LUthcnBvdi5wbmciLCJlbG8iOjI2MTcsImJvcm4iOiJNYXkgMjN0aCAxOTUxIiwiUmFuZG9tIENHIFN0YXRpc3RpYyI6IjI0JSAxLTAgNTUlIDAtMSAyMSUgMC0wIiwiV2lucyBvbiBQbGF5em9uZSI6MjM4LCJGYXZvcml0ZSBGb3JtYXQiOiJDaGVzczk2MCJ9LCJFZ2VtZW4gR3VsZGVuIjp7ImJvcm4iOiIyMDAwIiwiaW1hZ2UiOiJFZ2VtZW4tR3VsZGVuLnBuZyIsImVsbyI6MjExOH0sIkFuZHJlaSBNYWNvdmVpIjp7ImJvcm4iOiIyMDAwIiwiaW1hZ2UiOiJBbmRyZWktTWFjb3ZlaS5wbmciLCJlbG8iOjI0NTN9LCJSb2JlcnQgSmFtZXMgRmlzY2hlciI6eyJib3JuIjoiTWFyY2ggOXRoIDE5NDMiLCJpbWFnZSI6IkJvYmJ5LUZpc2NoZXItQlcucG5nIiwiZWxvIjoyNzgwfSwiSGFucyBCZXJsaW5lciI6eyJib3JuIjoiSmFuIDI3dGggMTkyOSIsImltYWdlIjoiSGFucy1CZXJsaW5lci5wbmcifSwiViBBbmFuZCI6eyJib3JuIjoiRGVjZW1iZXIgMTF0aCAxOTY5IiwiaW1hZ2UiOiJWLUFuYW5kLnBuZyIsImVsbyI6Mjc1M30sIlQgUmFkamFib3YiOnsiYm9ybiI6Ik1hcmNoIDEydGggMTk4NyIsImltYWdlIjoiVC1SYWRqYWJvdi5wbmciLCJlbG8iOjI3NTN9fQ==');
      //this.aria.loadPGN(TESTANNOTATION + TestPGNData);
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
