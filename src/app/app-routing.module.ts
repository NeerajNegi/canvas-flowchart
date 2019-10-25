import { CanvasAnimationComponent } from './canvas-animation/canvas-animation.component';
import { FlowchartCanvasComponent } from './flowchart-canvas/flowchart-canvas.component';
import { FlowchartComponent } from './flowchart/flowchart.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'home',
    component: FlowchartComponent
  },
  {
    path: 'canvas',
    component: FlowchartCanvasComponent
  },
  {
    path: 'canvas-animation',
    component: CanvasAnimationComponent
  },
  {
    path: '',
    redirectTo: 'canvas',
    pathMatch: 'full'
  }, 
  {
    path: '**',
    redirectTo: 'canvas',
    pathMatch: 'full'  
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
