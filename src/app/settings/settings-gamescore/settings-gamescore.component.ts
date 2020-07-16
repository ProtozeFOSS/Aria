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
    console.log('Setting primary color to ' + this.colorService.fgItem);
    document.documentElement.style.setProperty('--primary-item', this.colorService.fgItem);
    document.documentElement.style.setProperty('--primary-item-contrast', this.colorService.fgItemContrast);
    document.documentElement.style.setProperty('--primary-item-bg', this.colorService.bgItem);
    document.documentElement.style.setProperty('--primary-text', this.colorService.textColor);
    document.documentElement.style.setProperty('--primary-bg-outer', this.colorService.bgOuter);
    document.documentElement.style.setProperty('--primary-bg-inner', this.colorService.bgInner);
  }

}
