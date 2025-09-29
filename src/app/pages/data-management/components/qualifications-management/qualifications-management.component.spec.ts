import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualificationsManagementComponent } from './qualifications-management.component';

describe('QualificationsManagementComponent', () => {
  let component: QualificationsManagementComponent;
  let fixture: ComponentFixture<QualificationsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QualificationsManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QualificationsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
