import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyTypeManagementComponent } from './policy-type-management.component';

describe('PolicyTypeManagementComponent', () => {
  let component: PolicyTypeManagementComponent;
  let fixture: ComponentFixture<PolicyTypeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyTypeManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyTypeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
