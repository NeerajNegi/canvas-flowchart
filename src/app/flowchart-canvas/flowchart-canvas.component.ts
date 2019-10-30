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
  shapesOffset = 300;
  circleRadius = 50;

  constructor(private dataLoader: DataLoaderService) { }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.canvas.width = window.innerWidth * 2;
    this.ctx.canvas.height = window.innerHeight * 0.6;

    this.ctx.fillStyle = '#d6d6d6';
    this.ctx.fillRect(0,0, this.ctx.canvas.width,this.ctx.canvas.height);

    this.ctx.canvas.addEventListener('click', (event) => {
      this.handleCanvasClick(event.clientX, event.clientY);
    })

    this.dataLoader.getJSON().subscribe(res => {
      this.data = res;
      this.draw(this.data.root, this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 - this.rectangleHeight / 2);
      console.log(this.data);
    });
  }

  // Drawing in both left and right direction
  private draw(node, x, y) {
    this.createRectangle(node, x, y);
    if(node.branches.length === 0) {
      return;
    }
    const nodeHeight = node['bottomY'] - node['topY'];
    node.branches.forEach(branch => {
      if(branch.direction === 'right') {
        x = node['bottomX'] + this.shapesOffset;
        y = node['topY'];

        this.createCircle(node['bottomX'], nodeHeight/2 + node['topY'], branch.direction)

        this.createLine(node['bottomX'], nodeHeight/2 + node['topY'], node['bottomX'] + (this.shapesOffset / 2) - this.circleRadius, nodeHeight/2 + node['topY']);
        this.createLine(node['bottomX'] + (this.shapesOffset / 2) + this.circleRadius, nodeHeight/2 + node['topY'], node['bottomX'] + this.shapesOffset, nodeHeight/2 + node['topY']);
      }
      if(branch.direction === 'left') {
        x = node['topX'] - this.shapesOffset - this.reactangleWidth;
        y = node['topY'];
        
        this.createCircle(node['topX'], nodeHeight/2 + node['topY'], branch.direction)

        this.createLine(node['topX'], nodeHeight/2 + node['topY'], node['topX'] - (this.shapesOffset / 2) + this.circleRadius, nodeHeight/2 + node['topY']);
        this.createLine(node['topX'] - (this.shapesOffset / 2) - this.circleRadius, nodeHeight/2 + node['topY'], node['topX'] - this.shapesOffset, nodeHeight/2 + node['topY']);
      }
      this.draw(branch.material, x, y);
    });
  }

  

  private createRectangle(node, x, y): void {
    this.ctx.strokeRect(x, y, this.reactangleWidth, this.rectangleHeight);
    node['topX'] = x;
    node['topY'] = y;
    node['bottomX'] = x + this.reactangleWidth;
    node['bottomY'] = y + this.rectangleHeight;

    this.createText(node.id, node['topX'] + 10, node['topY'] + 30);
  }

  private createText(text, x, y, font = '', fillColor = ''): void {
    this.ctx.font = font || '26px serif';
    this.ctx.fillStyle = fillColor || 'black';
    this.ctx.fillText(text, x, y);
  }

  private createLine(fromX, fromY, toX, toY): void {
    this.ctx.beginPath();
    this.ctx.moveTo(fromX, fromY);
    this.ctx.lineTo(toX, toY);
    this.ctx.stroke();
  }

  private createCircle(fromX, y, direction): void {
    let x;
    if(direction === 'right') {
      x = fromX + this.shapesOffset / 2;
    } else  {
      x = fromX - this.shapesOffset / 2;
    }
    const radius = this.circleRadius;
    this.ctx.beginPath();
    this.ctx.arc(x,y,radius,0,Math.PI*2);
    this.ctx.stroke();
  }

  private handleCanvasClick(x, y): void {
    console.log({x,y});
    // console.log(this.findMaterialClicked(this.data.root, x, y));
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  // private findMaterialClicked(node, x, y): any {
  //   if(x >= node['topX'] && x <= node['bottomX'] && y >= node['topY'] && y <= node['bottomY']) {
  //     return node;
  //   }
  //   if(node.branches.length > 0) {
  //     node.branches.forEach(branch => {
  //       if(branch.material.branches.length > 0) {
  //         return this.findMaterialClicked(branch.material,x , y);
  //       } else {
  //         if(x >= branch.material['topX'] && x <= branch.material['bottomX'] && y >= branch.material['topY'] && y <= branch.material['bottomY']) {
  //           return branch.material;
  //         }
  //       }
  //     })
  //   }
  // }

  // Drawing only in right direction
  // private draw(node, x, y) {
  //   this.createRectangle(node, x, y);
  //   if(node.branches.length === 0) {
  //     return;
  //   }
  //   const nodeHeight = node['bottomY'] - node['topY'];
  //   this.createLine(node['bottomX'], node['topY'] + (nodeHeight / 2));
  //   node.branches.forEach(branch => {
  //     x = node['bottomX'] + this.shapesOffset;
  //     y = node['topY'];
  //     this.draw(branch.material, x, y);
  //   });
  // }  
}
