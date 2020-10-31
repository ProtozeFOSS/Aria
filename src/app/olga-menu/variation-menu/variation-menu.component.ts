import { Component, OnInit, Input, AfterViewInit, Output } from '@angular/core';
import { GameScoreItem } from '../../common/kokopu-engine';
import { OlgaService } from '../../services/olga.service';

@Component({
  selector: 'variation-menu',
  templateUrl: './variation-menu.component.html',
  styleUrls: ['./variation-menu.component.scss']
})

export class VariationMenu implements OnInit, AfterViewInit {
  @Input() data: GameScoreItem = new GameScoreItem(null);
  @Input() menuTitle = 'Menu Title';
  @Output() variations = [];
  @Output() item: any = null;
  menuElement: HTMLElement | null = null;
  public visible = false;
  constructor(public olga: OlgaService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if(this.data && this.data.move) {
      this.variations = this.data.move.variations();
    }
    this.menuElement = document.getElementById('variation-menu-' + this.olga.UUID);
  }

  ignoreInnerClicks(event: MouseEvent) {
    event.stopPropagation();
  }
  openAt(item: GameScoreItem): void {
    item.setSelected(true);
    this.data = item;
    this.variations = this.data.move.variations();
    this.menuTitle = item.move.notation();
    this.visible = true;
    if(this.menuElement) {
      this.menuElement.style.visibility = 'visible';
    }
  }
  close():void {
    this.visible = false;
    if(this.menuElement) {
      this.menuElement.style.visibility = 'hidden';
    }
  }

  resize(size: {width: number, height: number}) : void {

  }
}
