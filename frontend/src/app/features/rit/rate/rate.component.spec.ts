import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule} from '@ionic/angular';
import { RateComponent } from './rate.component';
import { provideHttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { RitService } from '../../../shared/services/rit.service';
import { ToastController } from '@ionic/angular/standalone';

describe('RateComponent', () => {
  let component: RateComponent;
  let fixture: ComponentFixture<RateComponent>;
  let element: HTMLElement;
  let ritServiceSpy = jasmine.createSpyObj('RitService', ['createRating', 'updateRit', 'triggerRitsReload']);
  ritServiceSpy.createRating.and.returnValue(of({}));
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

  it('should call createRating and show success toast on success', async () => {
    const toast = { present: jasmine.createSpy() };
    toastControllerSpy.create.and.returnValue(Promise.resolve(toast as any));

    component.rating = 5;
    component.positiveComment = 'Great!';
    component.negativeComment = 'Needs improvement';

    ritServiceSpy.createRating.and.returnValue(of({}));

    const success = await component.submit();
    

    expect(success).toBeTrue();
    expect(ritServiceSpy.createRating).toHaveBeenCalled();
    expect(toastControllerSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({ message: 'Rating created successfully!' }));
    expect(toastControllerSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({ color: 'success' }));
    expect(toast.present).toHaveBeenCalled();
  });

  it('should call createRating and show error toast on error', async () => {
    const toast = { present: jasmine.createSpy() };
    toastControllerSpy.create.and.returnValue(Promise.resolve(toast as any));

    component.rating = 5;
    component.positiveComment = 'Great!';
    component.negativeComment = 'Needs improvement';

    const mockErrorResponse = {
      error: {
        error: 'Unknown error'
      }
    };
    ritServiceSpy.createRating.and.returnValue(throwError(() => mockErrorResponse));

    const success = await component.submit();

    expect(success).toBeFalse();
    expect(ritServiceSpy.createRating).toHaveBeenCalled();
    expect(toastControllerSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({ message: 'Unknown error' }));
    expect(toastControllerSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({ color: 'danger' }));
    expect(toast.present).toHaveBeenCalled();
  }
  );

  it('should reset form after successful submission', async () => {
    const toast = { present: jasmine.createSpy() };
    toastControllerSpy.create.and.returnValue(Promise.resolve(toast as any));

    component.rating = 5;
    component.positiveComment = 'Great!';
    component.negativeComment = 'Needs improvement';

    ritServiceSpy.createRating.and.returnValue(of({}));

    await component.submit();

    expect(component.rating).toBe(0);
    expect(component.positiveComment).toBe('');
    expect(component.negativeComment).toBe('');
  }
  );

});
