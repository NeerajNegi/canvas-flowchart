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
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }, 
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'  
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
