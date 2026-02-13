import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambaShared } from './camba-shared';

describe('CambaShared', () => {
  let component: CambaShared;
  let fixture: ComponentFixture<CambaShared>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CambaShared]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambaShared);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
