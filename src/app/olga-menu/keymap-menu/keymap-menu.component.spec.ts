import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsKeymapComponent } from './settings-keymap.component';

describe('SettingsKeymapComponent', () => {
  let component: SettingsKeymapComponent;
  let fixture: ComponentFixture<SettingsKeymapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsKeymapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsKeymapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
