import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LangingPageComponent } from './langing-page.component';

describe('LangingPageComponent', () => {
  let component: LangingPageComponent;
  let fixture: ComponentFixture<LangingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LangingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LangingPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
