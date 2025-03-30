import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RateComponent } from './rate.component';
import { IonicModule } from '@ionic/angular';

describe('RateComponent', () => {
  let component: RateComponent;
  let fixture: ComponentFixture<RateComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RateComponent, IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RateComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should render 5 ion-icon stars', () => {
    const stars = element.querySelectorAll('ion-icon.rating-star');
    expect(stars.length).toBe(5);
  });

  it('should fill stars according to rating', () => {
    component.rating = 3;
    fixture.detectChanges();

    const stars = element.querySelectorAll('ion-icon.rating-star.filled');
    expect(stars.length).toBe(3);
  });

  it('should toggle rating on click', () => {
    const stars = element.querySelectorAll('ion-icon.rating-star');

    // Click 4th star
    (stars[3] as HTMLElement).click();
    fixture.detectChanges();
    expect(component.rating).toBe(4);

    // Click again to reset
    (stars[3] as HTMLElement).click();
    fixture.detectChanges();
    expect(component.rating).toBe(0);
  });

  it('should render both positive and negative textareas', () => {
    const textareas = element.querySelectorAll('ion-textarea');
    expect(textareas.length).toBe(2);

    const textareaLabels = Array.from(textareas).map(ta =>
      ta.getAttribute('label')
    );

    expect(textareaLabels).toContain('Enter Pros');
    expect(textareaLabels).toContain('Enter Cons');
  });
});
