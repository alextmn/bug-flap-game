import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BugGameComponent } from './bug-game.component';

describe('BugGameComponent', () => {
  let component: BugGameComponent;
  let fixture: ComponentFixture<BugGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BugGameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BugGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
