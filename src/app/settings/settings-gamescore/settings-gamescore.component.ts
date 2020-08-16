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
  @ViewChild('lightBGHandle', { static: true })
  lightBGHandle: ElementRef | null = null;
  @ViewChild('darkBGHandle', { static: true })
  darkBGHandle: ElementRef | null = null;

  ngOnInit(): void { }
  ngAfterViewInit(): void {
    if (this.lightBGHandle) {
      this.lightBGHandle.nativeElement.value = this.colorService.boardBGLight.value;
    }
    if (this.darkBGHandle) {
      this.darkBGHandle.nativeElement.value = this.colorService.boardBGDark.value;
    }
  }
}
