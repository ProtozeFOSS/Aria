import { Component, Input, OnInit } from '@angular/core';
import { LayoutService } from '../services/layout.service';
import { STOCK_IMAGE, PlayerData, OlgaService } from '../services/olga.service';

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
  @Input() whiteData: PlayerData = {image: "/assets/images/player.png"};
  @Input() blackData: PlayerData = {image: "/assets/images/player.png"};
  @Input() whiteElo: string = '';
  @Input() blackElo: string = '';
  @Input() gameCount: number = 1;
  @Input() currentGame: number = 0;
  @Input() matchURL: string = "https://en.wikipedia.org/wiki/2016_US_Chess_Championship";
  @Input() searchURL: string = 'https://www.chessgames.com/perl/ezsearch.pl?search=';

  constructor(public olga: OlgaService, public layout: LayoutService) { }

  ngOnInit(): void {
  }

  setHeader(map: Map<string, string>): void {
    this.event = this.olga.setName;
    this.eventDate = this.olga.setDate;
    const event = map.get('Event');
    if (event) {
      this.match = event;
    }
    const matchDate = map.get('Match Date');
    if (matchDate) {
      this.matchDate = matchDate;
    } else {
      this.matchDate = '';
    }
    const white = map.get('White');
    if (white) {
      this.white = white;
      const pdata = this.olga.getPlayerData(white) as PlayerData;
      if(pdata) {
        this.whiteData = pdata;
        if(!pdata.image) {
          this.whiteData.image = STOCK_IMAGE;
        }
      } else{
        this.whiteData = {image: STOCK_IMAGE} as PlayerData;
      }
    } 
    const black = map.get('Black');
    if (black) {
      this.black = black;
      const pdata = this.olga.getPlayerData(black) as PlayerData | null;
      if(pdata) {
        this.blackData = pdata;
        if(!pdata.image) {
          this.blackData.image = STOCK_IMAGE;
        }
      }else{
        this.blackData = {image: STOCK_IMAGE} as PlayerData;
      }
    }
    const whiteElo = map.get('White Elo');
    if (whiteElo) {
      this.whiteElo = whiteElo;
    }
    const blackElo = map.get('Black Elo');
    if (blackElo) {
      this.blackElo = blackElo;
    }
    const variant = map.get('Variant');
    if (variant) {
      this.variant = variant;
    }
  }
 
  public setMatchUrl(src: string): void {
    this.matchURL = src;
  }

  public searchDate(): void {
    if (this.matchDate.length) {
      const d = new Date(this.matchDate);
      const year = d.getFullYear();
      const date = d.getDate();
      const month = d.getMonth();
      let output = '';
      if (year) {
        output = year.toString();
        if (month || date) {
          output += '-';
        }
      }
      if (month) {
        output += (month + 1).toString();
        if (date) {
          output += '-';
        }
      }
      if (date) {
        output += date.toString();
      }
      window.open(this.searchURL + output);
    }
  }

  previousGame(): void {
    if (this.currentGame > 0) {
      --this.currentGame;
    }
    if (this.currentGame >= 0) {
      this.olga.selectGame(this.currentGame)
    }
  }
  nextGame(): void {
    if (this.currentGame < this.gameCount) {
      this.olga.selectGame(++this.currentGame)
    }
  }
}
