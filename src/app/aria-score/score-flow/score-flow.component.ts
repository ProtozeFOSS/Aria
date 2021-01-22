import {
  Component,
  OnInit,
  QueryList,
  ViewChildren,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { AriaService } from 'src/app/services/aria.service';
import { FlowItem } from './flow-item/flow-item.component';

@Component({
  selector: 'score-flow',
  templateUrl: './score-flow.component.html',
  styleUrls: ['./score-flow.component.scss'],
})

export class ScoreFlow implements OnInit, OnChanges {
  @ViewChildren(FlowItem) scoreItems!: QueryList<FlowItem>;
  @ViewChild('container') container!: ElementRef | null;
  @Output() currentItem: FlowItem | null = null;
  constructor(public aria: AriaService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  selectGameScoreItem(index: number) {
    if (this.currentItem) {
      this.currentItem.setSelected(false);
      this.currentItem = null;
    }
    if (index >= 0) {
      const item = this.scoreItems?.toArray()[index];
      if (item && item != this.currentItem) {
        item.setSelected(!item.isSelected());
        this.currentItem = item;
      }
    }
  }

  openItemMenu(event: MouseEvent, item: FlowItem): void {
    event.preventDefault();
    event.stopPropagation();
    console.log(item);
    if (item.data) {
      //item.setCurrent(!item.data.current);
    }
    switch (item.data.type) { // open different menus

    }
  }

  clearSelection(): void {
    const flowItems = this.scoreItems.toArray();
    for (let i = 0; i < flowItems.length; ++i) {
      flowItems[i].setSelected(false);
    }
  }

  resize(width: number, height: number): void {
    if (this.container) {
      const div = this.container.nativeElement;
      const border = document.documentElement.style.getPropertyValue('--gsBorderSL');
      const borderWidth = (parseFloat(border) * 2);
      if(borderWidth) {
        width -= borderWidth;
        height -= borderWidth;
      }
      if(height <= 0) { 
        div.style.height = 'auto';  
        div.style.overflowY = 'visible';      
      }else {
        div.style.height = height + 'px';
        div.style.overflowY = 'scroll';
      }
      if(width <= 0) {
        div.style.width ='100%';
        div.style.maxWidth = '';
      } else {
        div.style.width = width + 'px';
        div.style.maxWidth = width + 'px';
      }
    }
  }
}
