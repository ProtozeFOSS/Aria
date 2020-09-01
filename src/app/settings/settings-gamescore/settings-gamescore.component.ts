import {
  Component,
  OnInit,
  Output,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { GameService } from '../../services/game.service';
import { ColorService } from '../../services/colors.service';
import { OlgaService } from 'src/app/services/olga.service';

@Component({
  selector: 'app-gamescore-settings',
  templateUrl: './settings-gamescore.component.html',
  styleUrls: ['./settings-gamescore.component.scss'],
})
export class GamescoreSettingsComponent implements OnInit, AfterViewInit {
  constructor(
    public olga: OlgaService,
    public gameService: GameService,
    public colorService: ColorService
  ) { }

  ngOnInit(): void { }
  ngAfterViewInit(): void {

  }
}
