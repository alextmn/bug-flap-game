import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandLandmarkerComponent } from './hand-landmarker.component';

describe('HandLandmarkerComponent', () => {
  let component: HandLandmarkerComponent;
  let fixture: ComponentFixture<HandLandmarkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HandLandmarkerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HandLandmarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
