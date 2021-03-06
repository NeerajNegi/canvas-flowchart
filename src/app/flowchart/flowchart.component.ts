import { DataLoaderService } from './../services/data-loader.service';
import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-flowchart',
  templateUrl: './flowchart.component.html',
  styleUrls: ['./flowchart.component.scss']
})
export class FlowchartComponent implements OnInit {

  Flowchart: any;
  flowchartElement: any;
  lineWidth: number = 100;
  circleRadius: number = 100;
  DATA: any;

  constructor(private dataLoader: DataLoaderService) { }

  ngOnInit() {
    this.Flowchart = d3.select('#flow-chart')

    this.dataLoader.getJSON().subscribe(res => {
      this.DATA = res;

      //Find total outputs for a rectangle
      this.calculateNumberOfOutputs();
      //Draw Nodes
      this.drawNodes();
    }); 
  }

  private drawNodes(): void {
    this.DATA.connections.forEach((connection: string, index: number) => {
      const [ from, fromPort ] = connection.split(':')[0].split('-');
      const [ to, toPort ] = connection.split(':')[1].split('-');

      //Draw From Node
      if(from[0] === 'R') {
        const rect = this.DATA.rectangles.find(rectangle => rectangle.connectionId === from);
        if(!rect.isDrawn) {
          rect.isDrawn = true;
          if(index === 0) {
            const rectWrapper = this.addRectangle(this.Flowchart, null, from);
            this.appendRectangleData(rect, rectWrapper);
          } 
          // guess is that 'from' will only be created once in the beginning.
          // Afterwards the 'to' node will become 'from' node eventually (Not sure).
        }
      } else if(from[0] === 'C') {
        const circ = this.DATA.circles.find(circle => circle.connectionId === from);
        if(!circ.isDrawn) {
          // create circle if not already there
        }
      }

      //Draw To Node
      if(to[0] === 'R') {
        const inputNode = d3.select(`#${from}`);
        const rect = this.DATA.rectangles.find(rectangle => rectangle.connectionId === to);
        const rectWrapper = this.addRectangle(this.Flowchart, inputNode, to);
        this.appendRectangleData(rect, rectWrapper);
      } else if(to[0] === 'C') {
        const inputNode = d3.select(`#${from}`);
        const rect = this.DATA.rectangles.find(rectangle => rectangle.connectionId === from);
        const circ = this.DATA.circles.find(circle => circle.connectionId === to);
        if(!circ.isDrawn) {
          circ.isDrawn = true;
          this.addCircle(this.Flowchart, inputNode, to, +fromPort, rect.outputs);
        }
      }

      this.addLine(this.Flowchart, d3.select(`#${from}`), d3.select(`#${to}`));
    });
  }

  private appendRectangleData(rect, node): void {
    const header = node.append('h2').text(() => rect.id);
    const midasNumber = node.append('h4').text(() => rect.midas);
    const description = node.append('p').text(() => rect.description);
    node.on('click', () => {
      const nodeDomRect = node.node().getBoundingClientRect();
      if(d3.select(`#${rect.id}`).empty()) {
        const top = nodeDomRect.top - 20;
        const left = this.Flowchart.node().scrollLeft + nodeDomRect.left + nodeDomRect.width - 20;
        let childrenList = this.Flowchart
          .append('div')
          .attr('class','children-list')
          .attr('id', rect.id)
          .style('top', top + 'px')
          .style('left', left + 'px');
        
        childrenList
          .selectAll('p')
          .data(rect.children)
          .enter()
          .append('p')
          .text((d) => d)

        childrenList
          .append('button')
          .attr('class', 'btn cancel')
          .text(() => 'Cancel')
          .on('click', () => {
            d3.select(`#${rect.id}`).remove();
          })
      }
    });
  }

  private calculateNumberOfOutputs(): void {
    this.DATA.connections.forEach( (connection: string) => {
      const recId = connection.substr(0, 2);
      const rect = this.DATA.rectangles.find( rectangle => rectangle.connectionId === recId);
      if(typeof rect !== 'undefined') {
        rect.outputs += 1
      }
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

  private addLine(parent, from, to): any {
    const toDomRect = to.node().getBoundingClientRect();
    const fromDomRect = from.node().getBoundingClientRect();
    const width = toDomRect.left - (fromDomRect.left + fromDomRect.width);
    return parent
      .append('div')
      .attr('class', 'line')
      .style('width', width + 'px')
      .style('top', toDomRect.top + toDomRect.height / 2 + 'px')
      .style('left', fromDomRect.left + fromDomRect.width + 'px');
  }

  private addCircle(parent, neighbour, id='', fromPort, totalPorts): any {
      const circleRadius = this.circleRadius / totalPorts;
      const domRect = neighbour.node().getBoundingClientRect();
      // const top = domRect.top + domRect.height / 4;
      const top = domRect.top + (fromPort * 2 - 1)*(domRect.height / (totalPorts * 2)) - circleRadius / 2;
      const left = domRect.left + domRect.width + this.lineWidth;
      return parent
        .append('div')
        .attr('class', 'circle')
        .attr('id',id)
        .attr('type','circle')
        .style('width', this.circleRadius + 'px')
        .style('height', this.circleRadius + 'px')
        .style('top', top + 'px')
        .style('left', left + 'px')
  }

}