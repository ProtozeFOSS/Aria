import { Component, OnInit, Input } from '@angular/core';
import { GameScoreItem } from 'src/app/common/kokopu-engine';

@Component({
  selector: 'score-table',
  templateUrl: './score-table.component.html',
  styleUrls: ['./score-table.component.scss']
})
export class ScoreTableComponent implements OnInit {

  // @ts-ignore
  @ViewChildren(FlowItemComponent) scoreItems: QueryList<FlowItemComponent> | null = null;
  @Input() items: GameScoreItem[] = [];
  constructor() { }

  ngOnInit(): void {
  }

  selectGameScoreItem(index: number): void {

  }

}
