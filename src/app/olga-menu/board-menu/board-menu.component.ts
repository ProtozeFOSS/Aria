import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { OlgaService } from '../../services/olga.service';
import { ThemeService } from '../..//services/themes.service';
import { CanvasChessBoard } from '../../canvas-chessboard/canvas-chessboard.component';

@Component({
  selector: 'board-menu',
  templateUrl: './board-menu.component.html',
  styleUrls: ['./board-menu.component.scss']
})
export class BoardMenuComponent implements OnInit, AfterViewInit {
  constructor(
    public olga: OlgaService,
    public themes: ThemeService
  ) { }
  @ViewChild(CanvasChessBoard)
  settingsBoard: CanvasChessBoard | null = null;
  @ViewChild('lightBGHandle', { static: true })
  lightBGHandle: ElementRef | null = null;
  @ViewChild('darkBGHandle', { static: true })
  darkBGHandle: ElementRef | null = null;
  @ViewChild('container', { static: true })
  container: ElementRef | null = null;

  ngOnInit(): void {
    const menus = document.getElementsByClassName('settings-content');
    this.themes.boardBGDark.subscribe((color) => {
      this.settingsBoard?.setDarkTile(color);
    });
    this.themes.boardBGLight.subscribe((color) => {
      this.settingsBoard?.setLightTile(color);
    });
  }

  ngAfterViewInit(): void {
    if (this.lightBGHandle) {
      this.lightBGHandle.nativeElement.value = this.themes.boardBGLight.value;
    }
    if (this.darkBGHandle) {
      this.darkBGHandle.nativeElement.value = this.themes.boardBGDark.value;
    }
  }

  updateLight(color: string) {
    const board = this.olga.getBoard();
    if (board) {
      board.setLightTile(color);
      this.themes.boardBGLight.next(color);
    }
  }

  updateDark(color: string) {
    const board = this.olga.getBoard();
    if (board) {
      board.setDarkTile(color);
      this.themes.boardBGDark.next(color);
    }
  }

  hide():void {
    if(this.container) {
      this.container.nativeElement.style.visibility = 'hidden';
      if(this.settingsBoard) {
        this.settingsBoard.hide();
      }
    }
  }
  show():void {
    if(this.container) {
      this.container.nativeElement.style.visibility = 'visible';
      if(this.settingsBoard) {
        this.settingsBoard.show();
      }
    }
  }
  resize(width: number, height: number) : void {
    const boardWidth = width * .5;
    const boardHeight = height * .8;
    if(this.settingsBoard) {
      if (boardHeight > boardWidth) {
        this.settingsBoard.setSize(boardWidth);
      } else {
        this.settingsBoard.setSize(boardHeight);
      }
    }
  }
}
