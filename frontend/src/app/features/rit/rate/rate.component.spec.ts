import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ToastController } from '@ionic/angular';
import { RateComponent } from './rate.component';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { RitService } from '../../../shared/services/rit.service';
import { ActivatedRoute } from '@angular/router';

describe('RateComponent', () => {
  let component: RateComponent;
  let fixture: ComponentFixture<RateComponent>;
  let element: HTMLElement;
  let ritServiceSpy = jasmine.createSpyObj('RitService', ['createRit', 'updateRit', 'triggerRitsReload']);
  ritServiceSpy.createRit.and.returnValue(of({}));
  ritServiceSpy.updateRit.and.returnValue(of({}));
  ritServiceSpy.triggerRitsReload.and.returnValue(of({}));
  let toastControllerSpy = jasmine.createSpyObj('ToastController', ['create']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RateComponent, IonicModule.forRoot()],
      providers: [
        provideHttpClient(),
        { provide: RitService, useValue: ritServiceSpy },
        { provide: ToastController, useValue: toastControllerSpy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RateComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
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
