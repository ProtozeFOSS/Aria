import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { Olga } from './app.component';
import { GamescoreSettingsComponent } from './settings/settings-gamescore/settings-gamescore.component';
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
import { SettingsMenuComponent } from './settings/settings-menu/settings-menu.component';
import { SettingsBoardComponent } from './settings/settings-board/settings-board.component';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { GameScoreItemMenu } from './game-score/menu-game-score-item/menu-game-score-item.component';

import { OlgaService } from './services/olga.service';
import { LayoutService } from './services/layout.service';
import { CanvasChessBoard } from './canvas-chessboard/canvas-chessboard.component';
import { OlgaControlsComponent } from './olga-controls/olga-controls.component';
import { OlgaStatusComponent } from './olga-status/olga-status.component';
import { OlgaTitleComponent } from './olga-title/olga-title.component';
import { SettingsKeymapComponent } from './settings/settings-keymap/settings-keymap.component';
import { KeymapItemComponent } from './settings/settings-keymap/keymap-item/keymap-item.component';
import { SettingsGeneralComponent } from './settings/settings-general/settings-general.component';

@NgModule({
  declarations: [
    Olga,
    GamescoreSettingsComponent,
    GamescoreUxComponent,
    GameScoreItemComponent,
    ToggleSwitchComponent,
    LabeledSliderComponent,
    SettingsMenuComponent,
    SettingsBoardComponent,
    GameScoreItemMenu,
    CanvasChessBoard,
    OlgaControlsComponent,
    OlgaStatusComponent,
    OlgaTitleComponent,
    SettingsKeymapComponent,
    KeymapItemComponent,
    SettingsGeneralComponent
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
  providers: [LayoutService, ColorService, OlgaService],
  bootstrap: [Olga],
})
export class AppModule { }
