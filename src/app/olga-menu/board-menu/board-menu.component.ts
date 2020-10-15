import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { OlgaService } from '../../services/olga.service';
import { ColorService } from '../..//services/colors.service';
import { CanvasChessBoard } from '../../canvas-chessboard/canvas-chessboard.component';

@Component({
  selector: 'board-menu',
  templateUrl: './board-menu.component.html',
  styleUrls: ['./board-menu.component.scss']
})
export class BoardMenuComponent implements OnInit, AfterViewInit {
  constructor(
    public olga: OlgaService,
    public colorService: ColorService
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
    this.colorService.boardBGDark.subscribe((color) => {
      this.settingsBoard?.setDarkTile(color);
    });
    this.colorService.boardBGLight.subscribe((color) => {
      this.settingsBoard?.setLightTile(color);
    });
  }

  ngAfterViewInit(): void {
    if (this.lightBGHandle) {
      this.lightBGHandle.nativeElement.value = this.colorService.boardBGLight.value;
    }
    if (this.darkBGHandle) {
      this.darkBGHandle.nativeElement.value = this.colorService.boardBGDark.value;
    }
  }

  updateLight(color: string) {
    const board = this.olga.getBoard();
    if (board) {
      board.setLightTile(color);
      this.colorService.boardBGLight.next(color);
    }
  }

  updateDark(color: string) {
    const board = this.olga.getBoard();
    if (board) {
      board.setDarkTile(color);
      this.colorService.boardBGDark.next(color);
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
