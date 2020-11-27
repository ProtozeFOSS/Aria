import { Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { LayoutService } from '../services/layout.service';
import { STOCK_IMAGE, PlayerData, OlgaService } from '../services/olga.service';
const MIN_WIDTH_PS = 260; // Minimum width Player Showcase
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
  @Output() hasScore = true;
  @Input() matchURL: string = "https://en.wikipedia.org/wiki/2016_US_Chess_Championship";
  @Input() searchURL: string = 'https://www.chessgames.com/perl/ezsearch.pl?search=';

  // HTML Element Handles
  // @ts-ignore
  @ViewChild('containerElement') containerElement: ElementRef;
  // @ts-ignore
  @ViewChild('variantElement') variantElement: ElementRef;
  // @ts-ignore
  @ViewChild('titleContainerElement') titleContainerElement: ElementRef;
  // @ts-ignore
  @ViewChild('prevButtonElement') prevButtonElement: ElementRef;
  // @ts-ignore
  @ViewChild('matchHeaderElement') matchHeaderElement: ElementRef;
  // @ts-ignore
  @ViewChild('nextButtonElement') nextButtonElement: ElementRef;
  // @ts-ignore
  @ViewChild('resultSectionElement') resultSectionElement: ElementRef;
  // @ts-ignore
  @ViewChild('scoreElement') scoreElement: ElementRef;
  // @ts-ignore
  @ViewChild('playerSectionElement') playerSectionElement: ElementRef;
  headerContainer: HTMLElement | null = null;

  constructor(public olga: OlgaService, public layout: LayoutService) {
    olga.attachHeader(this);
    layout.attachHeader(this);
   }

  ngOnInit(): void {}

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
  resize(width: number, height: number, state: number) {
    switch(state) {
        case 1 : // Full Portrait
        case 2:
          let variantHeight = (height * .05);
          let fontSize = ((width)/this.match.length) + 4;
          if(this.headerContainer){
            this.headerContainer.style = 'left:0px;right:0px;top:0px;'; 
          }
          this.containerElement.nativeElement.style = 'max-height:' + height + 'px;width:100%;margin-left:0px;margin-right:1px;'
          this.variantElement.nativeElement.style = 'margin-left: 2px;order:0;z-index:4;width:auto;height:'+ variantHeight + 'px;margin-top:' + (42 - variantHeight)/2 + 'px;';
         // this.resultSectionElement.nativeElement.style = 'order:1;min-height:24px;height:32px;top-margin:2px;background:red;width:' + (width - (8+ variantWidth) + 'px;');
          this.titleContainerElement.nativeElement.style ='margin-left:2px;margin-top:-2px;z-index:10;line-height:32px;display:flex;z-index:4;order:1;margin-right:4px;height:auto;width:auto;';
          this.matchHeaderElement.nativeElement.style = 'font-size:' + fontSize + 'px;line-height:' +  Math.round(fontSize + 1) + 'px;margin-top:' + (24 - fontSize) + 'px';
          this.playerSectionElement.nativeElement.style = 'margin-top:-8px; max-height:' + (height * .35) + 'px;';
          break;
        case 3: // Full Landscape
          this.variantElement.nativeElement.style = 'min-height:32px;min-width:166px;margin-top:2px;height: 48px;flex-grow:2;order:0;z-index:10;';
          this.titleContainerElement.nativeElement.style =
          'order:1;height: auto;line-height:42px;font-size: 160%;text-align:center;min-width: 140px;width: calc(100% - 72px);min-height:42px;' 
          'padding-bottom:4px;font-family: Candara;.match-date{height: 22px;font-size:72%;font-weight: bold;text-align: center;line-height:4px;}';
          break;
        case 4: // Vertical Column w/ Scroll
            this.variantElement.nativeElement.style = 'margin-left:46px;self-align:center;margin-top:2px;height: 52px;flex-grow:2;order:0;z-index:10;';
            //this.topHeaderElement.nativeElement.style = 'margin-top:4px;line-height: 12px;display: flex;font-size:12px;order:1;z-index:10;width:' + width + 'px';
          break;
        default: break;
    }
  }
}
