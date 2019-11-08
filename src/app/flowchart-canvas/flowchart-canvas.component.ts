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
  selectedChildren: Array<any> = [];

  // Shapes Dimensions
  rectangleHeight = 200;
  reactangleWidth = 300;
  shapesOffset = 300;
  circleRadius = 50;

  constructor(private dataLoader: DataLoaderService) { }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.canvas.width = window.innerWidth * 2;
    this.ctx.canvas.height = window.innerHeight * 0.7;

    this.ctx.fillStyle = '#d6d6d6';
    this.ctx.fillRect(0,0, this.ctx.canvas.width,this.ctx.canvas.height);

    this.ctx.canvas.addEventListener('click', (event) => {
      this.handleCanvasClick(event.clientX, event.clientY);
    })

    this.dataLoader.getJSON().subscribe(res => {
      this.data = this.transformData(res[0]);
      this.draw(this.data.root, this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 - this.rectangleHeight / 2);
      this.canvasWrapper.nativeElement.scrollTo(this.data.root.topX - 500, 0);
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
    const nodeWidth = node['bottomX'] - node['topX']
    node.branches.forEach(branch => {
      if(branch.direction === 'right') {
        if(node.rightBranchesCount === 0){
          //draw below the node
          x = node['bottomX'] + this.shapesOffset;
          y = node['bottomY'] + this.shapesOffset / 3 - this.rectangleHeight / 2;

          // Create straight line from center
          // this.createLine(node['topX'], nodeHeight/2 + node['topY'], node['topX'] - (this.shapesOffset / 2) + this.circleRadius, nodeHeight/2 + node['topY']);
          // this.createLine(node['topX'] - (this.shapesOffset / 2) - this.circleRadius, nodeHeight/2 + node['topY'], node['topX'] - this.shapesOffset, nodeHeight/2 + node['topY']);
          // this.createCircle(node['topX'], nodeHeight/2 + node['topY'], branch.direction, branch.process)

          this.createLine(node['bottomX'] - nodeWidth / 2, node['bottomY'], node['bottomX'] - nodeWidth / 2, node['bottomY'] + this.shapesOffset / 3);
          this.createLine(node['bottomX'] - nodeWidth / 2, node['bottomY'] + this.shapesOffset / 3, node['bottomX'] + (this.shapesOffset / 2) - this.circleRadius, node['bottomY'] + this.shapesOffset / 3);
          this.createCircle(node['bottomX'], node['bottomY'] + this.shapesOffset / 3, branch.direction, branch.process);
          this.createLine(node['bottomX'] + (this.shapesOffset / 2) + this.circleRadius, node['bottomY'] + this.shapesOffset / 3, node['bottomX'] + this.shapesOffset, node['bottomY'] + this.shapesOffset / 3);

          node.rightBranchesCount++;
        } else if(node.rightBranchesCount === 1) {
          //draw above the node
          x = node['bottomX'] + this.shapesOffset;
          y = node['topY'] - this.shapesOffset / 3 - this.rectangleHeight / 2;

          this.createLine(node['bottomX'] - nodeWidth / 2, node['topY'], node['bottomX'] - nodeWidth / 2, node['topY'] - this.shapesOffset / 3);
          this.createLine(node['bottomX'] - nodeWidth / 2, node['topY'] - this.shapesOffset / 3, node['bottomX'] + (this.shapesOffset / 2) - this.circleRadius, node['topY'] - this.shapesOffset / 3);
          this.createCircle(node['bottomX'], node['topY'] - this.shapesOffset / 3, branch.direction, branch.process);
          this.createLine(node['bottomX'] + (this.shapesOffset / 2) + this.circleRadius, node['topY'] - this.shapesOffset / 3, node['bottomX'] + this.shapesOffset, node['topY'] - this.shapesOffset / 3);

          node.rightBranchesCount++;
        }
      }
      if(branch.direction === 'left') {
        if(node.leftBranchesCount === 0){
          //draw below the node
          x = node['topX'] - this.shapesOffset - this.reactangleWidth;
          y = node['bottomY'] + this.shapesOffset / 3 - this.rectangleHeight / 2;

          // Create straight line from center
          // this.createLine(node['topX'], nodeHeight/2 + node['topY'], node['topX'] - (this.shapesOffset / 2) + this.circleRadius, nodeHeight/2 + node['topY']);
          // this.createLine(node['topX'] - (this.shapesOffset / 2) - this.circleRadius, nodeHeight/2 + node['topY'], node['topX'] - this.shapesOffset, nodeHeight/2 + node['topY']);
          // this.createCircle(node['topX'], nodeHeight/2 + node['topY'], branch.direction, branch.process)

          this.createLine(node['topX'] + nodeWidth / 2, node['bottomY'], node['topX'] + nodeWidth / 2, node['bottomY'] + this.shapesOffset / 3);
          this.createLine(node['topX'] + nodeWidth / 2, node['bottomY'] + this.shapesOffset / 3, node['topX'] - (this.shapesOffset / 2) + this.circleRadius, node['bottomY'] + this.shapesOffset / 3);
          this.createCircle(node['topX'], node['bottomY'] + this.shapesOffset / 3, branch.direction, branch.process);
          this.createLine(node['topX'] - (this.shapesOffset / 2) - this.circleRadius, node['bottomY'] + this.shapesOffset / 3, node['topX'] - this.shapesOffset, node['bottomY'] + this.shapesOffset / 3);

          node.leftBranchesCount++;
        } else if(node.leftBranchesCount === 1) {
          //draw above the node
          x = node['topX'] - this.shapesOffset - this.reactangleWidth;
          y = node['topY'] - this.shapesOffset / 3 - this.rectangleHeight / 2;

          this.createLine(node['topX'] + nodeWidth / 2, node['topY'], node['topX'] + nodeWidth / 2, node['topY'] - this.shapesOffset / 3);
          this.createLine(node['topX'] + nodeWidth / 2, node['topY'] - this.shapesOffset / 3, node['topX'] - (this.shapesOffset / 2) + this.circleRadius, node['topY'] - this.shapesOffset / 3);
          this.createCircle(node['topX'], node['topY'] - this.shapesOffset / 3, branch.direction, branch.process);
          this.createLine(node['topX'] - (this.shapesOffset / 2) - this.circleRadius, node['topY'] - this.shapesOffset / 3, node['topX'] - this.shapesOffset, node['topY'] - this.shapesOffset / 3);

          node.leftBranchesCount++;
        }
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

    if(this.materialClicked !== null) {
      console.log(this.materialClicked);
      this.appendChildrenList(this.materialClicked, 'right');
    }
  }

  private appendChildrenList(node, direction): void {
    this.selectedChildren = [];

    while(this.childrenList.nativeElement.firstChild) {
      this.childrenList.nativeElement.removeChild(this.childrenList.nativeElement.firstChild)
    }

    node.branches.forEach(child => {
      if(child.direction === direction) {
        this.childrenList.nativeElement.appendChild(this.createChildrenListItem(child));
      }
    })

    this.childrenListWrapper.nativeElement.style.top = this.materialClicked['topY'] + 'px';
    this.childrenListWrapper.nativeElement.style.left = this.materialClicked['bottomX'] + 5 + 'px';
    this.childrenListWrapper.nativeElement.style.display = 'block';
  }

  private createChildrenListItem(node): HTMLLIElement {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'children';
    checkbox.value = node['material']['id'];
    checkbox.id = node['material']['id'];

    const label = document.createElement('label');
    label.htmlFor = node['material']['id'];
    label.appendChild(document.createTextNode(node['material']['id']));

    checkbox.addEventListener('change', (event: any) => {
      if(event.target.checked) {
        this.selectedChildren.push(node);
      } else {
        const filteredChildren = this.selectedChildren.filter(child => child.id !== node['material']['id']);
        this.selectedChildren = [ ...filteredChildren ];
      }
      console.log(this.selectedChildren);
    })

    li.appendChild(checkbox);
    li.appendChild(label);
    return li;
  }

  public hideSelectionsMenu(): void {
    this.childrenListWrapper.nativeElement.style.display = 'none';
  }

  private showSelections(): void {
    // this.materialClicked.branches.pop();
    // this.materialClicked.branches.pop();
    this.hideSelectionsMenu();
    // this.clearCanvas();
    // this.draw(this.data.root, this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 - this.rectangleHeight / 2);
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

  private transformData(data: any): any {
    let res = {};
    res['root'] = {
      id: data.MIDAS_NUMBER,
      description: data.MIDAS_SAMPLE_DESCRIPTION,
      children: [],
      branches: [],
      leftBranchesCount: 0,
      rightBranchesCount: 0
    }

    data['GENEALOGY'].forEach((element: any) => {
      let grandParent = null;
      Object.keys(element).forEach((key: string) => {
        if(key.includes('MIDAS_NUMBER')) {
          if(key.includes('GRAND_PARENT')) {
            grandParent = this.createNode(element['GRAND_PARENT_PROCESS_ID'], 'left', element['GRAND_PARENT_MIDAS_NUMBER']);
          } else if(key.includes('PARENT')) {
            res['root'].branches.push( this.createNode(element['PARENT_PROCESS_ID'], 'left', element['PARENT_MIDAS_NUMBER']))
            // res['root']['leftBranchesCount']++;
            if(grandParent !== null) {
              res['root'].branches[res['root'].branches.length - 1].material.branches.push(grandParent);
              res['root'].branches[res['root'].branches.length - 1].material['leftBranchesCount']++;
            }
          } else if(key.includes('CHILD')) {
            res['root'].branches.push(this.createNode(element['CHILD_PROCESS_ID'], 'right', element['CHILD_MIDAS_NUMBER']))
            // res['root']['rightBranchesCount']++;
          }
        }
      })
    })

    return res;
  }

  private createNode(process, direction, id): any {
    return {
      process,
      direction,
      material: {
        id,
        description: '',
        children: [],
        branches: [],
        leftBranchesCount: 0,
        rightBranchesCount: 0
      }
    }
  }

}
