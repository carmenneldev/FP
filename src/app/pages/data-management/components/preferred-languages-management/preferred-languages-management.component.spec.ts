import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferredLanguagesManagementComponent } from './preferred-languages-management.component';

describe('PreferredLanguagesManagementComponent', () => {
  let component: PreferredLanguagesManagementComponent;
  let fixture: ComponentFixture<PreferredLanguagesManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreferredLanguagesManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreferredLanguagesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
