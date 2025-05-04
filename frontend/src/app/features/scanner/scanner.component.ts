import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, Input, Output, EventEmitter} from '@angular/core';
import Quagga from 'quagga';
import {CommonModule} from '@angular/common';


@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ScannerComponent implements OnDestroy, AfterViewInit {
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLDivElement>;
  @Input() MAX_HISTORY = 10;
  @Input() CONFIRM_THRESHOLD = 7;
  @Output() scannedCodeEmitter = new EventEmitter();

  scannedCodes = new Set<string>();
  recentCodes: string[] = [];

  ngAfterViewInit(): void {
    this.initQuagga();
  }

  ngOnDestroy(): void {
    Quagga.stop();
  }

  private initQuagga(): void {
    Quagga.init({
      inputStream: {
        name: 'Live',
        type: 'LiveStream',
        target: this.videoElement.nativeElement,
        constraints: {
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      },
      locator: {
        halfSample: true,
        patchSize: 'medium',
        debug: {
          showCanvas: false,
          showPatches: false,
          showFoundPatches: false,
          showSkeleton: false,
          showLabels: false,
          showPatchLabels: false,
          showRemainingPatchLabels: false,
          boxFromPatches: {
            showTransformed: false,
            showTransformedBox: false,
            showBB: false
          }
        }
      },
      numOfWorkers: 0,
      frequency: 10,
      decoder: {
        readers: ['ean_reader']
      },
      locate: true,
      debug: {
        drawBoundingBox: true,
        showFrequency: true,
        drawScanline: true,
        showPattern: true
      }
    }, (err: Error | null) => {
      if (err) {
        console.error('Quagga init error:', err);
        return;
      }
      Quagga.start();
    });

    Quagga.onDetected(this.onDetected.bind(this));
  }

  private onDetected(data: any): void {
    const code = data?.codeResult?.code;
    if (!code) return;

    this.recentCodes.push(code);
    if (this.recentCodes.length > this.MAX_HISTORY) {
      this.recentCodes.shift();
    }

    const occurrences = this.recentCodes.filter(c => c === code).length;

    if (occurrences >= this.CONFIRM_THRESHOLD && !this.scannedCodes.has(code)) {
      this.scannedCodes.add(code);
      this.recentCodes = [];
      this.scannedCodeEmitter.emit(this.scannedCodes);
    }
  }
}
