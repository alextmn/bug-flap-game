import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlowButtonComponent } from './glow-button.component';

describe('GlowButtonComponent', () => {
  let component: GlowButtonComponent;
  let fixture: ComponentFixture<GlowButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlowButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GlowButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
