import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { GameScoreItem } from '../common/kokopu-engine';
import { ColorService } from '../services/colors.service';
import { LayoutService } from '../services/layout.service';
import { OlgaService } from '../services/olga.service';
import { MenuType, MainMenuComponent } from './main-menu/main-menu.component';
import { ScoreItemMenu } from './score-item-menu/score-item-menu.component';


// OLGAS Global Menu system
@Component({
  selector: 'olga-menu',
  templateUrl: './olga-menu.component.html',
  styleUrls: ['./olga-menu.component.scss']
})
export class OlgaMenuComponent implements OnInit, AfterViewInit {
  public visible = false;
  @ViewChild(MainMenuComponent) settingsMenu: MainMenuComponent | null = null;
  @ViewChild(ScoreItemMenu) variationMenu: ScoreItemMenu | null = null;
  closeButton: HTMLElement | null = null;
  overlay: HTMLElement | null = null;
  protected size: {width: number, height: number} = {width:0, height: 0};
  constructor(public olga: OlgaService, public layout: LayoutService, public colors: ColorService) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.closeButton  = document.getElementById('settings-close-' + this.olga.UUID);
    this.overlay = document.getElementById('settings-overlay-' + this.olga.UUID);
  }

  resize(width: number, height: number): void {
    this.size = {width, height};
    if(this.settingsMenu) {
      this.settingsMenu.resize(this.size);
    }
  }

  open(type: MenuType = MenuType.General): void {
    if(this.closeButton && this.overlay) {
      this.closeButton.style.visibility = 'visible';
      this.overlay.style.visibility = 'visible';
      document.body.style.position = 'fixed';
      document.body.style.top = '-' + window.scrollY + 'px';
      document.body.style.overflowY = 'hidden';
    }
    if(type == MenuType.GameVariation) {
      return;
    }
    if(this.settingsMenu) {
      this.settingsMenu.open(type);
    }
  }

  openVariationMenu(data: GameScoreItem) : void {
    if(this.variationMenu) {
      this.variationMenu.resize(this.size);
      this.variationMenu.openAt(data);
    }
  }

  close(): void {
    if(this.closeButton && this.overlay) {
      this.closeButton.style.visibility = 'hidden';
      this.overlay.style.visibility = 'hidden';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.overflowY = 'auto';
    }
    if(this.settingsMenu) {
      this.settingsMenu.close();
    }
    this.layout.resizeLayout();
    this.olga.saveSettings();
  }

}
