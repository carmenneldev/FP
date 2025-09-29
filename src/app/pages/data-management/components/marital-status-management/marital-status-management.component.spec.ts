import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaritalStatusManagementComponent } from './marital-status-management.component';

describe('MaritalStatusManagementComponent', () => {
  let component: MaritalStatusManagementComponent;
  let fixture: ComponentFixture<MaritalStatusManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaritalStatusManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaritalStatusManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
