import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ColorService } from '../../services/colors.service';
import { LayoutService } from '../../services/layout.service';
import { CanvasChessBoard } from '../../canvas-chessboard/canvas-chessboard.component';
import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';
import { OlgaService } from '../../services/olga.service';
import { SettingsKeymapComponent } from '../settings-keymap/settings-keymap.component';
import { SettingsBoardComponent } from '../settings-board/settings-board.component';
import { SettingsGeneralComponent } from '../settings-general/settings-general.component';

@Component({
  selector: 'settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.scss']
})
export class SettingsMenuComponent implements OnInit, AfterViewInit {
  constructor(public colorService: ColorService, public layout: LayoutService, public olga: OlgaService) { }
  menus: HTMLCollectionOf<HTMLElement> | null = null;
  @ViewChild(SettingsKeymapComponent)
  keymapMenu: SettingsKeymapComponent | null = null;
  @ViewChild(SettingsBoardComponent)
  boardMenu: SettingsBoardComponent | null = null;
  @ViewChild(SettingsGeneralComponent)
  generalMenu: SettingsGeneralComponent | null = null;
  public visible = false;
  protected height = 360;
  protected width = 360;
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  open(): void {
    this.visible = true;
    if(this.generalMenu) {
      this.generalMenu.show();
    }
    // if(this.boardMenu){
    //   this.boardMenu.show();
    // }
  }

  close(): void {
    this.visible = false;
    if(this.keymapMenu) {
      this.keymapMenu.hide();
    }
    if(this.boardMenu){
      this.boardMenu.hide();
    }
  }

  resize(width: number, height: number): void {
    height = Math.floor(height * .84) - 66;
    width = Math.floor(width * .9);
    // Landscape vs Portrait
    const menus = document.getElementsByClassName('settings-content') as HTMLCollectionOf<HTMLElement>;
    if (this.boardMenu && this.boardMenu.settingsBoard) {
      const boardWidth = width * .5;
      const boardHeight = height * .8;
      if (boardHeight > boardWidth) {
        this.boardMenu.settingsBoard.setSize(boardWidth);
      } else {
        this.boardMenu.settingsBoard.setSize(boardHeight);
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

  ignoreInnerClicks(event: MouseEvent) {
    event.stopPropagation();
  }

  tabChanged(event: MatTabChangeEvent): void {
    if(this.keymapMenu) {
      this.keymapMenu.hide();
    }
    if(this.boardMenu){
      this.boardMenu.hide();
    }
    if(event.tab) {
      switch(event.tab.textLabel){
        case 'Board': {
          if(this.boardMenu && this.boardMenu.settingsBoard) {
            const boardWidth = this.width * .5;
            const boardHeight = this.height * .8;
            if (boardHeight > boardWidth) {
              this.boardMenu.settingsBoard.setSize(boardWidth);
            } else {
              this.boardMenu.settingsBoard.setSize(boardHeight);
            }
            this.boardMenu.show();
          }
          break;
        }
        case 'Keymap': {
          if(this.keymapMenu) {
            this.keymapMenu.show();
          }
          break;
        }
      }
    }
  }
}
