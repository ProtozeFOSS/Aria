import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

export class FeatherIcons{
  public static readonly Rewind = '/assets/images/feather-sprite.svg#rewind';
  public static readonly Forward = '/assets/images/feather-sprite.svg#forward';
}

@Component({
  selector: 'settings-keymap',
  templateUrl: './settings-keymap.component.html',
  styleUrls: ['./settings-keymap.component.scss']
})
export class SettingsKeymapComponent implements OnInit {
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
}
