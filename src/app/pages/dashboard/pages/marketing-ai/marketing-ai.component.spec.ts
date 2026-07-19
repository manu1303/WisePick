import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingAiComponent } from './marketing-ai.component';

describe('MarketingAi', () => {
  let component: MarketingAiComponent;
  let fixture: ComponentFixture<MarketingAiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketingAiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketingAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
