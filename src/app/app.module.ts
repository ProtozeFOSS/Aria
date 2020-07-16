import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GamescoreSettingsComponent } from './settings/settings-gamescore/settings-gamescore.component';
import { OlgaTestComponent } from './olga-test/olga-test.component';
import { GamescoreUxComponent } from './game-score/game-score.ux';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSliderModule } from '@angular/material/slider';
import { MatDividerModule } from '@angular/material/divider';
import { PlayermoveComponent } from './playermove/playermove.component';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { GameScoreService } from './services/game-score.service';
import { GameScoreItemComponent } from './game-score/game-score-item/game-score-item.component';
import { ColorService } from './services/colors.service';
import { ToggleSwitchComponent } from './common/toggle-switch/toggle-switch.component';
import { LabeledSliderComponent } from './common/labeled-slider/labeled-slider.component';
import { SettingsMenuComponent } from './settings/settings-menu/settings-menu.component';
import { OlgaBoardComponent } from './olga-board/olga-board.component';
import { SettingsBoardComponent } from './settings/settings-board/settings-board.component';
import {MatInputModule, MatInput} from '@angular/material/input';

@NgModule({
  declarations: [
    AppComponent,
    GamescoreSettingsComponent,
    OlgaBoardComponent,
    OlgaTestComponent,
    GamescoreUxComponent,
    GameScoreItemComponent,
    PlayermoveComponent,
    ToggleSwitchComponent,
    LabeledSliderComponent,
    SettingsMenuComponent,
    SettingsBoardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatInputModule,
    MatGridListModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatTabsModule
  ],
  providers: [
    ColorService,
    GameScoreService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
