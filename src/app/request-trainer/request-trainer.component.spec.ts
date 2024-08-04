import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTrainerComponent } from './request-trainer.component';

describe('RequestTrainerComponent', () => {
  let component: RequestTrainerComponent;
  let fixture: ComponentFixture<RequestTrainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestTrainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequestTrainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
