import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingClientComponent } from './onboarding-client.component';

describe('OnboardingClientComponent', () => {
  let component: OnboardingClientComponent;
  let fixture: ComponentFixture<OnboardingClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardingClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
