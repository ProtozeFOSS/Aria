import { Component, OnInit, Output, AfterViewInit } from '@angular/core';
import { GameScoreService } from '../../services/game-score.service';
import { ColorService } from '../../services/colors.service';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'app-gamescore-settings',
  templateUrl: './settings-gamescore.component.html',
  styleUrls: ['./settings-gamescore.component.scss']
})
export class GamescoreSettingsComponent implements OnInit, AfterViewInit {

  constructor( public gameScoreService: GameScoreService, public colorService: ColorService ) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
  }

}
