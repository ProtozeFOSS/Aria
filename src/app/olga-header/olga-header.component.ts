import { Component, Input, OnInit } from '@angular/core';
import { LayoutService } from '../services/layout.service';
import { OlgaService } from '../services/olga.service';

@Component({
  selector: 'olga-header',
  templateUrl: './olga-header.component.html',
  styleUrls: ['./olga-header.component.scss']
})
export class OlgaHeaderComponent implements OnInit {
  @Input() variant: string = 'Classical';
  @Input() event: string = '';
  @Input() eventDate: string = '';
  @Input() match: string = '';
  @Input() matchDate: string = '';
  @Input() white: string = '';
  @Input() black: string = '';
  @Input() whiteElo: string | number = '';
  @Input() blackElo: string | number = '';
  @Input() gameCount: number = 1;
  @Input() currentGame: number = 0;
  constructor(public olga: OlgaService, public layout: LayoutService) { }

  ngOnInit(): void {
  }

  setHeader(map: Map<string,string>) :void {
    this.event = this.olga.setName;
    this.eventDate = this.olga.setDate;
    const event = map.get('Event');
    if(event) {
      this.match = event;
    }
    const matchDate = map.get('Match Date');
    if(matchDate) {
      this.matchDate = matchDate;
    } else {
      this.matchDate = '';
    }
    const white = map.get('White');
    if(white) {
      this.white = white;
    }
    const black = map.get('Black');
    if(black) {
      this.black = black;
    }
    const whiteElo = map.get('White Elo');
    if(whiteElo) {
      this.whiteElo = whiteElo;
    }
    const blackElo = map.get('Black Elo');
    if(blackElo) {
      this.blackElo = blackElo;
    }
    const variant = map.get('Variant');
    if(variant) {
      this.variant = variant;
    }
  }
  previousGame(): void {
    if(this.currentGame > 0){
      --this.currentGame;
    }
    if(this.currentGame >= 0) {
      this.olga.selectGame(this.currentGame)
    }
  }
  nextGame(): void {
    if(this.currentGame < this.gameCount) {
      this.olga.selectGame(++this.currentGame)
    }
  }
}
