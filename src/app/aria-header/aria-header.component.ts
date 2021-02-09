import { Component, ElementRef, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { environment } from '../../environments/environment';
import { AriaScore } from '../aria-score/aria-score.component';
import { LayoutService } from '../services/layout.service';
import { STOCK_IMAGE, PlayerData, AriaService } from '../services/aria.service';
@Component({
  selector: 'aria-header',
  templateUrl: './aria-header.component.html',
  styleUrls: ['./aria-header.component.scss']
})
export class AriaHeader implements OnInit {
  environment = environment;
  @Input() variant: string = 'Chess';
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
  
  @ViewChild('containerElement') containerElement!: ElementRef;
  @ViewChild('titleContainerElement') titleContainerElement!: ElementRef;
  @ViewChild('prevButtonElement') prevButtonElement!: ElementRef;
  @ViewChild('matchHeaderElement') matchHeaderElement!: ElementRef;
  @ViewChild('nextButtonElement') nextButtonElement!: ElementRef;
  @ViewChild('resultSectionElement') resultSectionElement!: ElementRef;
  @ViewChild('variantElement') variantElement!: ElementRef;
  @ViewChild(AriaScore) scoreComponent!: AriaScore;
  @ViewChild('playerSectionElement') playerSectionElement!: ElementRef;
  headerContainer: HTMLElement | null = null;

  constructor(public aria: AriaService, public layout: LayoutService, private renderer: Renderer2) {

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.aria.attachHeader(this);
  }

  setHeader(map: Map<string, string>): void {
    this.eventDate = this.aria.setDate;
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
      const pdata = this.aria.getPlayerData(white) as PlayerData;
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
      const pdata = this.aria.getPlayerData(black) as PlayerData | null;
      if (pdata) {
        this.blackData = pdata;
        if (!pdata.image) {
          this.blackData.image = STOCK_IMAGE;
        }
      } else {
        this.blackData = { image: STOCK_IMAGE } as PlayerData;
      }
    }
    const gameData = this.aria.getGameData(this.currentGame);
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
    if (this.aria.setDate.length > 0) {
      this.setDate = this.aria.setDate;
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
      this.result = result + ' in ' + this.aria.getPlyCount() + ' moves';
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
      // TODO: Add External events
    }
  }

 
  
  clickedEvent(): void {

  }

  resize(width: number, height: number) {

    switch (this.layout.state) {
      case 1: 
        this.containerElement.nativeElement.style = 'height:auto;width:100%;margin-left:0px;margin-right:0px;overflow-y:hidden;';
        if (this.layout.headerElement) {
          this.layout.headerElement.style.width = width + 'px';
        }
        break;
      case 2: {// SBS Portrait
        this.containerElement.nativeElement.style = 'height:auto;width:100%;margin-left:0px;margin-right:0px;overflow-y:hidden;';
        if (this.layout.headerElement) {
          this.layout.headerElement.style.width = width + 'px';
        }
        break;
      }
      case 3: {
        //this.variantElement.nativeElement.style = 'margin-left:4px;margin-top:-20px;margin-right:-18px;flex-grow:0;order:0;z-index:10; width:180px';
        if (this.layout.headerElement) {
          this.layout.headerElement.style.height = height + 'px';          
        }
        let scoreSize = height;
        if (this.resultSectionElement) {
          scoreSize -= this.resultSectionElement.nativeElement.clientHeight;
        }
        if (this.playerSectionElement) {
          scoreSize -= (this.playerSectionElement.nativeElement.clientHeight);
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
        if (this.scoreComponent) {
          this.scoreComponent.resize(width, Math.ceil(scoreSize + 42));
          if (this.layout.gameScoreElement) {
            this.renderer.setStyle(this.layout.gameScoreElement, 'overflow-y', 'hidden');
            this.renderer.setStyle(this.layout.gameScoreElement, 'height', scoreSize + 'px');
            this.renderer.setStyle(this.layout.gameScoreElement, 'height', 'auto');
          }
        } else {
          window.setTimeout(() => {
            if (this.scoreComponent) {
              this.scoreComponent.resize(width, Math.ceil(scoreSize + 42));
              if (this.layout.gameScoreElement) {
                this.renderer.setStyle(this.layout.gameScoreElement, 'overflow-y', 'hidden');
                this.renderer.setStyle(this.layout.gameScoreElement, 'height', scoreSize + 'px');
                this.renderer.setStyle(this.layout.gameScoreElement, 'height', 'auto');
              }
            }
          }, 20);
        }
        break;
      }
      case 4: {
        //this.variantElement.nativeElement.style = 'margin-top:8px;flex-grow:0;order:0;margin-left:2px;z-index:10;margin-right:-16px;width:142px';
        if (this.layout.headerElement) {
          this.layout.headerElement.style.height = height + 'px';
        }
        this.titleContainerElement.nativeElement.style = 'order:2;justify-content:center;line-height:42px;font-size:100%;text-align:center;min-width:300px;margin-right:2px;margin-left:2px;width:auto;min-height:42px;'
        'padding-bottom:4px;font-family: Candara;.match-date{height: 18px;font-size:64%;font-weight: bold;text-align: center;line-height:4px;}';
        let scoreSize = height;
        if (this.resultSectionElement) {
          scoreSize -= this.resultSectionElement.nativeElement.clientHeight;
        }
        if (this.playerSectionElement) {
          scoreSize -= (this.playerSectionElement.nativeElement.clientHeight);
        }
        if (this.matchHeaderElement) { // should be 83
          scoreSize -= this.matchHeaderElement.nativeElement.clientHeight;
        }
        // 773 - 455 = 318

        if (this.scoreComponent) {
          this.scoreComponent.resize(width, Math.ceil(scoreSize + 48));
          if (this.layout.gameScoreElement) {
            this.renderer.setStyle(this.layout.gameScoreElement, 'overflow-y', 'hidden');
            this.renderer.setStyle(this.layout.gameScoreElement, 'height', scoreSize + 'px');
            this.renderer.setStyle(this.layout.gameScoreElement, 'height', 'auto');
          }
        } else {
          window.setTimeout(() => {
            if (this.scoreComponent) {
              this.scoreComponent.resize(width, Math.ceil(scoreSize + 48));
              if (this.layout.gameScoreElement) {
                this.renderer.setStyle(this.layout.gameScoreElement, 'overflow-y', 'hidden');
                this.renderer.setStyle(this.layout.gameScoreElement, 'height', scoreSize + 'px');
                this.renderer.setStyle(this.layout.gameScoreElement, 'height', 'auto');
              }
            }
          }, 20);
        }
        break;
      }
      default: break;
    }
    if(this.layout.headerElement && height <= 0){
      this.layout.headerElement.style.height = 'auto';
    }
    if (this.matchHeaderElement) {
      let padding = 130 + (this.currentGame > 0 ? 42:0) + (this.currentGame < this.gameCount - 1 ? 42:0) + (this.variant == 'Chess960' ? 28:0);
      this.renderer.setStyle(this.matchHeaderElement.nativeElement, 'margin-left', (this.currentGame > 0 ? 3:-28) + 'px');
      this.renderer.setStyle(this.matchHeaderElement.nativeElement, 'width', (width - padding) + 'px');
    }
  }
}
