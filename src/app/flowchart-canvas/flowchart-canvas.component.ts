import { DataLoaderService } from './../services/data-loader.service';
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';

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
  shapesOffset = 400;

  constructor(private dataLoader: DataLoaderService, private ngZone: NgZone ) { }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight * 0.6;

    this.ctx.canvas.addEventListener('click', (event) => {
      console.log(event);
      this.handleCanvasClick(event.clientX, event.clientY);
    })

    this.dataLoader.getNewJSON().subscribe(res => {
      this.data = res;
      this.draw(this.data.root, 25, this.ctx.canvas.height / 2 - this.rectangleHeight / 2);
    });

    // this.ngZone.runOutsideAngular(() => this.animate());
  }

  private draw(node, x, y) {
    this.createRectangle(node, x, y);
    if(node.branches.length === 0) {
      return;
    }
    node.branches.forEach(branch => {
      x = node['topX'] + this.shapesOffset;
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
    console.log(node);
  }

  private handleCanvasClick(x, y): void {

  }

  // private fillReactangles(): void {
  //   for(let i=0;i<1000;i++) {
  //     this.createRectangle();
  //   }
  // }

  // private createRectangle(): void {
  //   this.ctx.fillStyle = this.randomRGBA();

  //   const x = Math.floor(Math.random() * (1200 - 0)) + 0;
  //   const y = Math.floor(Math.random() * (500 - 0)) + 0;
  //   const w = Math.floor(Math.random() * (50 - 10)) + 10;
  //   const h = Math.floor(Math.random() * (80 - 10)) + 10;
  //   this.ctx.fillRect(x, y, w, h);
  // }

  // private randomRGBA(): string {
  //   var o = Math.round, r = Math.random, s = 255;
  //   return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
  // }

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  // private animate(): void {
  //   this.clearCanvas();
  //   this.fillReactangles();
  //   requestAnimationFrame(() => this.animate());
  // }

}
