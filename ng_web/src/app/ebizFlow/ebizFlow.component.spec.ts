import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbizFlowComponent } from './ebizFlow.component';

describe('EbizFlowComponent', () => {
  let component: EbizFlowComponent;
  let fixture: ComponentFixture<EbizFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EbizFlowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EbizFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
