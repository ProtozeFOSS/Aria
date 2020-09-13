import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { OlgaService } from 'src/app/services/olga.service';
import { ColorService } from 'src/app/services/colors.service';
import { CanvasChessBoard } from '../../canvas-chessboard/canvas-chessboard.component';

@Component({
  selector: 'board-settings',
  templateUrl: './settings-board.component.html',
  styleUrls: ['./settings-board.component.scss']
})
export class SettingsBoardComponent implements OnInit, AfterViewInit {
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
    if (this.olga.board.value) {
      this.olga.board.value.setLightTile(color);
      this.colorService.boardBGLight.next(color);
    }
  }

  updateDark(color: string) {
    if (this.olga.board.value) {
      this.olga.board.value.setDarkTile(color);
      this.colorService.boardBGDark.next(color);
    }
  }

  hide():void {
    if(this.container) {
      this.container.nativeElement.style.visibility = 'hidden';
      if(this.settingsBoard)
      this.settingsBoard.hide();
    }
  }
  show():void {
    if(this.container) {
      this.container.nativeElement.style.visibility = 'visible';
      if(this.settingsBoard)
      this.settingsBoard.show();
    }
  }
}
