import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ScannerComponent } from './scanner.component';

describe('ScannertestComponent', () => {
  let component: ScannerComponent;
  let fixture: ComponentFixture<ScannerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ScannerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return barcode on default settings', () => {
    const testCode = 'testcode';
    let emittedSet: Set<string> | null = null;

    component.scannedCodeEmitter.subscribe((result: Set<string>) => {
      emittedSet = result;
    });

    for (let i = 0; i < component.CONFIRM_THRESHOLD; i++) {
      component.onDetected({
        codeResult: { code: testCode }
      });
    }

    expect(emittedSet!.has(testCode)).toBeTrue();
  });

  it('should return barcode on changed settings', () => {
    const testCode = 'testcode';
    let emittedSet: Set<string> | null = null;
    component.CONFIRM_THRESHOLD = 2;

    component.scannedCodeEmitter.subscribe((result: Set<string>) => {
      emittedSet = result;
    });

    for (let i = 0; i < component.CONFIRM_THRESHOLD; i++) {
      component.onDetected({
        codeResult: { code: testCode }
      });
    }

    expect(emittedSet!.has(testCode)).toBeTrue();
  });

  it('should return multiple different barcodes', () => {
    const testCode = 'testcode';
    const testCode2 = 'testcode2';
    let emittedSet: Set<string> | null = null;
    let emitCount = 0;

    component.scannedCodeEmitter.subscribe((result: Set<string>) => {
      emitCount++;
      emittedSet = result;
    });

    for (let i = 0; i < component.CONFIRM_THRESHOLD; i++) {
      component.onDetected({
        codeResult: { code: testCode }
      });
    }
    for (let i = 0; i < component.CONFIRM_THRESHOLD; i++) {
      component.onDetected({
        codeResult: { code: testCode2 }
      });
    }

    expect(emitCount).toBe(2);
    expect(emittedSet).toBeTruthy();
    expect(emittedSet!.size).toBe(2);
    expect(emittedSet!.has(testCode)).toBeTrue();
    expect(emittedSet!.has(testCode2)).toBeTrue();
  });

  it('should not return barcode', () => {
    const testCode = 'testcode';
    const testCode2 = 'testcode2';
    let emittedSet: Set<string> | null = null;

    component.scannedCodeEmitter.subscribe((result: Set<string>) => {
      emittedSet = result;
    });

    for (let i = 0; i < component.CONFIRM_THRESHOLD-1; i++) {
      component.onDetected({
        codeResult: { code: testCode }
      });
    }
    for (let i = 0; i < component.CONFIRM_THRESHOLD-1; i++) {
      component.onDetected({
        codeResult: { code: testCode2 }
      });
    }

    expect(emittedSet).toBeNull();
  });

  it('should return barcode only once', () => {
    const testCode = 'testcode';
    let emittedSet: Set<string> | null = null;
    let emitCount = 0;

    component.scannedCodeEmitter.subscribe((result: Set<string>) => {
      emitCount++;
      emittedSet = result;
    });

    for (let i = 0; i < component.CONFIRM_THRESHOLD*2; i++) {
      component.onDetected({
        codeResult: { code: testCode }
      });
    }

    expect(emitCount).toBe(1);
    expect(emittedSet).toBeTruthy();
    expect(emittedSet!.size).toBe(1);
    expect(emittedSet!.has(testCode)).toBeTrue();
  })
});
