import { Component, Input, OnInit } from '@angular/core';
import {STOCK_IMAGE, PlayerData } from '../../services/olga.service';
@Component({
  selector: 'player-showcase',
  templateUrl: './player-showcase.component.html',
  styleUrls: ['./player-showcase.component.scss']
})
export class PlayerShowcaseComponent implements OnInit {
  @Input() name: string = '';
  @Input() color: boolean = false;
  @Input() elo: string = '';
  @Input() title: string = '';
  @Input() playerData: PlayerData = {image: STOCK_IMAGE }
  @Input() searchURL: string = '';
  constructor() { }

  ngOnInit(): void {

  }
  search(value: string): void {
    if (this.searchURL) {
      window.open(this.searchURL + value);
    }

  }

}
