import { AfterViewInit, Component, Input, OnInit, Output, ViewChild } from '@angular/core';

import { CanvasChessBoard } from '../../../canvas-chessboard/canvas-chessboard.component';
import { ColorService } from '../../../services/colors.service';
@Component({
  selector: 'variation-item',
  templateUrl: './variation-item.component.html',
  styleUrls: ['./variation-item.component.scss']
})
export class VariationItemComponent implements OnInit, AfterViewInit {
  @Input() data: any | null = null;
  @Output() score = '';
  @ViewChild ('board') board: CanvasChessBoard | null = null;
  constructor(public colorService: ColorService) { }

  ngOnInit(): void {
    if(this.data) {
      const node = this.data.first();
      this.score = node ? node.notation() : '';
    }
  }

  ngAfterViewInit(): void {
    if(this.data) {
      const node = this.data.first();
      if(node) {
        window.setTimeout(()=>{
          if(this.board) {
            this.board.setBoardToPosition(node.position());
          }
        }, 10);
      }
    }
  }


}
