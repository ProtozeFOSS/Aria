import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeymapItemComponent } from './keymap-item.component';

describe('KeymapItemComponent', () => {
  let component: KeymapItemComponent;
  let fixture: ComponentFixture<KeymapItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeymapItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeymapItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
