import { Component, Input, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/services/layout.service';
import { environment } from '../../../environments/environment';
import { STOCK_IMAGE, PlayerData } from '../../services/aria.service';
@Component({
  selector: 'player-showcase',
  templateUrl: './player-showcase.component.html',
  styleUrls: ['./player-showcase.component.scss']
})
export class PlayerShowcase implements OnInit {
  @Input() name: string = '';
  @Input() color: boolean = false;
  @Input() elo: string = '';
  @Input() title: string = '';
  @Input() playerData: PlayerData = { image: STOCK_IMAGE }
  environment = environment;
  constructor(public layout: LayoutService) { }

  ngOnInit(): void {

  }
  search(value: string): void {
    // if (this.searchURL) {
    //   window.open(this.searchURL + value);
    // }
    // TODO: Add external url click
  }

}
