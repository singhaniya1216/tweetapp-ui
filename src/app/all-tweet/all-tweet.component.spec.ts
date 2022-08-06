import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTweetComponent } from './all-tweet.component';

describe('AllTweetComponent', () => {
  let component: AllTweetComponent;
  let fixture: ComponentFixture<AllTweetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllTweetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllTweetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
