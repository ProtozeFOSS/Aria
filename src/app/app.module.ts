import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { Olga } from './app.component';
import { GamescoreMenuComponent } from './olga-menu/gamescore-menu/gamescore-menu.component';
import { GamescoreUxComponent } from './game-score/game-score.ux';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSliderModule } from '@angular/material/slider';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { GameScoreItemComponent } from './game-score/game-score-item/game-score-item.component';
import { ColorService } from './services/colors.service';
import { ToggleSwitchComponent } from './common/toggle-switch/toggle-switch.component';
import { LabeledSliderComponent } from './common/labeled-slider/labeled-slider.component';
import { MainMenuComponent } from './olga-menu/main-menu/main-menu.component';
import { BoardMenuComponent } from './olga-menu/board-menu/board-menu.component';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { ScoreItemMenu } from './olga-menu/score-item-menu/score-item-menu.component';

import { OlgaService } from './services/olga.service';
import { LayoutService } from './services/layout.service';
import { CanvasChessBoard } from './canvas-chessboard/canvas-chessboard.component';
import { OlgaControlsComponent } from './olga-controls/olga-controls.component';
import { OlgaStatusComponent } from './olga-status/olga-status.component';
import { OlgaTitleComponent } from './olga-title/olga-title.component';
import { KeymapMenuComponent } from './olga-menu/keymap-menu/keymap-menu.component';
import { GeneralMenuComponent } from './olga-menu/general-menu/general-menu.component';
import { OlgaMenuComponent } from './olga-menu/olga-menu.component';
import { KeymapItemComponent } from './olga-menu/keymap-menu/keymap-item/keymap-item.component';
import { VariationItemComponent } from './olga-menu/score-item-menu/variation-item/variation-item.component';
import { MenuSectionComponent } from './olga-menu/common/menu-section/menu-section.component';
import { LayoutModeSelectComponent } from './olga-menu/controls/layout-mode-select/layout-mode-select.component';
import { ColorSelectComponent } from './olga-menu/controls/color-select/color-select.component';
import { ThemesMenuComponent } from './olga-menu/themes-menu/themes-menu.component';
import { PgnMenuComponent } from './olga-menu/pgn-menu/pgn-menu.component';
import { CookieConsentComponent } from './cookie-consent/cookie-consent.component';
import { ToggleSelectComponent } from './olga-menu/controls/toggle-select/toggle-select.component';
import { OlgaHeaderComponent } from './olga-header/olga-header.component';

@NgModule({
  declarations: [
    Olga,
    GamescoreMenuComponent,
    GamescoreUxComponent,
    GameScoreItemComponent,
    ToggleSwitchComponent,
    LabeledSliderComponent,
    MainMenuComponent,
    BoardMenuComponent,
    ScoreItemMenu,
    CanvasChessBoard,
    OlgaControlsComponent,
    OlgaStatusComponent,
    OlgaTitleComponent,
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
    OlgaHeaderComponent
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
    MatSliderModule,
    MatSlideToggleModule,
    MatTabsModule,
  ],
  providers: [LayoutService, ColorService, OlgaService, Clipboard],
  bootstrap: [Olga],
})
export class AppModule { }
