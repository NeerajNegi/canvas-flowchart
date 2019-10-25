import { DataLoaderService } from './../services/data-loader.service';
import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'app-flowchart-canvas',
  templateUrl: './flowchart-canvas.component.html',
  styleUrls: ['./flowchart-canvas.component.scss']
})
export class FlowchartCanvasComponent implements OnInit {

  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;
  data: any;

  // Shapes Dimensions
  rectangleHeight = 200;
  reactangleWidth = 300;
  shapesOffset = 100;

  constructor(private dataLoader: DataLoaderService) { }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight * 0.6;

    this.ctx.fillStyle = '#d6d6d6';
    this.ctx.fillRect(0,0, this.ctx.canvas.width,this.ctx.canvas.height);

    this.ctx.canvas.addEventListener('click', (event) => {
      console.log(event);
      this.handleCanvasClick(event.clientX, event.clientY);
    })

    this.dataLoader.getNewJSON().subscribe(res => {
      this.data = res;
      this.draw(this.data.root, 25, this.ctx.canvas.height / 2 - this.rectangleHeight / 2);
      console.log(this.data);
    });
  }

  private draw(node, x, y) {
    this.createRectangle(node, x, y);
    if(node.branches.length === 0) {
      return;
    }
    const nodeHeight = node['bottomY'] - node['topY'];
    this.createLine(node['bottomX'], node['topY'] + (nodeHeight / 2));
    node.branches.forEach(branch => {
      x = node['bottomX'] + this.shapesOffset;
      y = node['topY'];
      this.draw(branch.material, x, y);
    });
  }

  private createRectangle(node, x, y): void {
    this.ctx.strokeRect(x, y, this.reactangleWidth, this.rectangleHeight);
    node['topX'] = x;
    node['topY'] = y;
    node['bottomX'] = x + this.reactangleWidth;
    node['bottomY'] = y + this.rectangleHeight;
    // if(node['bottomX'] > this.ctx.canvas.width) {
    //   this.ctx.canvas.width = node['bottomX'] + 20;
    // }
  }

  private createLine(fromX, fromY): void {
    this.ctx.beginPath();
    this.ctx.moveTo(fromX, fromY);
    this.ctx.lineTo(fromX + this.shapesOffset, fromY);
    this.ctx.stroke();
  }

  private handleCanvasClick(x, y): void {
    //handle canvas click event
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  

}
