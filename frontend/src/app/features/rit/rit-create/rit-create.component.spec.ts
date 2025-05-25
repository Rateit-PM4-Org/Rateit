import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {ModalController, ToastController} from '@ionic/angular/standalone';
import {of} from 'rxjs/internal/observable/of';
import {throwError} from 'rxjs/internal/observable/throwError';
import {RitService} from '../../../shared/services/rit.service';
import {RitCreateComponent} from './rit-create.component';

describe('RitCreateComponent', () => {
  let component: RitCreateComponent;
  let fixture: ComponentFixture<RitCreateComponent>;
  let modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);
  let ritServiceSpy = jasmine.createSpyObj('RitService', ['createRit', 'updateRit', 'triggerRitsReload', 'getAllTags']);
  ritServiceSpy.createRit.and.returnValue(of({}));
  ritServiceSpy.updateRit.and.returnValue(of({}));
  ritServiceSpy.triggerRitsReload.and.returnValue(of({}));
  ritServiceSpy.getAllTags.and.returnValue(of(['tag1', 'tag2']));
  let activatedRouteSpy = {snapshot: {paramMap: {get: () => null}}};
  let toastControllerSpy = jasmine.createSpyObj('ToastController', ['create']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RitCreateComponent, IonicModule.forRoot(), FormsModule],
      providers: [
        {provide: ModalController, useValue: modalCtrlSpy},
        {provide: RitService, useValue: ritServiceSpy},
        {provide: ActivatedRoute, useValue: activatedRouteSpy},
        {provide: ToastController, useValue: toastControllerSpy}

      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RitCreateComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show the new tag input value', () => {
    component.tags = ['hafermilch'];
    fixture.detectChanges();

    const tagSelector = fixture.debugElement.query(By.css('app-tag-selector'));
    expect(tagSelector).toBeTruthy();

    const tagsContainer = fixture.debugElement.query(By.css('[testId="tags-container"]'));
    expect(tagsContainer).toBeTruthy();
    expect(tagsContainer.nativeElement.textContent).toContain('hafermilch');
  });

  it('should set ritName', () => {
    const event = {target: {value: 'My Rit'}};
    component.setRitName(event);
    expect(component.ritName).toBe('My Rit');
  });

  it('should set details', () => {
    const event = {target: {value: 'Details here'}};
    component.setDetails(event);
    expect(component.details).toBe('Details here');
  });

  it('should set new tag', () => {
    component.onTagsChange(['TestTag']);
    expect(component.tags).toEqual(['TestTag']);
  });

  it('should clear tags', () => {
    component.tags = ['Tag1', 'Tag2', 'Tag3'];
    component.onTagsChange([]);
    expect(component.tags.length).toBe(0);
  });

  it('should call createRit and show success toast on success', async () => {
    const toast = {present: jasmine.createSpy()};
    toastControllerSpy.create.and.returnValue(Promise.resolve(toast as any));

    component.ritName = 'Test Rit';
    component.details = 'Details';
    component.tags = ['tag1'];
    component.codes = ['code1'];

    ritServiceSpy.createRit.and.returnValue(of({}));

    const success = await component.createRit();

    expect(success).toBeTrue();
    expect(ritServiceSpy.createRit).toHaveBeenCalled();
    expect(toastControllerSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({message: 'Rit created successfully!'}));
    expect(toastControllerSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({color: 'success'}));
    expect(toast.present).toHaveBeenCalled();
  });

  it('should call updateRit and show success toast on success', fakeAsync(() => {
    const toast = {present: jasmine.createSpy().and.returnValue(Promise.resolve())};
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
    expect(toastControllerSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({message: 'Rit updated successfully!'}));
    expect(toastControllerSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({color: 'success'}));
    expect(toast.present).toHaveBeenCalled();
  }));

  it('should call createRit and show error toast on unknown error', async () => {
    const toast = {present: jasmine.createSpy()};
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
    expect(toastControllerSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'Unknown error',
      color: 'danger'
    }));
    expect(toast.present).toHaveBeenCalled();
  });

  it('should call createRit and not show error toast on field validation errors', async () => {
    const toast = {present: jasmine.createSpy()};
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
          codes: ['invalid code']
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
  it('should add scanned code to Rit', () => {
    component.codes = ['code1'];
    component.addCodes(['code2', 'code3']);
    expect(component.codes).toEqual(['code1', 'code2', 'code3']);
  });
  it('scanned code should not be duplicated', () => {
    component.codes = ['code1', 'code2'];
    component.addCodes(['code2', 'code3']);
    expect(component.codes).toEqual(['code1', 'code2', 'code3']);
  });

  it('scanned code should be removed', () => {
    component.codes = ['code1', 'code2'];
    component.removeCode('code1');
    expect(component.codes).toEqual(['code2']);
  });

  it('should get scanned codes from the scanner', async () => {
    const modalSpy = jasmine.createSpyObj('IonModal', ['present', 'onDidDismiss']);
    modalSpy.present.and.returnValue(Promise.resolve());
    modalSpy.onDidDismiss.and.returnValue(Promise.resolve({data: {scannedCodes: ['code1']}}));
    const modalViewComponentSpy = {modal: modalSpy};

    // @ts-ignore
    component.ritUpdateModal = modalViewComponentSpy;

    await component.openScanner();
    expect(component.codes).toEqual(['code1']);
  });

});
