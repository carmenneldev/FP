import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyManagementComponent } from './policy-management.component';

describe('PolicyManagementComponent', () => {
  let component: PolicyManagementComponent;
  let fixture: ComponentFixture<PolicyManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
