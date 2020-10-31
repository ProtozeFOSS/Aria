import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ThemeService } from '../../services/themes.service';
import { LayoutService } from '../../services/layout.service';
import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';
import { OlgaService } from '../../services/olga.service';
import { KeymapMenuComponent } from '../keymap-menu/keymap-menu.component';
import { BoardMenuComponent } from '../board-menu/board-menu.component';
import { GeneralMenuComponent } from '../general-menu/general-menu.component';
import { ThemesMenuComponent } from '../themes-menu/themes-menu.component';
import { GamescoreMenuComponent } from '../gamescore-menu/gamescore-menu.component';
import { PgnMenuComponent } from '../pgn-menu/pgn-menu.component';

export enum MenuType {
  General = 444,
  Board = 454,
  GameScore = 464,
  Keymap = 474,
  GameVariation = 484,
  Themes = 494,
  PgnMenu = 500
}

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit, AfterViewInit {
  public index: number = 0;
  constructor(public themes: ThemeService, public layout: LayoutService, public olga: OlgaService) { }
  menus: HTMLCollectionOf<HTMLElement> | null = null;
  @ViewChild(KeymapMenuComponent)
  keymapMenu: KeymapMenuComponent | null = null;
  @ViewChild(BoardMenuComponent)
  boardMenu: BoardMenuComponent | null = null;
  @ViewChild(GamescoreMenuComponent)
  gamescoreMenu: GamescoreMenuComponent | null = null;
  @ViewChild(GeneralMenuComponent)
  generalMenu: GeneralMenuComponent | null = null;
  @ViewChild(PgnMenuComponent)
  pgnMenu: PgnMenuComponent | null = null;
  @ViewChild(ThemesMenuComponent)
  themeMenu: ThemesMenuComponent | null = null;
  menuElement: HTMLElement | null = null;
  public visible = false;
  protected size: {width: number, height: number} = {width:0, height: 0};
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.menuElement = document.getElementById('settings-menu-' + this.olga.UUID);
  }

  open(type: MenuType): void {
    this.visible = true;
    if(this.menuElement) {
      this.menuElement.style.visibility = 'visible';
    }
    switch(type) {
      case MenuType.General: {
        this.index = 0;
        if(this.generalMenu) {
          this.generalMenu.resize(this.size.width, this.size.height);
          this.generalMenu.show();
        }
        break;
      }
      case MenuType.Board: {
        this.index = 1;
        if(this.boardMenu) {
          this.boardMenu.resize(this.size.width, this.size.height);
          this.boardMenu.show()
        }
        break;
      }
      case MenuType.GameScore: {
        this.index = 1;
        if(this.gamescoreMenu) {
          this.gamescoreMenu.resize(this.size.width, this.size.height);
          this.gamescoreMenu.show()
        }
        break;
      }
      case MenuType.Themes: {
        this.index = 1;
        if(this.themeMenu) {
          this.themeMenu.resize(this.size.width, this.size.height);
          this.themeMenu.show()
        }
        break;
      }
      case MenuType.PgnMenu: {
        this.index = 1;
        if(this.pgnMenu) {
          this.pgnMenu.show()
        }
        break;
      }
    }
  }

  close(): void {
    this.visible = false;
    if(this.keymapMenu) {
      this.keymapMenu.hide();
    }
    if(this.boardMenu){
      this.boardMenu.hide();
    }
    if(this.generalMenu) {
      this.generalMenu.hide();
    }
    if(this.themeMenu) {
      this.themeMenu.hide();
    }
    if(this.gamescoreMenu) {
      this.gamescoreMenu.hide();
    }
    if(this.pgnMenu) {
      this.pgnMenu.hide();
    }
    if(this.menuElement) {
      this.menuElement.style.visibility = 'hidden';
    }
    
  }

  resize(size: {width: number, height: number}): void {
    let height = Math.floor(size.height * .84) - 66;
    let width = Math.floor(size.width * .9);
    this.size = {height, width};
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
    if(this.generalMenu){
      this.generalMenu.hide();
    }
    if(this.themeMenu) {
      this.themeMenu.hide();
    }
    if(this.gamescoreMenu) {
      this.gamescoreMenu.hide();
    }
    if(this.pgnMenu) {
      this.pgnMenu.hide();
    }
    if(event.tab) {
      let menu = null;
      switch(event.tab.textLabel){
        case 'General': {
          menu = this.generalMenu;
          break;
        }
        case 'Board': {
          menu = this.boardMenu;
          break;
        }
        case 'Game Score': {
          menu = this.gamescoreMenu;
          break;
        }
        case 'Keymap': {
          menu = this.keymapMenu;
          break;
        }
        case 'Themes': {
          menu = this.themeMenu;
          break;
        }
        case 'PGN Edit': {
          menu = this.pgnMenu;
          break;
        }
        default: {menu = null;}
      }
      if(menu) {
        menu.show();
      }
    }

  }
}
