import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyHeroesComponent } from './my-heroes-component';

describe('MyHeroesComponent', () => {
  let component: MyHeroesComponent;
  let fixture: ComponentFixture<MyHeroesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyHeroesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyHeroesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
