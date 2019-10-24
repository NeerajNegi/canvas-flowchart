import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlowchartComponent } from './flowchart/flowchart.component';
import { HttpClientModule } from '@angular/common/http';
import { FlowchartCanvasComponent } from './flowchart-canvas/flowchart-canvas.component';

@NgModule({
  declarations: [
    AppComponent,
    FlowchartComponent,
    FlowchartCanvasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
