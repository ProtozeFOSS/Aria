import { Component, ElementRef, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { environment } from '../../environments/environment';
import { GamescoreUxComponent } from '../olga-score/olga-score.component';
import { LayoutService } from '../services/layout.service';
import { STOCK_IMAGE, PlayerData, OlgaService } from '../services/olga.service';
const MIN_WIDTH_PS = 260; // Minimum width Player Showcase
@Component({
  selector: 'olga-header',
  templateUrl: './olga-header.component.html',
  styleUrls: ['./olga-header.component.scss']
})
export class OlgaHeaderComponent implements OnInit {
  environment = environment;
  @Input() variant: string = 'Classical';
  @Input() event: string = '';
  @Input() eventDate: string = '';
  @Input() setDate: string = '';
  @Input() white: string = '';
  @Input() black: string = '';
  @Input() whiteData: PlayerData = { image: environment.imagesPath + "player.png" };
  @Input() blackData: PlayerData = { image: environment.imagesPath + "player.png" };
  @Input() whiteElo: string = '';
  @Input() blackElo: string = '';
  @Input() round = '';
  @Input() opening = '';
  @Input() site = '';
  @Input() siteFlag = '';
  @Input() currentGame: number = 0;
  @Input() gameCount: number = 0;
  @Output() result = '';
  @Output() trophySource = environment.imagesPath + 'draw.png';
  @Input() eventURL: string = "https://en.wikipedia.org/wiki/2016_US_Chess_Championship";
  @Input() searchURL: string = 'https://www.chessgames.com/perl/ezsearch.pl?search=';

  // HTML Element Handles
  // HTML Element Handles

  @ViewChild('containerElement') containerElement!: ElementRef;
  @ViewChild('titleContainerElement') titleContainerElement!: ElementRef;
  @ViewChild('prevButtonElement') prevButtonElement!: ElementRef;
  @ViewChild('matchHeaderElement') matchHeaderElement!: ElementRef;
  @ViewChild('nextButtonElement') nextButtonElement!: ElementRef;
  @ViewChild('resultSectionElement') resultSectionElement!: ElementRef;
  @ViewChild('variantElement') variantElement!: ElementRef;
  @ViewChild(GamescoreUxComponent) scoreComponent!: GamescoreUxComponent;
  @ViewChild('playerSectionElement') playerSectionElement!: ElementRef;
  headerContainer: HTMLElement | null = null;

  constructor(public olga: OlgaService, public layout: LayoutService, private renderer: Renderer2) {
    olga.attachHeader(this);
    layout.attachHeader(this);
  }

  ngOnInit(): void { }

  setHeader(map: Map<string, string>): void {
    this.eventDate = this.olga.setDate;
    const event = map.get('Event');
    if (event) {
      this.event = event;
    }
    const eventDate = map.get('Event Date');
    if (eventDate) {
      this.eventDate = eventDate;
    }
    const white = map.get('White');
    if (white) {
      this.white = white;
      const pdata = this.olga.getPlayerData(white) as PlayerData;
      if (pdata) {
        this.whiteData = pdata;
        if (!pdata.image) {
          this.whiteData.image = STOCK_IMAGE;
        }
      } else {
        this.whiteData = { image: STOCK_IMAGE } as PlayerData;
      }
    }
    const black = map.get('Black');
    if (black) {
      this.black = black;
      const pdata = this.olga.getPlayerData(black) as PlayerData | null;
      if (pdata) {
        this.blackData = pdata;
        if (!pdata.image) {
          this.blackData.image = STOCK_IMAGE;
        }
      } else {
        this.blackData = { image: STOCK_IMAGE } as PlayerData;
      }
    }
    const gameData = this.olga.getGameData(this.currentGame);
    if (gameData) {
      if (gameData.opening)
        this.opening = gameData.opening;
      else this.opening = '';

      if (gameData.country) {
        this.siteFlag = environment.flagsPath + gameData.country + '.png';
      } else {
        this.siteFlag = '';
      }
    } else {
      this.opening = '';
      this.siteFlag = '';
    }
    const site = map.get('Site');
    if (site) {
      this.site = site;
    } else {
      this.site = '';
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
    if (this.olga.setDate.length > 0) {
      this.setDate = this.olga.setDate;
    }
    const round = map.get('Round');
    if (round) {
      this.round = 'Round ' + round;
    } else {
      this.round = '';
    }
    const result = map.get('Result');
    if (result) {
      if (result.length == 1) {
        this.result = 'Abandoned';
        this.trophySource = '';
        return;
      }
      this.result = result + ' in ' + this.olga.getPlyCount() + ' moves';
      if (result == '1-0') {
        this.trophySource = environment.imagesPath + 'wwins.png';
        return;
      }
      if (result == '0-1') {
        this.trophySource = environment.imagesPath + 'bwins.png';
        return;
      }
      if (result == '1/2-1/2') {
        this.trophySource = environment.imagesPath + 'draw.png';
        return;
      }
    }
  }

  public setMatchUrl(src: string): void {
    this.eventURL = src;
  }

  public searchDate(): void {
    if (this.eventDate.length) {
      const d = new Date(this.eventDate);
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
  resize(width: number, height: number) {
    if (this.layout.headerElement) {
      this.layout.headerElement.style.height = height + 'px';
      this.layout.headerElement.style.maxHeight = height + 'px';
    }
    switch (this.layout.state) {
      case 1: // SBS Portrait
        break;
      case 2: {
        this.containerElement.nativeElement.style = 'height:auto;width:100%;margin-left:0px;margin-right:0px;overflow-y:scroll;';
        if (this.layout.headerElement) {
          this.layout.headerElement.style.width = 'auto';;
          // this.renderer.setStyle(this.layout.headerElement, 'width', '100%');
          // this.renderer.setStyle(this.layout.headerElement, 'left', '0px');
          // this.renderer.setStyle(this.layout.headerElement, 'right', '0px');
          // this.renderer.setStyle(this.layout.headerElement, 'top', '0px');
          // this.renderer.setStyle(this.layout.headerElement, 'bottom', '');
        }
        break;
      }
      case 3: {
        //this.variantElement.nativeElement.style = 'margin-left:4px;margin-top:-20px;margin-right:-18px;flex-grow:0;order:0;z-index:10; width:180px';
        let scoreSize = height;
        if (this.resultSectionElement) {
          scoreSize -= this.resultSectionElement.nativeElement.clientHeight;
        }
        if (this.playerSectionElement) {
          scoreSize -= (this.playerSectionElement.nativeElement.clientHeight - 48);
        }
        if (this.matchHeaderElement) { // should be 83
          scoreSize -= this.matchHeaderElement.nativeElement.clientHeight;
        }
        if (this.layout.headerElement) {
          this.renderer.setStyle(this.layout.headerElement, 'left', '');
        }
        this.titleContainerElement.nativeElement.style =
          'order:1;height: auto;line-height:42px;font-size: 110%;text-align:center;min-width: 140px;width: calc(100% - 188px);min-height:42px;'
        'padding-bottom:4px;font-family: Candara;.match-date{height: 22px;font-size:72%;font-weight: bold;text-align: center;line-height:4px;}';

        if (this.layout.gameScoreElement) {
          this.renderer.setStyle(this.layout.gameScoreElement, 'overflow-y', 'auto');
          this.renderer.setStyle(this.layout.gameScoreElement, 'height', 'auto');
        }

        window.setTimeout(() => { this.scoreComponent.resize(width, Math.ceil(scoreSize)) }, 4);
        break;
      }
      case 4: {
        //this.variantElement.nativeElement.style = 'margin-top:8px;flex-grow:0;order:0;margin-left:2px;z-index:10;margin-right:-16px;width:142px';
        this.titleContainerElement.nativeElement.style = 'order:2;justify-content:center;line-height:42px;font-size:100%;text-align:center;min-width:300px;margin-right:2px;margin-left:2px;width:auto;min-height:42px;'
        'padding-bottom:4px;font-family: Candara;.match-date{height: 18px;font-size:64%;font-weight: bold;text-align: center;line-height:4px;}';
        let scoreSize = height;
        if (this.resultSectionElement) {
          scoreSize -= this.resultSectionElement.nativeElement.clientHeight;
        }
        if (this.playerSectionElement) {
          scoreSize -= (this.playerSectionElement.nativeElement.clientHeight - 48);
        }
        if (this.matchHeaderElement) { // should be 83
          scoreSize -= this.matchHeaderElement.nativeElement.clientHeight;
        }
        // 773 - 455 = 318
        if (this.layout.gameScoreElement) {
          this.renderer.setStyle(this.layout.gameScoreElement, 'overflow-y', '');
          this.renderer.setStyle(this.layout.gameScoreElement, 'height', 'auto');
        }
        // if (this.layout.headerElement) {
        //   this.renderer.setStyle(this.layout.headerElement, 'left', '');
        // }
        window.setTimeout(() => {
          if (this.scoreComponent) {
            this.scoreComponent.resize(width, Math.ceil(scoreSize))
          }
        }, 4);
        //this.scoreComponent.resize(width, height - 344);
        break;
      }
      default: break;
    }
  }
}
