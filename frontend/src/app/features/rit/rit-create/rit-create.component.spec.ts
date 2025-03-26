import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RitCreateComponent } from './rit-create.component';

describe('RitFormComponent', () => {
  let component: RitCreateComponent;
  let fixture: ComponentFixture<RitCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RitCreateComponent, IonicModule.forRoot(), FormsModule], // standalone
    }).compileComponents();

    fixture = TestBed.createComponent(RitCreateComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render ritName in the ion-input', () => {
    component.ritName = 'Test Rit';
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('[data-testid="rit-name-input"]'));
    expect(input.attributes['ng-reflect-value']).toContain('Test Rit');
  });

  it('should show the selected image when selectedImage is set', () => {
    component.selectedImage = 'http://example.com/image.jpg';
    fixture.detectChanges();

    const image = fixture.debugElement.query(By.css('[data-testid="image-preview"] ion-img'));
    expect(image).toBeTruthy();
    expect(image.attributes['ng-reflect-src']).toBe('http://example.com/image.jpg');
  });

  it('should show placeholder when no image is selected', () => {
    component.selectedImage = null;
    fixture.detectChanges();

    const placeholder = fixture.debugElement.query(By.css('[data-testid="image-placeholder"]'));
    expect(placeholder.nativeElement.textContent.trim()).toBe('Select a picture');
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

  it('should render the details text in ion-textarea', () => {
    component.details = 'Here are the details.';
    fixture.detectChanges();

    const textarea = fixture.debugElement.query(By.css('[data-testid="details-textarea"]'));
    expect(textarea.attributes['ng-reflect-value']).toContain('Here are the details.');
  });

  it('should call selectImage() when image container is clicked', () => {
    spyOn(component, 'selectImage');
    fixture.detectChanges();

    const imageContainer = fixture.debugElement.query(By.css('[data-testid="image-container"]'));
    imageContainer.triggerEventHandler('click', null);

    expect(component.selectImage).toHaveBeenCalled();
  });
});
