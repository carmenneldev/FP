import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssertsLiabilitiesComponent } from './asserts-liabilities.component';

describe('AssertsLiabilitiesComponent', () => {
  let component: AssertsLiabilitiesComponent;
  let fixture: ComponentFixture<AssertsLiabilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssertsLiabilitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssertsLiabilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
