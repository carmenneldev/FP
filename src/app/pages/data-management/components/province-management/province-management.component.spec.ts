import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvinceManagementComponent } from './province-management.component';

describe('ProvinceManagementComponent', () => {
  let component: ProvinceManagementComponent;
  let fixture: ComponentFixture<ProvinceManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProvinceManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvinceManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
