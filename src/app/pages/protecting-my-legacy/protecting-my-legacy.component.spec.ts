import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtectingMyLegacyComponent } from './protecting-my-legacy.component';

describe('ProtectingMyLegacyComponent', () => {
  let component: ProtectingMyLegacyComponent;
  let fixture: ComponentFixture<ProtectingMyLegacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProtectingMyLegacyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProtectingMyLegacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
