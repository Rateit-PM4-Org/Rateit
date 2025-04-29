import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ModalController, ToastController } from '@ionic/angular/standalone';
import { of } from 'rxjs/internal/observable/of';
import { throwError } from 'rxjs/internal/observable/throwError';
import { RitService } from '../../../shared/services/rit.service';
import { RitCreateComponent } from './rit-create.component';

describe('RitCreateComponent', () => {
  let component: RitCreateComponent;
  let fixture: ComponentFixture<RitCreateComponent>;
  let modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);
  let ritServiceSpy = jasmine.createSpyObj('RitService', ['createRit', 'updateRit', 'triggerRitsReload']);
  ritServiceSpy.createRit.and.returnValue(of({}));
  ritServiceSpy.updateRit.and.returnValue(of({}));
  ritServiceSpy.triggerRitsReload.and.returnValue(of({}));
  let activatedRouteSpy = { snapshot: { paramMap: { get: () => null } } };
  let toastControllerSpy = jasmine.createSpyObj('ToastController', ['create']);


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RitCreateComponent, IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: ModalController, useValue: modalCtrlSpy },
        { provide: RitService, useValue: ritServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: ToastController, useValue: toastControllerSpy }

      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RitCreateComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display all tag chips', () => {
    component.tags = ['red', 'blue', 'green'];
    fixture.detectChanges();

    component.tags.forEach((tag, i) => {
      const chip = fixture.debugElement.query(By.css(`[data-testid="tag-chip-${i}"]`));
      expect(chip.nativeElement.textContent).toContain(tag);
    });
  });

  it('should show the new tag input value', () => {
    component.newTag = 'hafermilch';
    fixture.detectChanges();

    const newTagInput = fixture.debugElement.query(By.css('[data-testid="new-tag-input"]'));
    expect(newTagInput.attributes['ng-reflect-value']).toContain('hafermilch');
  });

  it('should set ritName', () => {
    const event = { target: { value: 'My Rit' } };
    component.setRitName(event);
    expect(component.ritName).toBe('My Rit');
  });

  it('should set details', () => {
    const event = { target: { value: 'Details here' } };
    component.setDetails(event);
    expect(component.details).toBe('Details here');
  });

  it('should set new tag', () => {
    const event = { target: { value: 'TestTag' } };
    component.setNewTag(event);
    expect(component.newTag).toBe('TestTag');
  });

  it('should add new tag with fake input element', () => {
    component.newTag = 'NewTag';

    const fakeInput = {
      setFocus: jasmine.createSpy('setFocus')
    } as any;

    component.addTag(fakeInput, 'blur');

    expect(component.tags.includes('NewTag')).toBeTrue();
  });


  it('should not add empty tag', () => {
    component.newTag = '   ';

    const fakeInput = {
      setFocus: jasmine.createSpy('setFocus')
    } as any;

    component.addTag(fakeInput, 'blur');
    expect(component.tags.includes('')).toBeFalse();
  });

  it('should not add existing tag', () => {
    component.tags = ['existingTag'];
    component.newTag = 'existingTag';

    const fakeInput = {
      setFocus: jasmine.createSpy('setFocus')
    } as any;

    component.addTag(fakeInput, 'blur');
    expect(component.tags.includes('')).toBeFalse();
  });

  it('should remove tag', () => {
    component.tags = ['Tag1', 'Tag2', 'Tag3'];
    const initialLength = component.tags.length;
    component.removeTag(0);
    expect(component.tags.length).toBe(initialLength - 1);
  });

  it('should call createRit and show success toast on success', async () => {
    const toast = { present: jasmine.createSpy() };
    toastControllerSpy.create.and.returnValue(Promise.resolve(toast as any));

    component.ritName = 'Test Rit';
    component.details = 'Details';
    component.tags = ['tag1'];
    component.codes = ['code1'];

    ritServiceSpy.createRit.and.returnValue(of({}));

    const success = await component.createRit();

    expect(success).toBeTrue();
    expect(ritServiceSpy.createRit).toHaveBeenCalled();
    expect(toastControllerSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({ message: 'Rit created successfully!' }));
    expect(toastControllerSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({ color: 'success' }));
    expect(toast.present).toHaveBeenCalled();
  });

  it('should call updateRit and show success toast on success', fakeAsync(() => {
    const toast = { present: jasmine.createSpy().and.returnValue(Promise.resolve()) };
    toastControllerSpy.create.and.returnValue(Promise.resolve(toast as any));

    component.ritId = '123';
    component.ritName = 'Test Rit';
    component.details = 'Details';
    component.tags = ['tag1'];
    component.codes = ['code1'];

    ritServiceSpy.updateRit.and.returnValue(of({
      name: 'Test Rit',
      details: 'Details',
      tags: ['tag1'],
      codes: ['code1']
    }));

    component.updateRit();
    tick();

    expect(ritServiceSpy.updateRit).toHaveBeenCalled();
    expect(toastControllerSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({ message: 'Rit updated successfully!' }));
    expect(toastControllerSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({ color: 'success' }));
    expect(toast.present).toHaveBeenCalled();
  }));

  it('should call createRit and show error toast on unknown error', async () => {
    const toast = { present: jasmine.createSpy() };
    toastControllerSpy.create.and.returnValue(Promise.resolve(toast as any));

    component.ritName = 'Test Rit';
    component.details = 'Details';
    component.tags = ['tag1'];
    component.codes = ['code1'];

    const mockErrorResponse = {
      error: {
        error: 'Unknown error'
      }
    };

    ritServiceSpy.createRit.and.returnValue(throwError(() => mockErrorResponse));

    const success = await component.createRit();

    expect(success).toBeFalse();
    expect(toastControllerSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({ message: 'Unknown error', color: 'danger' }));
    expect(toast.present).toHaveBeenCalled();
  });

  it('should call createRit and not show error toast on field validation errors', async () => {
    const toast = { present: jasmine.createSpy() };
    toastControllerSpy.create.and.returnValue(Promise.resolve(toast as any));

    component.ritName = '';
    component.details = 'Details';
    component.tags = ['tag1'];
    component.codes = ['code1'];

    const mockValidationError = {
      error: {
        error: 'Validation failed',
        fields: {
          name: ['must not be empty'],
          details: ['too short'],
          tags: ['invalid tag'],
          code: ['invalid code']
        }
      }
    };

    ritServiceSpy.createRit.and.returnValue(throwError(() => mockValidationError));

    const success = await component.createRit();

    expect(success).toBeFalse();
    expect(toast.present).not.toHaveBeenCalled();
    expect(component.ritNameErrorMessage).toEqual('must not be empty');
    expect(component.detailsErrorMessage).toEqual('too short');
    expect(component.tagsErrorMessage).toEqual('invalid tag');
    expect(component.codesErrorMessage).toEqual('invalid code');
  });

  it('should load rit data in ionViewWillEnter if ritId is present', () => {
    const mockRit = {
      id: 'test-id',
      name: 'Loaded Rit',
      details: 'Some loaded details',
      tags: ['tag1', 'tag2'],
      codes: ['code1']
    };

    const route = TestBed.inject(ActivatedRoute);
    spyOn(route.snapshot.paramMap, 'get').and.returnValue('test-id');

    ritServiceSpy.getRit = jasmine.createSpy().and.returnValue(of(mockRit));

    component.ionViewWillEnter();

    expect(component.ritId).toBe('test-id');
    expect(component.mode).toBe('view');
    expect(ritServiceSpy.getRit).toHaveBeenCalledWith('test-id');
    expect(component.ritName).toBe(mockRit.name);
    expect(component.details).toBe(mockRit.details);
    expect(component.tags).toEqual(mockRit.tags);
    expect(component.codes).toEqual(mockRit.codes);
  });

});
