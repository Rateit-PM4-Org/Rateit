import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RitCreateComponent } from './rit-create.component';

describe('RitCreateComponent Tests', () => {
  let component: RitCreateComponent;
  let fixture: ComponentFixture<RitCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RitCreateComponent, IonicModule.forRoot(), FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(RitCreateComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render ritName in ion-input', () => {
    component.ritName = 'Sample Rit';
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('ion-input[placeholder="Rit Name..."]'));
    expect(input).toBeTruthy();
    expect(input.nativeElement.value || input.attributes['ng-reflect-value']).toContain('Sample Rit');
  });

  it('should show the selected image if selectedImage is defined', () => {
    component.selectedImage = 'http://example.com/image.png';
    fixture.detectChanges();

    const img = fixture.debugElement.query(By.css('ion-img'));
    expect(img).toBeTruthy();
    expect(img.attributes['ng-reflect-src']).toBe('http://example.com/image.png');
  });

  it('should show "Select a picture" if no image is selected', () => {
    component.selectedImage = null;
    fixture.detectChanges();

    const placeholder = fixture.debugElement.query(By.css('.image-placeholder'));
    expect(placeholder.nativeElement.textContent).toContain('Select a picture');
  });

  it('should render tags as chips', () => {
    component.tags = ['art', 'nature', 'travel'];
    fixture.detectChanges();

    const chips = fixture.debugElement.queryAll(By.css('ion-chip'));
    expect(chips.length).toBe(3);
    expect(chips[0].nativeElement.textContent).toContain('art');
    expect(chips[1].nativeElement.textContent).toContain('nature');
    expect(chips[2].nativeElement.textContent).toContain('travel');
  });

  it('should render details in the textarea', () => {
    component.details = 'This is a test description.';
    fixture.detectChanges();

    const textarea = fixture.debugElement.query(By.css('ion-textarea'));
    expect(textarea).toBeTruthy();
    expect(textarea.attributes['ng-reflect-value']).toContain('This is a test description.');
  });
});
