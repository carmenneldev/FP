import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleMonthGraphComponent } from './single-month-graph.component';

describe('SingleMonthGraphComponent', () => {
  let component: SingleMonthGraphComponent;
  let fixture: ComponentFixture<SingleMonthGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleMonthGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleMonthGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
