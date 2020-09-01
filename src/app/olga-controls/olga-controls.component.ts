import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'olga-controls',
  templateUrl: './olga-controls.component.html',
  styleUrls: ['./olga-controls.component.scss']
})
export class OlgaControlsComponent implements OnInit {

  constructor(public gameService: GameService) { }

  ngOnInit(): void {
  }

}
