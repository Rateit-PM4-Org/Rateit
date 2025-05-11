import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonModal } from '@ionic/angular/standalone';
import {ScannerUpdateModalComponent} from './scanner-update-modal.component';

describe('ScannerSearchModalComponent', () => {
  let component: ScannerUpdateModalComponent;
  let fixture: ComponentFixture<ScannerUpdateModalComponent>;
  let modalSpy: jasmine.SpyObj<IonModal> = jasmine.createSpyObj('IonModal', ['dismiss']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ScannerUpdateModalComponent],
      providers: [
        {
          provide: IonModal,
          useValue: modalSpy
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ScannerUpdateModalComponent);
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

  it('should dismiss modal with scanned codes', () => {
    const scannedCodes = new Set(['code1', 'code2']);
    component.registerModal(modalSpy);
    component.onScanned(scannedCodes);
    expect(modalSpy.dismiss).toHaveBeenCalledWith({ scannedCodes: Array.from(scannedCodes) });
  });
});
