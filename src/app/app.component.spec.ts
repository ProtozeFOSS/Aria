import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Olga } from './app.component';

describe('Olga', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        Olga
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(Olga);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  // it(`should have as title 'Olga'`, () => {
  //   const fixture = TestBed.createComponent(Olga);
  //   const app = fixture.componentInstance;
  //   expect(app.title).toEqual('Olga');
  // });

  it('should render title', () => {
    const fixture = TestBed.createComponent(Olga);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('Olga2 app is running!');
  });
});
