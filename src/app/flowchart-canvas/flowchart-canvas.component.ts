import { DataLoaderService } from './../services/data-loader.service';
import { Component, OnInit, ViewChild, ElementRef, Input} from '@angular/core';

@Component({
  selector: 'app-flowchart-canvas',
  templateUrl: './flowchart-canvas.component.html',
  styleUrls: ['./flowchart-canvas.component.scss']
})
export class FlowchartCanvasComponent implements OnInit {

  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasWrapper', {static: true}) canvasWrapper: ElementRef<HTMLDivElement>;
  @ViewChild('childrenListWrapper', {static: true}) childrenListWrapper: ElementRef<HTMLDivElement>;
  @ViewChild('childrenList', {static: true}) childrenList: ElementRef<HTMLUListElement>;

  private ctx: CanvasRenderingContext2D;
  data: any;
  materialClicked: any;

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

        this.createCircle(node['bottomX'], nodeHeight/2 + node['topY'], branch.direction, branch.process)

        this.createLine(node['bottomX'], nodeHeight/2 + node['topY'], node['bottomX'] + (this.shapesOffset / 2) - this.circleRadius, nodeHeight/2 + node['topY']);
        this.createLine(node['bottomX'] + (this.shapesOffset / 2) + this.circleRadius, nodeHeight/2 + node['topY'], node['bottomX'] + this.shapesOffset, nodeHeight/2 + node['topY']);
      }
      if(branch.direction === 'left') {
        x = node['topX'] - this.shapesOffset - this.reactangleWidth;
        y = node['topY'];

        this.createCircle(node['topX'], nodeHeight/2 + node['topY'], branch.direction, branch.process)

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

  private createCircle(fromX, y, direction, text): void {
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
    this.createText(text, x - text.length * 3, y + 6, '12px serif');
  }

  private handleCanvasClick(x, y): void {
    this.materialClicked = null;
    this.findMaterialClicked([{material: this.data.root}], this.canvasWrapper.nativeElement.scrollLeft + x, this.canvasWrapper.nativeElement.scrollTop + y)
    const p = document.createElement('p');

    if(this.materialClicked !== null) {
      this.appendChildrenList(this.materialClicked);
    }
  }

  private appendChildrenList(node): void {
    
    while(this.childrenList.nativeElement.firstChild) {
      this.childrenList.nativeElement.removeChild(this.childrenList.nativeElement.firstChild)
    }

    node.children.forEach(child => {
      this.childrenList.nativeElement.appendChild(this.createChildrenListItem(child.id));
    })
    this.childrenListWrapper.nativeElement.style.top = this.materialClicked['topY'] + 'px';
    this.childrenListWrapper.nativeElement.style.left = this.materialClicked['bottomX'] + 5 + 'px';
    this.childrenListWrapper.nativeElement.style.display = 'block';
  }

  private createChildrenListItem(value): HTMLLIElement {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'children';
    checkbox.value = value;
    checkbox.id = value;

    const label = document.createElement('label');
    label.htmlFor = value;
    label.appendChild(document.createTextNode(value));

    li.appendChild(checkbox);
    li.appendChild(label);
    return li;
  }

  public hideSelectionsMenu(): void {
    this.childrenListWrapper.nativeElement.style.display = 'none';
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  //@TODO
  //Find more optimized and better approach to search material.
  private findMaterialClicked(branches, x, y): any {
    branches.forEach(branch => {
      // console.log(branch);
      if(this.compareClickWithNode(branch.material, x, y)) {
        // console.log('FOUND', branch.material)
        this.materialClicked = branch.material;
      } else {
        if(branch.material.branches.length > 0) {
          return this.findMaterialClicked(branch.material.branches, x, y);
        }
      }
    })
  }

  private compareClickWithNode(node, x, y): boolean {
    if(x >= node['topX'] && x <= node['bottomX'] && y >= node['topY'] && y <= node['bottomY']) {
      return true;
    }
    return false;
  }
}
