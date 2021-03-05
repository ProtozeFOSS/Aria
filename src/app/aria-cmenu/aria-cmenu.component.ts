import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AriaService } from '../services/aria.service';
import { LayoutService } from '../services/layout.service';

@Component({
  selector: 'aria-cmenu',
  templateUrl: './aria-cmenu.component.html',
  styleUrls: ['./aria-cmenu.component.scss']
})
export class AriaCMenu implements OnInit {
  @ViewChild('container') container!: ElementRef | null;
  constructor(public aria: AriaService, public layout: LayoutService) { }

  ngOnInit(): void {
  }

  public hasItems(): boolean {
    return (this.aria.actionMap.size > 0);
  }

  public setSize(width: number, height: number): number {
    // calculate true height of items.
    if(this.container) {
    }
    return 0;
  }

  public invoke(key: string) {
    if(this.aria.actionMap) {
      const action = this.aria.actionMap.get(key).action;
      if(action) {
        action();
        this.layout.toggleGlobalMenu();
      }
    }
  }

}
