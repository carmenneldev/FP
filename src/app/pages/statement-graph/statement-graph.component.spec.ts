import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementGraphComponent } from './statement-graph.component';

describe('StatementGraphComponent', () => {
  let component: StatementGraphComponent;
  let fixture: ComponentFixture<StatementGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatementGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatementGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
