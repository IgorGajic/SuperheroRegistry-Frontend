import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManagePowersComponent } from './manage-powers.component';

describe('ManagePowersComponent', () => {
  let component: ManagePowersComponent;
  let fixture: ComponentFixture<ManagePowersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ManagePowersComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePowersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
