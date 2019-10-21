import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { descending, thresholdFreedmanDiaconis } from 'd3';

@Component({
  selector: 'app-flowchart',
  templateUrl: './flowchart.component.html',
  styleUrls: ['./flowchart.component.scss']
})
export class FlowchartComponent implements OnInit {

  Flowchart: any;
  lineWidth: number = 100;

  DATA: any = {
    rectangles: [
      {
        id: '18-676404',
        connectionId: 'R1',
        midas: 'Midas #',
        outputs: 0,
        isDrawn: false,
        description: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit, 
        sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. 
        Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis 
        nisl ut aliquip ex ea commodo consequat.`
      },
      {
        id: '18-676404',
        connectionId: 'R2',
        midas: 'Midas #',
        outputs: 0,
        isDrawn: false,
        description: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit, 
        sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. 
        Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis 
        nisl ut aliquip ex ea commodo consequat.`
      }
    ],
    circles: [
      {
        id: '1',
        connectionId: 'C1',
        isDrawn: false,
        description: 'Reaction info'
      },
      {
        id: '2',
        connectionId: 'C2',
        isDrawn: false,
        description: 'Reaction info'
      }
    ],
    connections: [
      'R1-1:C1-1',
      'C1-1:R2-1',
      'R2-1:C2-1'
    ]
  };

  constructor() { }

  ngOnInit() {
    this.Flowchart = d3.select('#flow-chart').append('div');

    //Find total outputs for a rectangle
    this.DATA.connections.forEach( (connection: string) => {
      const recId = connection.substr(0, 2);
      const rect = this.DATA.rectangles.find( rectangle => rectangle.connectionId === recId);
      if(typeof rect !== 'undefined') {
        rect.outputs += 1
      }
    });

    //Draw Nodes
    this.DATA.connections.forEach((connection: string, index: number) => {
      const [ from, fromPort ] = connection.split(':')[0].split('-');
      const [ to, toPort ] = connection.split(':')[1].split('-');

      if(from[0] === 'R') {
        const rect = this.DATA.rectangles.find(rectangle => rectangle.connectionId === from);
        if(!rect.isDrawn) {
          rect.isDrawn = true;
          if(index === 0) {
            this.addRectangle(this.Flowchart, null, from);
          } 
          // guess is that from will only be created once in the beginning.
          // Afterwards the to node will become from node eventually (Not sure).
        }
      } else if(from[0] === 'C') {
        const circ = this.DATA.circles.find(circle => circle.connectionId === from);
        if(!circ.isDrawn) {
          // create circle if not already there
        }
      }

      if(to[0] === 'R') {
        const inputNode = d3.select(`#${from}`);
        this.addRectangle(this.Flowchart, inputNode, to);

      } else if(to[0] === 'C') {
        const inputNode = d3.select(`#${from}`);
        const circ = this.DATA.circles.find(circle => circle.connectionId === to);
        if(!circ.isDrawn) {
          circ.isDrawn = true;
          this.addCircle(this.Flowchart, inputNode, to);
        }
      }

      this.addLine(this.Flowchart, d3.select(`#${from}`), d3.select(`#${to}`));
    });
  }

  private addRectangle(parent, neighbour, id=''): any {
    let top = 100, left = 10;
    if(neighbour) {
      const domRect = neighbour.node().getBoundingClientRect();
      top = domRect.top + domRect.height / 2 - 100;
      left = domRect.left + domRect.width + this.lineWidth;
    }
    return parent
      .append('div')
      .attr('class', 'rectangle')
      .attr('id',id)
      .attr('type','rectangle')
      .style('top', top + 'px')
      .style('left', left + 'px')
  }

  private addLine(parent, from, to) {
    const toDomRect = to.node().getBoundingClientRect();
    const fromDomRect = from.node().getBoundingClientRect();
    return parent
      .append('div')
      .attr('class', 'line')
      .style('top', toDomRect.top + toDomRect.height / 2 + 'px')
      .style('left', fromDomRect.left + fromDomRect.width + 'px');
  }

  private addCircle(parent, neighbour, id=''): any {
      const domRect = neighbour.node().getBoundingClientRect();
      const top = domRect.top + domRect.height / 4;
      const left = domRect.left + domRect.width + this.lineWidth;
      return parent
        .append('div')
        .attr('class', 'circle')
        .attr('id',id)
        .attr('type','circle')
        .style('top', top + 'px')
        .style('left', left + 'px')
  }

}