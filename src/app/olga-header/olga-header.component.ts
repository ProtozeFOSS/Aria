import { Component, Input, OnInit } from '@angular/core';
import { LayoutService } from '../services/layout.service';
import { OlgaService } from '../services/olga.service';

@Component({
  selector: 'olga-header',
  templateUrl: './olga-header.component.html',
  styleUrls: ['./olga-header.component.scss']
})
export class OlgaHeaderComponent implements OnInit {
  @Input() variant: string = 'Classic';
  @Input() event: string = 'Norway Chess';
  @Input() eventDate: string = '10/05/2020';
  @Input() match: string = 'Game 2 Semi-Final';
  @Input() matchDate: string = '10/05/2020';
  @Input() white: string = 'Aryan Tari';
  @Input() black: string = 'Fabiano Caruana';
  @Input() whiteElo: string | number = '2633';
  @Input() blackElo: string | number = '2688';
  constructor(public olga: OlgaService, public layout: LayoutService) { }

  ngOnInit(): void {
  }

  setHeader(map: Map<string,string>) :void {
    console.log(map);
    const event = map.get('Event');
    if(event) {
      this.event = event;
    }
    const eventDate = map.get('Event Date');
    if(eventDate) {
      this.eventDate = eventDate;
      this.matchDate = eventDate;
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
  }
}
