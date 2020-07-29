import {
  Component,
  OnInit,
  Output,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { GameScoreService } from '../../services/game-score.service';
import { ColorService } from '../../services/colors.service';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'app-gamescore-settings',
  templateUrl: './settings-gamescore.component.html',
  styleUrls: ['./settings-gamescore.component.scss'],
})
export class GamescoreSettingsComponent implements OnInit, AfterViewInit {
  constructor(
    public gameScoreService: GameScoreService,
    public colorService: ColorService
  ) {}
  @ViewChild('lightBGHandle', { static: true })
  lightBGHandle: ElementRef | null = null;
   @ViewChild('darkBGHandle', { static: true })
  darkBGHandle: ElementRef | null = null;

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    if (this.lightBGHandle) {
      this.lightBGHandle.nativeElement.value = this.colorService.boardBGLight.value;
    }
    if (this.darkBGHandle) {
      this.darkBGHandle.nativeElement.value = this.colorService.boardBGDark.value;
    }
  }
}
