import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gamescore-item',
  templateUrl: './gamescore-item.component.html',
  styleUrls: ['./gamescore-item.component.scss']
})
export class GamescoreItemComponent implements OnInit {
  @input() gameScoreItemData: data | null = null;
  
  constructor() { }

  ngOnInit(): void {
  }

}
