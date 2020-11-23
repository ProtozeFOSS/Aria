import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { Olga } from './app.component';
import { GamescoreMenuComponent } from './olga-menu/gamescore-menu/gamescore-menu.component';
import { GamescoreUxComponent } from './olga-score/olga-score.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { GameScoreItemComponent } from './olga-score/game-score-item/game-score-item.component';
import { ThemeService } from './services/themes.service';
import { ToggleSwitchComponent } from './common/toggle-switch/toggle-switch.component';
import { MainMenuComponent } from './olga-menu/main-menu/main-menu.component';
import { BoardMenuComponent } from './olga-menu/board-menu/board-menu.component';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { VariationMenu } from './olga-menu/variation-menu/variation-menu.component';
import { OlgaService } from './services/olga.service';
import { LayoutService } from './services/layout.service';
import { CanvasChessBoard } from './canvas-chessboard/canvas-chessboard.component';
import { OlgaControlsComponent } from './olga-controls/olga-controls.component';
import { OlgaStatusComponent } from './olga-status/olga-status.component';
import { KeymapMenuComponent } from './olga-menu/keymap-menu/keymap-menu.component';
import { GeneralMenuComponent } from './olga-menu/general-menu/general-menu.component';
import { OlgaMenuComponent } from './olga-menu/olga-menu.component';
import { KeymapItemComponent } from './olga-menu/keymap-menu/keymap-item/keymap-item.component';
import { VariationItemComponent } from './olga-menu/variation-menu/variation-item/variation-item.component';
import { MenuSectionComponent } from './olga-menu/common/menu-section/menu-section.component';
import { LayoutModeSelectComponent } from './olga-menu/controls/layout-mode-select/layout-mode-select.component';
import { ColorSelectComponent } from './olga-menu/controls/color-select/color-select.component';
import { ThemesMenuComponent } from './olga-menu/themes-menu/themes-menu.component';
import { PgnMenuComponent } from './olga-menu/pgn-menu/pgn-menu.component';
import { CookieConsentComponent } from './cookie-consent/cookie-consent.component';
import { ToggleSelectComponent } from './olga-menu/controls/toggle-select/toggle-select.component';
import { OlgaHeaderComponent } from './olga-header/olga-header.component';
import { ValueSliderComponent } from './common/value-slider/value-slider.component';
import { ValueSelectComponent } from './olga-menu/controls/value-select/value-select.component';
import { PlayerShowcaseComponent } from './olga-header/player-showcase/player-showcase.component';
import { ColorSketchModule } from 'ngx-color/sketch';
import { ResultShowcaseComponent } from './olga-header/result-showcase/result-showcase.component';

@NgModule({
  declarations: [
    Olga,
    GamescoreMenuComponent,
    GamescoreUxComponent,
    GameScoreItemComponent,
    ToggleSwitchComponent,
    MainMenuComponent,
    BoardMenuComponent,
    VariationMenu,
    CanvasChessBoard,
    OlgaControlsComponent,
    OlgaStatusComponent,
    KeymapMenuComponent,
    GeneralMenuComponent,
    KeymapItemComponent,
    VariationItemComponent,
    OlgaMenuComponent,
    MenuSectionComponent,
    LayoutModeSelectComponent,
    ColorSelectComponent,
    ThemesMenuComponent,
    PgnMenuComponent,
    CookieConsentComponent,
    ToggleSelectComponent,
    OlgaHeaderComponent,
    ValueSliderComponent,
    ValueSelectComponent,
    PlayerShowcaseComponent,
    ResultShowcaseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatGridListModule,
    MatMenuModule,
    MatTabsModule,
    ColorSketchModule
  ],
  providers: [LayoutService, ThemeService, OlgaService, Clipboard],
  bootstrap: [Olga],
})
export class AppModule { }
