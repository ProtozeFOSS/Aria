import { AfterViewInit, Component, ElementRef, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';


@Component({
  selector: 'keymap-item',
  templateUrl: './keymap-item.component.html',
  styleUrls: ['./keymap-item.component.scss']
})
export class KeymapItemComponent implements OnInit, AfterViewInit {
  @Input() icon = '';
  @Input() label = '';
  @Input() key = '';
  @ViewChild("svgContainer", { read: ElementRef }) svgContainer: ElementRef | null = null;
  @ViewChild("labelElement", { read: ElementRef }) labelElement: ElementRef | null = null;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if(this.labelElement) {
      this.labelElement.nativeElement.innerHTML = this.label;
    }
    if(this.svgContainer) {
      this.svgContainer.nativeElement.innerHTML = '<use xlink:href="olga2/assets/images/feather-sprite.svg#' + this.icon + '" />';
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if(this.svgContainer) {
      this.svgContainer.nativeElement.innerHTML = '<use xlink:href="olga2/assets/images/feather-sprite.svg#' + this.icon + '" />';
    }
  }
}
