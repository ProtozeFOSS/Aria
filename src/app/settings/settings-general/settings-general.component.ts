import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'settings-general',
  templateUrl: './settings-general.component.html',
  styleUrls: ['./settings-general.component.scss']
})
export class SettingsGeneralComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  hide():void {
    // if(this.container) {
    //   this.container.nativeElement.style.visibility = 'hidden';
    //   if(this.settingsBoard)
    //   this.settingsBoard.hide();
    // }
  }
  show():void {
    // if(this.container) {
    //   this.container.nativeElement.style.visibility = 'visible';
    //   if(this.settingsBoard)
    //   this.settingsBoard.show();
    // }
  }
}
