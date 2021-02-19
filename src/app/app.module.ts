import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { Aria } from './app.component';
import { AriaHeader } from './aria-header/aria-header.component';
import { AriaScore } from './aria-score/aria-score.component';
import { AriaControls } from './aria-controls/aria-controls.component';
import { AriaStatus } from './aria-status/aria-status.component';
import { CanvasChessBoard } from './canvas-chessboard/canvas-chessboard.component';
import { PlayerShowcase } from './aria-header/player-showcase/player-showcase.component';
import { ScoreTable } from './aria-score/score-table/score-table.component';
import { TableItem } from './aria-score/score-table/table-item/table-item.component';
import { TableColumn } from './aria-score/score-table/table-column/table-column.component';
import { ScoreFlow } from './aria-score/score-flow/score-flow.component';
import { FlowItem } from './aria-score/score-flow/flow-item/flow-item.component';
import { AriaService } from './services/aria.service';
import { LayoutService } from './services/layout.service';
import { ThemeService } from './services/themes.service';
import { IconPipe } from './icon.pipe';
import { AriaCMenu } from './aria-cmenu/aria-cmenu.component';

@NgModule({
  declarations: [
    Aria,
    AriaHeader,
    AriaScore,
    AriaControls,
    AriaStatus,
    CanvasChessBoard,
    PlayerShowcase,
    ScoreTable,
    TableColumn,
    TableItem,
    ScoreFlow,
    FlowItem,
    IconPipe,
    AriaCMenu
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [LayoutService, ThemeService, AriaService],
  bootstrap: [Aria]
})
export class AppModule { }
