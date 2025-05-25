import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {ScannerSearchModalComponent} from './scanner-search-modal.component';
import {Router} from '@angular/router';
import {IonModal} from '@ionic/angular/standalone';

describe('ScannerSearchModalComponent', () => {
  let component: ScannerSearchModalComponent;
  let fixture: ComponentFixture<ScannerSearchModalComponent>;
  let routerSpy: jasmine.SpyObj<Router> = jasmine.createSpyObj('Router', ['navigate']);
  let modalSpy: jasmine.SpyObj<IonModal> = jasmine.createSpyObj('IonModal', ['dismiss']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ScannerSearchModalComponent],
      providers: [
        {
          provide: Router,
          useValue: routerSpy
        },
        {
          provide: IonModal,
          useValue: modalSpy
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ScannerSearchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call start on scanner component when modal is presented', () => {
    const startSpy = spyOn(component.scannerComponent, 'start');
    component.onPresent();
    expect(startSpy).toHaveBeenCalled();
  });

  it('should call stop on scanner component when modal is dismissed', () => {
    const stopSpy = spyOn(component.scannerComponent, 'stop');
    component.onDismiss();
    expect(stopSpy).toHaveBeenCalled();
  });

  it('should redirect to /tabs/rits with scanned code and dismiss modal', () => {
    const scannedCodes = new Set(['code1', 'code2']);
    component.registerModal(modalSpy);
    component.onScanned(scannedCodes);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tabs/rits'], {
      queryParams: {barcode: Array.from(scannedCodes)[0]}
    });
    expect(modalSpy.dismiss).toHaveBeenCalled();
  });
});
