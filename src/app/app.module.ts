import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'
import { Olga } from './app.component';
import { GamescoreUxComponent } from './olga-score/olga-score.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { FlowItemComponent } from './olga-score/score-flow/flow-item/flow-item.component';
import { ThemeService } from './services/themes.service';
import { ToggleSwitchComponent } from './common/toggle-switch/toggle-switch.component';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { OlgaService } from './services/olga.service';
import { LayoutService } from './services/layout.service';
import { CanvasChessBoard } from './canvas-chessboard/canvas-chessboard.component';
import { OlgaControlsComponent } from './olga-controls/olga-controls.component';
import { OlgaStatusComponent } from './olga-status/olga-status.component';
import { OlgaHeaderComponent } from './olga-header/olga-header.component';
import { ValueSliderComponent } from './common/value-slider/value-slider.component';
import { PlayerShowcaseComponent } from './olga-header/player-showcase/player-showcase.component';
import { ColorSketchModule } from 'ngx-color/sketch';
import { ScoreTableComponent } from './olga-score/score-table/score-table.component';
import { ScoreFlowComponent } from './olga-score/score-flow/score-flow.component';
import { TableItemComponent } from './olga-score/score-table/table-item/table-item.component';
import { ScoreColumnComponent } from './olga-score/score-table/score-column/score-column.component';

const routes: Routes = [{ path: '', redirectTo: 'olga2', pathMatch: 'full' },
{ path: '', component: Olga, pathMatch: 'full' },
{ path: ':settings', component: Olga, pathMatch: 'full' }];

@NgModule({
  declarations: [
    Olga,
    GamescoreUxComponent,
    FlowItemComponent,
    ToggleSwitchComponent,
    CanvasChessBoard,
    OlgaControlsComponent,
    OlgaStatusComponent,
    OlgaHeaderComponent,
    ValueSliderComponent,
    PlayerShowcaseComponent,
    ScoreTableComponent,
    ScoreFlowComponent,
    TableItemComponent,
    ScoreColumnComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
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
