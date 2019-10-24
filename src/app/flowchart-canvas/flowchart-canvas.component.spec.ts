import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowchartCanvasComponent } from './flowchart-canvas.component';

describe('FlowchartCanvasComponent', () => {
  let component: FlowchartCanvasComponent;
  let fixture: ComponentFixture<FlowchartCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowchartCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowchartCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
