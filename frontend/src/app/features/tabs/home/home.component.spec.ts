import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { of, throwError } from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';
import { ActionSheetController } from '@ionic/angular';
import { RitCreateComponent } from '../../rit/rit-create/rit-create.component';
import { IonicModule, IonModal } from '@ionic/angular';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let actionSheetCtrlSpy: jasmine.SpyObj<ActionSheetController>;

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['getData']);
    const actionSheetSpy = jasmine.createSpyObj('ActionSheetController', ['create']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent, IonicModule],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        { provide: ActionSheetController, useValue: actionSheetSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    actionSheetCtrlSpy = TestBed.inject(ActionSheetController) as jasmine.SpyObj<ActionSheetController>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data from API on init', () => {
    const mockData = [{ id: 1, name: 'Test' }];
    apiServiceSpy.getData.and.returnValue(of(mockData));

    component.ngOnInit();

    expect(apiServiceSpy.getData).toHaveBeenCalled();
    expect(component.data).toEqual(mockData);
    expect(component.errorMessage).toBe('');
  });

  it('should set errorMessage on API error', () => {
    apiServiceSpy.getData.and.returnValue(throwError(() => new Error('API failure')));

    component.ngOnInit();

    expect(apiServiceSpy.getData).toHaveBeenCalled();
    expect(component.data).toEqual([]);
    expect(component.errorMessage).toContain('Failed');
  });

  it('should handle confirm and dismiss modal with data', () => {
    const mockModal = jasmine.createSpyObj('IonModal', ['dismiss']);
    component.modal = mockModal;
    component.ritCreateComponent = {
      ritName: 'MyName',
      details: 'MyDetails',
      tags: ['one'],
      selectedImage: 'data:image/test',
    } as RitCreateComponent;

    component.confirm();

    expect(mockModal.dismiss).toHaveBeenCalledWith({
      name: 'MyName',
      details: 'MyDetails',
      tags: ['one'],
      image: 'data:image/test',
    }, 'confirm');
  });

  it('should handle modal dismiss event with confirm role', () => {
    const logSpy = spyOn(console, 'log');
    const event = {
      detail: {
        role: 'confirm',
        data: {
          name: 'Test',
          details: 'Some details',
          tags: ['Tag1'],
          image: 'data:image'
        }
      }
    } as CustomEvent;

    component.handleModalDismiss(event);

    expect(logSpy).toHaveBeenCalledWith('To be created');
    expect(logSpy).toHaveBeenCalledWith('Name: ', 'Test');
    expect(logSpy).toHaveBeenCalledWith('Details: ', 'Some details');
    expect(logSpy).toHaveBeenCalledWith('Tags: ', ['Tag1']);
    expect(logSpy).toHaveBeenCalledWith('Image: ', 'data:image');
  });

});
