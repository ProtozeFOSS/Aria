import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { OlgaService } from 'src/app/services/olga.service';
import { GameService } from 'src/app/services/game.service';
import { ColorService } from 'src/app/services/colors.service';

@Component({
  selector: 'board-settings',
  templateUrl: './settings-board.component.html',
  styleUrls: ['./settings-board.component.scss']
})
export class SettingsBoardComponent implements OnInit, AfterViewInit {
  constructor(
    public olga: OlgaService,
    public gameService: GameService,
    public colorService: ColorService
  ) { }
  @ViewChild('lightBGHandle', { static: true })
  lightBGHandle: ElementRef | null = null;
  @ViewChild('darkBGHandle', { static: true })
  darkBGHandle: ElementRef | null = null;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.lightBGHandle) {
      this.lightBGHandle.nativeElement.value = this.colorService.boardBGLight.value;
    }
    if (this.darkBGHandle) {
      this.darkBGHandle.nativeElement.value = this.colorService.boardBGDark.value;
    }
  }

  updateLight(color: string) {
    if (this.gameService.board.value) {
      this.gameService.board.value.setLightTile(color);
      this.colorService.boardBGLight.next(color);
    }
  }

  updateDark(color: string) {
    if (this.gameService.board.value) {
      this.gameService.board.value.setDarkTile(color);
      this.colorService.boardBGDark.next(color);
    }
  }
}
