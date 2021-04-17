import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateModifyHotspotComponent } from './create-modify-hotspot.component';

describe('CreateModifyHotspotComponent', () => {
  let component: CreateModifyHotspotComponent;
  let fixture: ComponentFixture<CreateModifyHotspotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateModifyHotspotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateModifyHotspotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
