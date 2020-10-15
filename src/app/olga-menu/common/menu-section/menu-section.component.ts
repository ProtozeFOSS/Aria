import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'menu-section',
  templateUrl: './menu-section.component.html',
  styleUrls: ['./menu-section.component.scss']
})
export class MenuSectionComponent implements OnInit {
  @Input() sectionTitle = '';
  constructor() { }

  ngOnInit(): void {
  }

}
