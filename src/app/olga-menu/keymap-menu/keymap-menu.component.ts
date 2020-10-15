import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

export class FeatherIcons{
  public static readonly Rewind = '/assets/images/feather-sprite.svg#rewind';
  public static readonly Forward = '/assets/images/feather-sprite.svg#forward';
}

@Component({
  selector: 'keymap-menu',
  templateUrl: './keymap-menu.component.html',
  styleUrls: ['./keymap-menu.component.scss']
})
export class KeymapMenuComponent implements OnInit {
  public icons = FeatherIcons;
  @ViewChild('container', {static: false}) container: ElementRef | null = null;
  constructor() { }

  ngOnInit(): void {
  }

  hide():void {
    if(this.container) {
      this.container.nativeElement.style.visibility = 'hidden';
    }
  }
  show():void {
    if(this.container) {
      this.container.nativeElement.style.visibility = 'visible';
    }
  }
  resize(width: number, height: number): void { 
    
  }
}
