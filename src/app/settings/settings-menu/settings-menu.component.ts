import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ColorService } from 'src/app/services/colors.service';
import { LayoutService } from 'src/app/services/layout.service';
import { CanvasChessBoard } from 'src/app/canvas-chessboard/canvas-chessboard.component';
import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';
import { OlgaService } from 'src/app/services/olga.service';

@Component({
  selector: 'settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.scss']
})
export class SettingsMenuComponent implements OnInit, AfterViewInit {
  constructor(public colorService: ColorService, public layoutService: LayoutService, olga: OlgaService) { }
  menus: HTMLCollectionOf<HTMLElement> | null = null;
  @ViewChild(CanvasChessBoard)
  settingsBoard: CanvasChessBoard | null = null;
  protected height = 360;
  protected width = 360;
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const menus = document.getElementsByClassName('settings-content');
    this.colorService.boardBGDark.subscribe((color) => {
      this.settingsBoard?.setDarkTile(color);
    });
    this.colorService.boardBGLight.subscribe((color) => {
      this.settingsBoard?.setLightTile(color);
    });
  }

  resize(width: number, height: number): void {
    height = Math.floor(height * .84) - 66;
    width = Math.floor(width * .9);
    // Landscape vs Portrait
    const menus = document.getElementsByClassName('settings-content') as HTMLCollectionOf<HTMLElement>;
    if (this.settingsBoard) {
      const boardWidth = width * .5;
      const boardHeight = height * .8;
      if (boardHeight > boardWidth) {
        this.settingsBoard.setSize(boardWidth);
      } else {
        this.settingsBoard.setSize(boardHeight);
      }
    }
    if (menus) {
      for (let index = 0; index < menus.length; ++index) {
        const item = menus.item(index);
        if (item) {
          item.style.height = height - 2 + 'px';

        }
      }
    }
    this.height = height;
    this.width = width;
  }

  tabChanged(event: MatTabChangeEvent): void {

    this.resize(window.innerWidth, window.innerHeight);
  }
}
