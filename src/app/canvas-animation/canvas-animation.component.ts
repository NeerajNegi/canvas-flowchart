import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';

@Component({
  selector: 'app-canvas-animation',
  templateUrl: './canvas-animation.component.html',
  styleUrls: ['./canvas-animation.component.scss']
})
export class CanvasAnimationComponent implements OnInit {

  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;

  constructor(private ngZone: NgZone) { }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight * 0.6;

    this.ngZone.runOutsideAngular(() => this.animate());
  }

  private fillReactangles(): void {
    for(let i=0;i<1000;i++) {
      this.createRectangle();
    }
  }

  private createRectangle(): void {
    this.ctx.fillStyle = this.randomRGBA();

    const x = Math.floor(Math.random() * (1200 - 0)) + 0;
    const y = Math.floor(Math.random() * (500 - 0)) + 0;
    const w = Math.floor(Math.random() * (50 - 10)) + 10;
    const h = Math.floor(Math.random() * (80 - 10)) + 10;
    this.ctx.fillRect(x, y, w, h);
  }

  private randomRGBA(): string {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
  }

  private animate(): void {
    this.clearCanvas();
    this.fillReactangles();
    requestAnimationFrame(() => this.animate());
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

}
