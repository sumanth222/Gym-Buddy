import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindTrainerComponent } from './find-trainer.component';

describe('FindTrainerComponent', () => {
  let component: FindTrainerComponent;
  let fixture: ComponentFixture<FindTrainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindTrainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FindTrainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
